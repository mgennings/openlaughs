// This file MUST exist at the root for Amplify + Lambda.
// Amplify sets handler = index.handler, so Lambda looks for /var/task/index.js.

exports.handler = async (event, context) => {
  const { handler: innerHandler } = require('./src/index');
  return innerHandler(event, context);
};
