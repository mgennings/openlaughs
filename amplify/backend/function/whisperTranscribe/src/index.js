const https = require('https');
const FormData = require('form-data');
const Busboy = require('busboy');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');

const ssmClient = new SSMClient();

// Cache for the API key to avoid repeated SSM calls
let cachedApiKey = null;

async function getOpenAIApiKey() {
  if (cachedApiKey) {
    return cachedApiKey;
  }

  const secretPath = process.env.OPENAI_API_KEY;
  if (!secretPath) {
    throw new Error(
      'OPENAI_API_KEY environment variable (secret path) not set',
    );
  }

  try {
    const response = await ssmClient.send(
      new GetParameterCommand({
        Name: secretPath,
        WithDecryption: true,
      }),
    );

    if (!response.Parameter || !response.Parameter.Value) {
      throw new Error('Secret not found in Parameter Store');
    }

    cachedApiKey = response.Parameter.Value;
    return cachedApiKey;
  } catch (error) {
    console.error('Failed to retrieve secret from Parameter Store:', error);
    throw new Error(`Failed to retrieve OpenAI API key: ${error.message}`);
  }
}

exports.handler = async event => {
  console.log('Whisper transcription handler invoked');

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ message: 'CORS preflight' }),
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Get OpenAI API key from Parameter Store (secret)
    const openaiApiKey = await getOpenAIApiKey();

    // Parse the multipart form data
    let audioBuffer;
    let contentType;
    let fileName;

    return new Promise((resolve, reject) => {
      const contentTypeHeader =
        event.headers['content-type'] || event.headers['Content-Type'];

      if (
        !contentTypeHeader ||
        !contentTypeHeader.includes('multipart/form-data')
      ) {
        return resolve({
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: 'Content-Type must be multipart/form-data',
          }),
        });
      }

      const busboy = Busboy({ headers: { 'content-type': contentTypeHeader } });
      const buffers = [];

      busboy.on('file', (fieldname, file, info) => {
        const { filename, encoding, mimeType } = info;
        console.log(
          `File [${fieldname}]: filename=${filename}, encoding=${encoding}, mimeType=${mimeType}`,
        );

        fileName = filename;
        contentType = mimeType;

        file.on('data', data => {
          buffers.push(data);
        });

        file.on('end', () => {
          audioBuffer = Buffer.concat(buffers);
          console.log(
            `File [${fieldname}] finished, ${audioBuffer.length} bytes`,
          );
        });
      });

      busboy.on('finish', async () => {
        if (!audioBuffer || audioBuffer.length === 0) {
          return resolve({
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'No audio file provided' }),
          });
        }

        console.log(
          `Processing audio file: ${audioBuffer.length} bytes, type: ${contentType}`,
        );

        try {
          // Create form data for OpenAI API
          const form = new FormData();
          form.append('file', audioBuffer, {
            filename: fileName || 'audio.mp3',
            contentType: contentType || 'audio/mpeg',
          });
          form.append('model', 'whisper-1');
          form.append('response_format', 'json');

          // Call OpenAI Whisper API
          const response = await new Promise((resolveApi, rejectApi) => {
            const req = https.request(
              {
                hostname: 'api.openai.com',
                path: '/v1/audio/transcriptions',
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${openaiApiKey}`,
                  ...form.getHeaders(),
                },
              },
              res => {
                let data = '';
                res.on('data', chunk => {
                  data += chunk;
                });
                res.on('end', () => {
                  if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                      const parsed = JSON.parse(data);
                      resolveApi({
                        statusCode: res.statusCode,
                        data: parsed,
                      });
                    } catch (e) {
                      rejectApi(
                        new Error(`Failed to parse response: ${e.message}`),
                      );
                    }
                  } else {
                    rejectApi(
                      new Error(
                        `OpenAI API error: ${res.statusCode} - ${data}`,
                      ),
                    );
                  }
                });
              },
            );

            req.on('error', error => {
              rejectApi(error);
            });

            form.pipe(req);
          });

          console.log('OpenAI API response received');

          resolve({
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: response.data.text || response.data.transcription || '',
              duration: response.data.duration,
            }),
          });
        } catch (error) {
          console.error('Error processing transcription:', error);
          resolve({
            statusCode: 500,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              error: error.message || 'Internal server error',
            }),
          });
        }
      });

      busboy.on('error', error => {
        console.error('Busboy error:', error);
        resolve({
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: error.message || 'Failed to parse form data',
          }),
        });
      });

      // Parse the body
      const body = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64')
        : Buffer.from(event.body || '', 'utf8');

      busboy.end(body);
    });
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: error.message || 'Internal server error',
      }),
    };
  }
};
