import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import amplifyconfig from '@/amplifyconfiguration.json';

export async function uploadPublicImage(
  key: string,
  file: File | Blob,
  contentType?: string,
): Promise<string> {
  await uploadData({
    key,
    data: file,
    options: { accessLevel: 'guest', contentType },
  }).result;
  return key;
}

export async function getPublicUrl(key: string, expiresInSeconds = 300) {
  const { url } = await getUrl({
    key,
    options: { accessLevel: 'guest', expiresIn: expiresInSeconds },
  });
  return url;
}

export async function deletePublicObject(key: string) {
  await remove({ key, options: { accessLevel: 'guest' } });
}
