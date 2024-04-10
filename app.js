const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const Anthropic = require('@anthropic-ai/sdk');
const dotenv = require('dotenv')

const app = express();
dotenv.config();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY});

async function main() {
  const result = await client.completions.create({
    promt: "\n\nHuman: Act a helpful AI assistant for a church. ${Anthropic.AI_PROMT}",
    model: "claude-2.1",
    max_tokens_to_sample: 300,
  });
  console.log(result.completion);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
app.post('/voice', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();
  twiml.say('Hello, Step One is done.');

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

// Create an HTTP server and listen for requests on port 8080
app.listen(8080, () => {
  console.log(
    'Now listening on port 8080. ' +
    'Be sure to restart when you make code changes!'
  );
});
