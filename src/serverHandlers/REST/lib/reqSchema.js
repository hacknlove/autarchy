const Ajv = require('ajv');

const ajv = new Ajv();

module.exports = async function pre(context) {
  const { conf: { reqSchema }, request } = context;
  
  if (reqSchema) {
    const valid = ajv.validate(reqSchema, request);
  
    if (!valid) {
      console.error(ajv.errors);
    }
  }

  return context
};
