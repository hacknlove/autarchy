module.exports = async function proxy(res, { response }) {
  res.status(response.status);

  for (const [key, value] of Object.entries(response.headers)) {
    res.set(key, value);
  }
  res.send(response.body);
};
