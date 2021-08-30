module.exports = async function proxy(res, { response }) {
  res.status(response.status);

  for (const [key, value] of Object.entries(response.headers)) {
    res.set(key, value);
  }

  if (response.headers['content-type'] && response.headers['content-type'].startsWith('application/json')) {
    res.json(response.body);
  } else {
    res.send(response.body);
  }
};
