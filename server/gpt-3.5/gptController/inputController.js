const { openai } = require('../openAi.js');

exports.handleInput = async function (req, res) {
  const input = req.body.input;

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: input }]
  });

  let output = response.data.choices[0].message.content;

  res.json({ output });
};
