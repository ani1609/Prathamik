require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const apiKey = process.env.CHATGPT_API_KEY;
const organization = process.env.CHATGPT_ORG;

const configuration = new Configuration({
  apiKey: apiKey,
  organization: organization
});

exports.openai = new OpenAIApi(configuration);