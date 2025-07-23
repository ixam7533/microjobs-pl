"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/auth/[...nextauth]";
exports.ids = ["pages/api/auth/[...nextauth]"];
exports.modules = {

/***/ "@next-auth/prisma-adapter":
/*!********************************************!*\
  !*** external "@next-auth/prisma-adapter" ***!
  \********************************************/
/***/ ((module) => {

module.exports = require("@next-auth/prisma-adapter");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "next-auth":
/*!****************************!*\
  !*** external "next-auth" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ "next-auth/providers/facebook":
/*!***********************************************!*\
  !*** external "next-auth/providers/facebook" ***!
  \***********************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers/facebook");

/***/ }),

/***/ "next-auth/providers/google":
/*!*********************************************!*\
  !*** external "next-auth/providers/google" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers/google");

/***/ }),

/***/ "next/dist/compiled/next-server/pages-api.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages-api.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages-api.runtime.dev.js");

/***/ }),

/***/ "(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2F%5B...nextauth%5D&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Fauth%2F%5B...nextauth%5D.ts&middlewareConfigBase64=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2F%5B...nextauth%5D&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Fauth%2F%5B...nextauth%5D.ts&middlewareConfigBase64=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   routeModule: () => (/* binding */ routeModule)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/pages-api/module.compiled */ \"(api)/./node_modules/next/dist/server/future/route-modules/pages-api/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(api)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(api)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var _pages_api_auth_nextauth_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/api/auth/[...nextauth].ts */ \"(api)/./pages/api/auth/[...nextauth].ts\");\n\n\n\n// Import the userland code.\n\n// Re-export the handler (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_auth_nextauth_ts__WEBPACK_IMPORTED_MODULE_3__, \"default\"));\n// Re-export config.\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_auth_nextauth_ts__WEBPACK_IMPORTED_MODULE_3__, \"config\");\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES_API,\n        page: \"/api/auth/[...nextauth]\",\n        pathname: \"/api/auth/[...nextauth]\",\n        // The following aren't used in production.\n        bundlePath: \"\",\n        filename: \"\"\n    },\n    userland: _pages_api_auth_nextauth_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n\n//# sourceMappingURL=pages-api.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LXJvdXRlLWxvYWRlci9pbmRleC5qcz9raW5kPVBBR0VTX0FQSSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCZwcmVmZXJyZWRSZWdpb249JmFic29sdXRlUGFnZVBhdGg9LiUyRnBhZ2VzJTJGYXBpJTJGYXV0aCUyRiU1Qi4uLm5leHRhdXRoJTVELnRzJm1pZGRsZXdhcmVDb25maWdCYXNlNjQ9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNMO0FBQzFEO0FBQzhEO0FBQzlEO0FBQ0EsaUVBQWUsd0VBQUssQ0FBQyx3REFBUSxZQUFZLEVBQUM7QUFDMUM7QUFDTyxlQUFlLHdFQUFLLENBQUMsd0RBQVE7QUFDcEM7QUFDTyx3QkFBd0IsZ0hBQW1CO0FBQ2xEO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLFlBQVk7QUFDWixDQUFDOztBQUVEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLz84YWVjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2VzQVBJUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9wYWdlcy1hcGkvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgaG9pc3QgfSBmcm9tIFwibmV4dC9kaXN0L2J1aWxkL3RlbXBsYXRlcy9oZWxwZXJzXCI7XG4vLyBJbXBvcnQgdGhlIHVzZXJsYW5kIGNvZGUuXG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiLi9wYWdlcy9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdLnRzXCI7XG4vLyBSZS1leHBvcnQgdGhlIGhhbmRsZXIgKHNob3VsZCBiZSB0aGUgZGVmYXVsdCBleHBvcnQpLlxuZXhwb3J0IGRlZmF1bHQgaG9pc3QodXNlcmxhbmQsIFwiZGVmYXVsdFwiKTtcbi8vIFJlLWV4cG9ydCBjb25maWcuXG5leHBvcnQgY29uc3QgY29uZmlnID0gaG9pc3QodXNlcmxhbmQsIFwiY29uZmlnXCIpO1xuLy8gQ3JlYXRlIGFuZCBleHBvcnQgdGhlIHJvdXRlIG1vZHVsZSB0aGF0IHdpbGwgYmUgY29uc3VtZWQuXG5leHBvcnQgY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgUGFnZXNBUElSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuUEFHRVNfQVBJLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdXCIsXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgYXJlbid0IHVzZWQgaW4gcHJvZHVjdGlvbi5cbiAgICAgICAgYnVuZGxlUGF0aDogXCJcIixcbiAgICAgICAgZmlsZW5hbWU6IFwiXCJcbiAgICB9LFxuICAgIHVzZXJsYW5kXG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFnZXMtYXBpLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2F%5B...nextauth%5D&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Fauth%2F%5B...nextauth%5D.ts&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(api)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE2QztBQUU3QyxNQUFNQyxTQUFTLElBQUlELHdEQUFZQTtBQUMvQixpRUFBZUMsTUFBTUEsRUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2xpYi9wcmlzbWEudHM/OTgyMiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcblxuY29uc3QgcHJpc21hID0gbmV3IFByaXNtYUNsaWVudCgpXG5leHBvcnQgZGVmYXVsdCBwcmlzbWFcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./lib/prisma.ts\n");

/***/ }),

/***/ "(api)/./pages/api/auth/[...nextauth].ts":
/*!*****************************************!*\
  !*** ./pages/api/auth/[...nextauth].ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/google */ \"next-auth/providers/google\");\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_auth_providers_facebook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/providers/facebook */ \"next-auth/providers/facebook\");\n/* harmony import */ var next_auth_providers_facebook__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_facebook__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @next-auth/prisma-adapter */ \"@next-auth/prisma-adapter\");\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../lib/prisma */ \"(api)/./lib/prisma.ts\");\n\n\n\n\n\n// Sprawdź czy mamy prawdziwe klucze OAuth (nie placeholdery)\nconst hasGoogleKeys = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_ID !== \"twoj_google_client_id\" && process.env.GOOGLE_CLIENT_SECRET !== \"twoj_google_client_secret\";\nconst hasFacebookKeys = process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET && process.env.FACEBOOK_CLIENT_ID !== \"twoj_facebook_client_id\" && process.env.FACEBOOK_CLIENT_SECRET !== \"twoj_facebook_client_secret\";\nconst providers = [];\nif (hasGoogleKeys) {\n    providers.push(next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1___default()({\n        clientId: process.env.GOOGLE_CLIENT_ID,\n        clientSecret: process.env.GOOGLE_CLIENT_SECRET\n    }));\n}\nif (hasFacebookKeys) {\n    providers.push(next_auth_providers_facebook__WEBPACK_IMPORTED_MODULE_2___default()({\n        clientId: process.env.FACEBOOK_CLIENT_ID,\n        clientSecret: process.env.FACEBOOK_CLIENT_SECRET\n    }));\n}\nconsole.log(\"NextAuth providers:\", providers.map((p)=>p.id));\nconst authOptions = {\n    adapter: (0,_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_3__.PrismaAdapter)(_lib_prisma__WEBPACK_IMPORTED_MODULE_4__[\"default\"]),\n    providers,\n    session: {\n        strategy: \"jwt\"\n    },\n    secret: process.env.NEXTAUTH_SECRET,\n    callbacks: {\n        async jwt (params) {\n            if (params.account) {\n                params.token.accessToken = params.account.access_token;\n            }\n            return params.token;\n        },\n        async session (params) {\n            params.session.accessToken = params.token.accessToken;\n            return params.session;\n        },\n        async signIn (params) {\n            // Zawsze pozwalaj na logowanie\n            return true;\n        },\n        async redirect ({ url, baseUrl }) {\n            // Po udanym logowaniu przekieruj na stronę główną\n            return baseUrl;\n        }\n    },\n    pages: {\n        signIn: \"/login\",\n        error: \"/login\"\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (next_auth__WEBPACK_IMPORTED_MODULE_0___default()(authOptions));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQWdDO0FBQ3VCO0FBQ0k7QUFDRjtBQUNqQjtBQUV4Qyw2REFBNkQ7QUFDN0QsTUFBTUssZ0JBQWdCQyxRQUFRQyxHQUFHLENBQUNDLGdCQUFnQixJQUM3QkYsUUFBUUMsR0FBRyxDQUFDRSxvQkFBb0IsSUFDaENILFFBQVFDLEdBQUcsQ0FBQ0MsZ0JBQWdCLEtBQUssMkJBQ2pDRixRQUFRQyxHQUFHLENBQUNFLG9CQUFvQixLQUFLO0FBRTFELE1BQU1DLGtCQUFrQkosUUFBUUMsR0FBRyxDQUFDSSxrQkFBa0IsSUFDOUJMLFFBQVFDLEdBQUcsQ0FBQ0ssc0JBQXNCLElBQ2xDTixRQUFRQyxHQUFHLENBQUNJLGtCQUFrQixLQUFLLDZCQUNuQ0wsUUFBUUMsR0FBRyxDQUFDSyxzQkFBc0IsS0FBSztBQUUvRCxNQUFNQyxZQUFZLEVBQUU7QUFFcEIsSUFBSVIsZUFBZTtJQUNqQlEsVUFBVUMsSUFBSSxDQUFDYixpRUFBY0EsQ0FBQztRQUM1QmMsVUFBVVQsUUFBUUMsR0FBRyxDQUFDQyxnQkFBZ0I7UUFDdENRLGNBQWNWLFFBQVFDLEdBQUcsQ0FBQ0Usb0JBQW9CO0lBQ2hEO0FBQ0Y7QUFFQSxJQUFJQyxpQkFBaUI7SUFDbkJHLFVBQVVDLElBQUksQ0FBQ1osbUVBQWdCQSxDQUFDO1FBQzlCYSxVQUFVVCxRQUFRQyxHQUFHLENBQUNJLGtCQUFrQjtRQUN4Q0ssY0FBY1YsUUFBUUMsR0FBRyxDQUFDSyxzQkFBc0I7SUFDbEQ7QUFDRjtBQUVBSyxRQUFRQyxHQUFHLENBQUMsdUJBQXVCTCxVQUFVTSxHQUFHLENBQUNDLENBQUFBLElBQUtBLEVBQUVDLEVBQUU7QUFFbkQsTUFBTUMsY0FBYztJQUN6QkMsU0FBU3BCLHdFQUFhQSxDQUFDQyxtREFBTUE7SUFDN0JTO0lBQ0FXLFNBQVM7UUFDUEMsVUFBVTtJQUNaO0lBQ0FDLFFBQVFwQixRQUFRQyxHQUFHLENBQUNvQixlQUFlO0lBQ25DQyxXQUFXO1FBQ1QsTUFBTUMsS0FBSUMsTUFBVztZQUNuQixJQUFJQSxPQUFPQyxPQUFPLEVBQUU7Z0JBQ2xCRCxPQUFPRSxLQUFLLENBQUNDLFdBQVcsR0FBR0gsT0FBT0MsT0FBTyxDQUFDRyxZQUFZO1lBQ3hEO1lBQ0EsT0FBT0osT0FBT0UsS0FBSztRQUNyQjtRQUNBLE1BQU1SLFNBQVFNLE1BQVc7WUFDdkJBLE9BQU9OLE9BQU8sQ0FBQ1MsV0FBVyxHQUFHSCxPQUFPRSxLQUFLLENBQUNDLFdBQVc7WUFDckQsT0FBT0gsT0FBT04sT0FBTztRQUN2QjtRQUNBLE1BQU1XLFFBQU9MLE1BQVc7WUFDdEIsK0JBQStCO1lBQy9CLE9BQU87UUFDVDtRQUNBLE1BQU1NLFVBQVMsRUFBRUMsR0FBRyxFQUFFQyxPQUFPLEVBQU87WUFDbEMsa0RBQWtEO1lBQ2xELE9BQU9BO1FBQ1Q7SUFDRjtJQUNBQyxPQUFPO1FBQ0xKLFFBQVE7UUFDUkssT0FBTztJQUNUO0FBQ0YsRUFBQztBQUVELGlFQUFleEMsZ0RBQVFBLENBQUNzQixZQUFZQSxFQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcGFnZXMvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS50cz8yZThiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBOZXh0QXV0aCBmcm9tICduZXh0LWF1dGgnXG5pbXBvcnQgR29vZ2xlUHJvdmlkZXIgZnJvbSAnbmV4dC1hdXRoL3Byb3ZpZGVycy9nb29nbGUnXG5pbXBvcnQgRmFjZWJvb2tQcm92aWRlciBmcm9tICduZXh0LWF1dGgvcHJvdmlkZXJzL2ZhY2Vib29rJ1xuaW1wb3J0IHsgUHJpc21hQWRhcHRlciB9IGZyb20gJ0BuZXh0LWF1dGgvcHJpc21hLWFkYXB0ZXInXG5pbXBvcnQgcHJpc21hIGZyb20gJy4uLy4uLy4uL2xpYi9wcmlzbWEnXG5cbi8vIFNwcmF3ZMW6IGN6eSBtYW15IHByYXdkeml3ZSBrbHVjemUgT0F1dGggKG5pZSBwbGFjZWhvbGRlcnkpXG5jb25zdCBoYXNHb29nbGVLZXlzID0gcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9JRCAmJiBcbiAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfU0VDUkVUICYmIFxuICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9JRCAhPT0gJ3R3b2pfZ29vZ2xlX2NsaWVudF9pZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfU0VDUkVUICE9PSAndHdval9nb29nbGVfY2xpZW50X3NlY3JldCdcblxuY29uc3QgaGFzRmFjZWJvb2tLZXlzID0gcHJvY2Vzcy5lbnYuRkFDRUJPT0tfQ0xJRU5UX0lEICYmIFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5lbnYuRkFDRUJPT0tfQ0xJRU5UX1NFQ1JFVCAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZW52LkZBQ0VCT09LX0NMSUVOVF9JRCAhPT0gJ3R3b2pfZmFjZWJvb2tfY2xpZW50X2lkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5lbnYuRkFDRUJPT0tfQ0xJRU5UX1NFQ1JFVCAhPT0gJ3R3b2pfZmFjZWJvb2tfY2xpZW50X3NlY3JldCdcblxuY29uc3QgcHJvdmlkZXJzID0gW11cblxuaWYgKGhhc0dvb2dsZUtleXMpIHtcbiAgcHJvdmlkZXJzLnB1c2goR29vZ2xlUHJvdmlkZXIoe1xuICAgIGNsaWVudElkOiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX0lEISxcbiAgICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfU0VDUkVUISxcbiAgfSkpXG59XG5cbmlmIChoYXNGYWNlYm9va0tleXMpIHtcbiAgcHJvdmlkZXJzLnB1c2goRmFjZWJvb2tQcm92aWRlcih7XG4gICAgY2xpZW50SWQ6IHByb2Nlc3MuZW52LkZBQ0VCT09LX0NMSUVOVF9JRCEsXG4gICAgY2xpZW50U2VjcmV0OiBwcm9jZXNzLmVudi5GQUNFQk9PS19DTElFTlRfU0VDUkVUISxcbiAgfSkpXG59XG5cbmNvbnNvbGUubG9nKCdOZXh0QXV0aCBwcm92aWRlcnM6JywgcHJvdmlkZXJzLm1hcChwID0+IHAuaWQpKVxuXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnMgPSB7XG4gIGFkYXB0ZXI6IFByaXNtYUFkYXB0ZXIocHJpc21hKSxcbiAgcHJvdmlkZXJzLFxuICBzZXNzaW9uOiB7XG4gICAgc3RyYXRlZ3k6ICdqd3QnIGFzIGNvbnN0LFxuICB9LFxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcbiAgY2FsbGJhY2tzOiB7XG4gICAgYXN5bmMgand0KHBhcmFtczogYW55KSB7XG4gICAgICBpZiAocGFyYW1zLmFjY291bnQpIHtcbiAgICAgICAgcGFyYW1zLnRva2VuLmFjY2Vzc1Rva2VuID0gcGFyYW1zLmFjY291bnQuYWNjZXNzX3Rva2VuXG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyYW1zLnRva2VuXG4gICAgfSxcbiAgICBhc3luYyBzZXNzaW9uKHBhcmFtczogYW55KSB7XG4gICAgICBwYXJhbXMuc2Vzc2lvbi5hY2Nlc3NUb2tlbiA9IHBhcmFtcy50b2tlbi5hY2Nlc3NUb2tlbiBhcyBzdHJpbmdcbiAgICAgIHJldHVybiBwYXJhbXMuc2Vzc2lvblxuICAgIH0sXG4gICAgYXN5bmMgc2lnbkluKHBhcmFtczogYW55KSB7XG4gICAgICAvLyBaYXdzemUgcG96d2FsYWogbmEgbG9nb3dhbmllXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG4gICAgYXN5bmMgcmVkaXJlY3QoeyB1cmwsIGJhc2VVcmwgfTogYW55KSB7XG4gICAgICAvLyBQbyB1ZGFueW0gbG9nb3dhbml1IHByemVraWVydWogbmEgc3Ryb27EmSBnxYLDs3duxIVcbiAgICAgIHJldHVybiBiYXNlVXJsXG4gICAgfSxcbiAgfSxcbiAgcGFnZXM6IHtcbiAgICBzaWduSW46ICcvbG9naW4nLFxuICAgIGVycm9yOiAnL2xvZ2luJywgLy8gVyBwcnp5cGFka3UgYsWCxJlkdSB0ZcW8IHByemVraWVydWogbmEgbG9naW5cbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgTmV4dEF1dGgoYXV0aE9wdGlvbnMpXG4iXSwibmFtZXMiOlsiTmV4dEF1dGgiLCJHb29nbGVQcm92aWRlciIsIkZhY2Vib29rUHJvdmlkZXIiLCJQcmlzbWFBZGFwdGVyIiwicHJpc21hIiwiaGFzR29vZ2xlS2V5cyIsInByb2Nlc3MiLCJlbnYiLCJHT09HTEVfQ0xJRU5UX0lEIiwiR09PR0xFX0NMSUVOVF9TRUNSRVQiLCJoYXNGYWNlYm9va0tleXMiLCJGQUNFQk9PS19DTElFTlRfSUQiLCJGQUNFQk9PS19DTElFTlRfU0VDUkVUIiwicHJvdmlkZXJzIiwicHVzaCIsImNsaWVudElkIiwiY2xpZW50U2VjcmV0IiwiY29uc29sZSIsImxvZyIsIm1hcCIsInAiLCJpZCIsImF1dGhPcHRpb25zIiwiYWRhcHRlciIsInNlc3Npb24iLCJzdHJhdGVneSIsInNlY3JldCIsIk5FWFRBVVRIX1NFQ1JFVCIsImNhbGxiYWNrcyIsImp3dCIsInBhcmFtcyIsImFjY291bnQiLCJ0b2tlbiIsImFjY2Vzc1Rva2VuIiwiYWNjZXNzX3Rva2VuIiwic2lnbkluIiwicmVkaXJlY3QiLCJ1cmwiLCJiYXNlVXJsIiwicGFnZXMiLCJlcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/auth/[...nextauth].ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2F%5B...nextauth%5D&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Fauth%2F%5B...nextauth%5D.ts&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();