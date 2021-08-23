
const mongo = {
  waitFor: Promise.resolve(),
  'TEST-test': {
    findOne: jest.fn(),
    insertOne: jest.fn()
  },
  requests: {
    updateOne: jest.fn(),
    insertOne: jest.fn()
  }
};

const mongoHandler = {
  get(target, name) {
    if (target[name]) {
      return target[name];
    }

    throw `${name} not implemented`
  },
};


const mongoProxy = new Proxy(mongo, mongoHandler);



mongoProxy.connect = jest.fn();

module.exports = mongoProxy;
