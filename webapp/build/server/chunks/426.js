"use strict";
exports.id = 426;
exports.ids = [426];
exports.modules = {

/***/ 426:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(548);
/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);

const mongoURL = process.env.MONGO_URL;
let res;
const mongo = {};
const mongoHandler = {
  get(target, name) {
    if (target[name]) {
      return target[name];
    }

    if (!target.db) {
      return null;
    }

    if (target.db[name]) {
      return target.db[name];
    }

    return target.db.collection(name);
  }

};
let maxTries;
const mongoProxy = new Proxy(mongo, mongoHandler);

async function mongoConnect() {
  const client = await mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).catch(err => ({
    err
  }));

  if (client.err) {
    if (maxTries--) {
      mongoConnect();
      return;
    }

    process.exit(1);
  }

  mongo.client = client;
  mongo.db = client.db();
  mongo.client = client;

  mongo.connect = () => undefined;

  res(mongo.db);
}

function reconnect() {
  maxTries = 10;
  mongo.waitFor = new Promise(resolve => {
    res = resolve;
  });
  mongo.db = null;
  mongoConnect();
}

reconnect();
mongoProxy.connect = reconnect;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mongoProxy);

/***/ })

};
;