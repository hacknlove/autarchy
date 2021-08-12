"use strict";
(() => {
var exports = {};
exports.id = 898;
exports.ids = [898];
exports.modules = {

/***/ 715:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Request),
  "getServerSideProps": () => (/* binding */ getServerSideProps)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(282);
// EXTERNAL MODULE: ./node_modules/date-fns/esm/formatDistanceToNow/index.js + 24 modules
var formatDistanceToNow = __webpack_require__(253);
// EXTERNAL MODULE: ./server/mongoProxy.js
var mongoProxy = __webpack_require__(426);
// EXTERNAL MODULE: external "bson"
var external_bson_ = __webpack_require__(61);
;// CONCATENATED MODULE: ./server/getRequest.js


async function getRequest(_id) {
  await mongoProxy/* default.waitFor */.Z.waitFor;
  return external_bson_.EJSON.serialize(await mongoProxy/* default.requests.findOne */.Z.requests.findOne({
    _id: (0,external_bson_.ObjectId)(_id)
  }));
}
;// CONCATENATED MODULE: ./components/RequestView/Rest.jsx

function Graphql(props) {
  return /*#__PURE__*/jsx_runtime_.jsx("pre", {
    children: JSON.stringify(props, null, 4)
  });
}
// EXTERNAL MODULE: external "next/head"
var head_ = __webpack_require__(701);
var head_default = /*#__PURE__*/__webpack_require__.n(head_);
;// CONCATENATED MODULE: ./components/RequestView/Graphql.jsx




function Graphql_Graphql({
  request,
  response
}) {
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
    children: [/*#__PURE__*/jsx_runtime_.jsx((head_default()), {
      children: /*#__PURE__*/(0,jsx_runtime_.jsxs)("title", {
        children: [request.graphql.operationName, " - request.graphql.query"]
      })
    }), /*#__PURE__*/jsx_runtime_.jsx("h2", {
      children: request.graphql.operationName
    }), /*#__PURE__*/jsx_runtime_.jsx("h3", {
      children: "Query:"
    }), /*#__PURE__*/jsx_runtime_.jsx("code", {
      children: /*#__PURE__*/jsx_runtime_.jsx("pre", {
        children: request.graphql.query
      })
    }), /*#__PURE__*/jsx_runtime_.jsx("h3", {
      children: "Variables"
    }), /*#__PURE__*/jsx_runtime_.jsx("code", {
      children: /*#__PURE__*/jsx_runtime_.jsx("pre", {
        children: JSON.stringify(request.graphql.variables, null, 4)
      })
    }), /*#__PURE__*/jsx_runtime_.jsx("h3", {
      children: "Response"
    }), /*#__PURE__*/jsx_runtime_.jsx("code", {
      children: /*#__PURE__*/jsx_runtime_.jsx("pre", {
        children: JSON.stringify(response, null, 4)
      })
    })]
  });
}
;// CONCATENATED MODULE: ./pages/request/[id].js



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





function Request({
  request
}) {
  var _request$start, _request$end;

  const Handler = request.request.graphql ? Graphql_Graphql : Graphql;
  const start = (_request$start = request.start) !== null && _request$start !== void 0 && _request$start.$date ? (0,formatDistanceToNow/* default */.Z)(new Date(request.start.$date)) : '';
  const end = (_request$end = request.end) !== null && _request$end !== void 0 && _request$end.$date ? (0,formatDistanceToNow/* default */.Z)(new Date(request.start.$date)) : '';
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)("section", {
    children: [/*#__PURE__*/jsx_runtime_.jsx("h1", {
      children: request.service
    }), /*#__PURE__*/jsx_runtime_.jsx(Handler, _objectSpread(_objectSpread({}, request), {}, {
      start: start,
      end: end
    }))]
  });
}
async function getServerSideProps(ctx) {
  const request = await getRequest(ctx.query.id);
  return {
    props: {
      request
    }
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

/***/ }),

/***/ 701:
/***/ ((module) => {

module.exports = require("next/head");

/***/ }),

/***/ 282:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [253,426], () => (__webpack_exec__(715)));
module.exports = __webpack_exports__;

})();