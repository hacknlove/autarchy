(() => {
var exports = {};
exports.id = 405;
exports.ids = [405];
exports.modules = {

/***/ 943:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Home),
  "getServerSideProps": () => (/* binding */ getServerSideProps)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(282);
// EXTERNAL MODULE: external "next/head"
var head_ = __webpack_require__(701);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(675);
// EXTERNAL MODULE: ./server/getAll.js
var getAll = __webpack_require__(181);
// EXTERNAL MODULE: ./node_modules/date-fns/esm/formatDistanceToNow/index.js + 24 modules
var formatDistanceToNow = __webpack_require__(253);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(664);
;// CONCATENATED MODULE: ./components/RequestItem/Rest.jsx

function Graphql(props) {
  return /*#__PURE__*/jsx_runtime_.jsx("pre", {
    children: JSON.stringify(props, null, 4)
  });
}
;// CONCATENATED MODULE: ./components/RequestItem/Graphql.jsx



function Graphql_Graphql(props) {
  var _props$request$body, _props$request$body$v;

  return /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
    children: [/*#__PURE__*/jsx_runtime_.jsx("td", {
      children: props.start
    }), /*#__PURE__*/jsx_runtime_.jsx("td", {
      children: props.service
    }), /*#__PURE__*/jsx_runtime_.jsx("td", {
      children: (_props$request$body = props.request.body) === null || _props$request$body === void 0 ? void 0 : _props$request$body.operationName
    }), /*#__PURE__*/jsx_runtime_.jsx("td", {
      children: Object.entries((_props$request$body$v = props.request.body.variables) !== null && _props$request$body$v !== void 0 ? _props$request$body$v : {}).map(([key, value]) => `${key}=${String(value)}`).join(',')
    })]
  });
}
;// CONCATENATED MODULE: ./components/RequestItem/Raw.jsx

function Raw_Graphql(props) {
  return /*#__PURE__*/jsx_runtime_.jsx("pre", {
    children: JSON.stringify(props, null, 4)
  });
}
;// CONCATENATED MODULE: ./components/RequestItem/index.jsx


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






const types = {
  REST: Graphql,
  graphql: Graphql_Graphql
};
function Request({
  request
}) {
  var _types$request$type;

  const start = (0,formatDistanceToNow/* default */.Z)(new Date(request.start.$date));
  const Handler = (_types$request$type = types[request.type]) !== null && _types$request$type !== void 0 ? _types$request$type : Raw_Graphql;
  return /*#__PURE__*/jsx_runtime_.jsx(next_link.default, {
    href: `/request/${request._id.$oid}`,
    children: /*#__PURE__*/jsx_runtime_.jsx("tr", {
      className: "clickable",
      children: /*#__PURE__*/jsx_runtime_.jsx(Handler, _objectSpread(_objectSpread({}, request), {}, {
        start: start
      }))
    })
  });
}
;// CONCATENATED MODULE: external "swr"
const external_swr_namespaceObject = require("swr");
var external_swr_default = /*#__PURE__*/__webpack_require__.n(external_swr_namespaceObject);
;// CONCATENATED MODULE: ./pages/index.js







function Home({
  getAll
}) {
  const {
    data: {
      requests
    }
  } = external_swr_default()('/api/getAll', {
    initialData: getAll,
    refreshInterval: 1000
  });
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)("section", {
    children: [/*#__PURE__*/jsx_runtime_.jsx("h1", {
      className: "text-lg",
      children: "Requests"
    }), /*#__PURE__*/(0,jsx_runtime_.jsxs)("table", {
      className: "w-full",
      children: [/*#__PURE__*/jsx_runtime_.jsx("thead", {
        children: /*#__PURE__*/(0,jsx_runtime_.jsxs)("tr", {
          children: [/*#__PURE__*/jsx_runtime_.jsx("th", {
            children: "Date"
          }), /*#__PURE__*/jsx_runtime_.jsx("th", {
            children: "service"
          }), /*#__PURE__*/jsx_runtime_.jsx("th", {
            children: "path/operation"
          }), /*#__PURE__*/jsx_runtime_.jsx("th", {
            children: "parameters"
          })]
        })
      }), /*#__PURE__*/jsx_runtime_.jsx("tbody", {
        children: requests.map(request => /*#__PURE__*/jsx_runtime_.jsx(Request, {
          request: request
        }, request._id))
      })]
    })]
  });
}
async function getServerSideProps(ctx) {
  return {
    props: {
      getAll: await (0,getAll/* default */.Z)()
    }
  };
}

/***/ }),

/***/ 181:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
module.exports = require("bson");

/***/ }),

/***/ 548:
/***/ ((module) => {

"use strict";
module.exports = require("mongodb");

/***/ }),

/***/ 325:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/denormalize-page-path.js");

/***/ }),

/***/ 822:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/image-config.js");

/***/ }),

/***/ 695:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/head.js");

/***/ }),

/***/ 378:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/i18n/normalize-locale-path.js");

/***/ }),

/***/ 162:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/mitt.js");

/***/ }),

/***/ 773:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 248:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/get-asset-path-from-route.js");

/***/ }),

/***/ 372:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/is-dynamic.js");

/***/ }),

/***/ 665:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/parse-relative-url.js");

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/querystring.js");

/***/ }),

/***/ 333:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/route-matcher.js");

/***/ }),

/***/ 456:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/route-regex.js");

/***/ }),

/***/ 556:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/to-base-64.js");

/***/ }),

/***/ 620:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 701:
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ 297:
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ 282:
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 431:
/***/ (() => {

/* (ignored) */

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [253,61,426], () => (__webpack_exec__(943)));
module.exports = __webpack_exports__;

})();