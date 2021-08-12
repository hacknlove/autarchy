"use strict";
(() => {
var exports = {};
exports.id = 866;
exports.ids = [866];
exports.modules = {

/***/ 9:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getAllAPIEndpoint)
/* harmony export */ });
/* harmony import */ var _server_getAll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(181);

async function getAllAPIEndpoint(req, res) {
  res.json(await (0,_server_getAll__WEBPACK_IMPORTED_MODULE_0__/* .default */ .Z)());
}

/***/ }),

/***/ 181:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ getAll)
/* harmony export */ });
/* harmony import */ var _mongoProxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(426);
/* harmony import */ var bson__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(61);
/* harmony import */ var bson__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bson__WEBPACK_IMPORTED_MODULE_1__);



function toArrayserialize(array) {
  return array.map(bson__WEBPACK_IMPORTED_MODULE_1__.EJSON.serialize);
}

async function getAll() {
  await _mongoProxy__WEBPACK_IMPORTED_MODULE_0__/* .default.waitFor */ .Z.waitFor;
  const logs = _mongoProxy__WEBPACK_IMPORTED_MODULE_0__/* .default.logs.find */ .Z.logs.find().sort({
    _id: -1
  }).toArray().then(toArrayserialize);
  const requests = _mongoProxy__WEBPACK_IMPORTED_MODULE_0__/* .default.requests.find */ .Z.requests.find().sort({
    _id: -1
  }).limit(50).toArray().then(toArrayserialize);
  const services = _mongoProxy__WEBPACK_IMPORTED_MODULE_0__/* .default.services.find */ .Z.services.find().toArray().then(toArrayserialize);
  return {
    logs: await logs,
    requests: await requests,
    services: await services
  };
}

/***/ }),

/***/ 61:
/***/ ((module) => {

module.exports = require("bson");

/***/ }),

/***/ 548:
/***/ ((module) => {

module.exports = require("mongodb");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [426], () => (__webpack_exec__(9)));
module.exports = __webpack_exports__;

})();