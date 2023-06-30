const sendMessage = (res) => (message, code) => {
  res.statusCode = code;
  res.end(message);
};

module.exports = { sendMessage };
