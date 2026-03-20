"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/dashboard/page",{

/***/ "(app-pages-browser)/./lib/supabase/actions.ts":
/*!*********************************!*\
  !*** ./lib/supabase/actions.ts ***!
  \*********************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bookAppointment: function() { return /* binding */ bookAppointment; },
/* harmony export */   confirmUserEmail: function() { return /* binding */ confirmUserEmail; },
/* harmony export */   createUser: function() { return /* binding */ createUser; },
/* harmony export */   deleteBlogPost: function() { return /* binding */ deleteBlogPost; },
/* harmony export */   deleteNewsItem: function() { return /* binding */ deleteNewsItem; },
/* harmony export */   deleteProject: function() { return /* binding */ deleteProject; },
/* harmony export */   deleteUser: function() { return /* binding */ deleteUser; },
/* harmony export */   getAllAppointments: function() { return /* binding */ getAllAppointments; },
/* harmony export */   getAllUsers: function() { return /* binding */ getAllUsers; },
/* harmony export */   inviteUser: function() { return /* binding */ inviteUser; },
/* harmony export */   replyToAppointment: function() { return /* binding */ replyToAppointment; },
/* harmony export */   replyToContact: function() { return /* binding */ replyToContact; },
/* harmony export */   signIn: function() { return /* binding */ signIn; },
/* harmony export */   signOut: function() { return /* binding */ signOut; },
/* harmony export */   submitContactForm: function() { return /* binding */ submitContactForm; },
/* harmony export */   submitProjectInterest: function() { return /* binding */ submitProjectInterest; },
/* harmony export */   updateAboutContent: function() { return /* binding */ updateAboutContent; },
/* harmony export */   updateAppointmentStatus: function() { return /* binding */ updateAppointmentStatus; },
/* harmony export */   updateContactStatus: function() { return /* binding */ updateContactStatus; },
/* harmony export */   updateHomeContent: function() { return /* binding */ updateHomeContent; },
/* harmony export */   updateProjectSubmissionStatus: function() { return /* binding */ updateProjectSubmissionStatus; },
/* harmony export */   updateService: function() { return /* binding */ updateService; },
/* harmony export */   updateUserRole: function() { return /* binding */ updateUserRole; },
/* harmony export */   upsertBlogPost: function() { return /* binding */ upsertBlogPost; },
/* harmony export */   upsertNewsItem: function() { return /* binding */ upsertNewsItem; },
/* harmony export */   upsertProject: function() { return /* binding */ upsertProject; }
/* harmony export */ });
/* harmony import */ var next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/client/app-call-server */ "(app-pages-browser)/./node_modules/next/dist/client/app-call-server.js");
/* harmony import */ var next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! private-next-rsc-action-client-wrapper */ "(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js");



function __build_action__(action, args) {
  return (0,next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0__.callServer)(action.$$id, args)
}

/* __next_internal_action_entry_do_not_use__ {"030999dd2ba2701e3ee2703c0889558d1fad5ceb":"getAllUsers","2076c29857cc54ad0ed8cc9e556eee831944e564":"inviteUser","237b9633131324fddfb6adc2ca1bb6c7fbf5a037":"updateProjectSubmissionStatus","3434c3e5a988e604b3de4d0d72b22739e3a915bb":"replyToAppointment","470f4f581e0eba5d344404d929a7019acc9c0228":"updateService","49bdef754fb89a8cc0a77f2eb0f6a155bca8a09c":"submitProjectInterest","4c0c00dad3d7fe45c8f0ac83e3a10eaa48b88f48":"signIn","547e32b11c3d9f3c00906c9f88a9d789e9bf2323":"upsertBlogPost","57e5d68a1c04973711a83be9f5553779cf78f679":"updateUserRole","689f55fce30667fe6aa16401a432e54d68a1384e":"getAllAppointments","6b3c44ef3600115ba15791092f9486a6d1bb115e":"updateHomeContent","6c85509cce6ba731c0049169a47c363e1f51b29e":"submitContactForm","704963a34f54ce3f30c8654b70ba82b954d90a3c":"deleteBlogPost","71b59b6d201182bb16545b8fd5515642795b9875":"confirmUserEmail","88df60f36d07fe8587f97a2c1b3d4927dc717367":"signOut","8f1f409bc0d7240f9aa2328f36cf6adbff7da751":"upsertNewsItem","ab5193f5d72ea858ec652ace90458c91905614b7":"deleteProject","b2469761b41a3be873d5742f27968a8c320cd507":"upsertProject","b5e703f8a9ca04d7824349f0bf5bca7771d2f980":"updateAppointmentStatus","cca337b5c71b22d62f2d0e137709f0e531e94c9d":"createUser","d2a55da2ff13f3e07358a0d220a9a1fff3f3806b":"bookAppointment","d50890f4d9fdd25661d4b91d67084525bf3d32bb":"deleteNewsItem","ef1cd80dbe95b6a5acc84a2bb0a44a22ecbe0d48":"updateContactStatus","f392a9c3e2d0d5d4f5625d01036bf037eacaaf43":"deleteUser","f8e6e1753cdd98f9057d8a7f4f856ada846ba6e3":"replyToContact","ffe7fc22602920ad9380bf2329eb3dfc0e28055d":"updateAboutContent"} */ var deleteUser = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("f392a9c3e2d0d5d4f5625d01036bf037eacaaf43");

var submitContactForm = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("6c85509cce6ba731c0049169a47c363e1f51b29e");
var submitProjectInterest = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("49bdef754fb89a8cc0a77f2eb0f6a155bca8a09c");
var updateHomeContent = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("6b3c44ef3600115ba15791092f9486a6d1bb115e");
var updateAboutContent = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("ffe7fc22602920ad9380bf2329eb3dfc0e28055d");
var updateService = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("470f4f581e0eba5d344404d929a7019acc9c0228");
var upsertProject = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("b2469761b41a3be873d5742f27968a8c320cd507");
var deleteProject = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("ab5193f5d72ea858ec652ace90458c91905614b7");
var upsertBlogPost = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("547e32b11c3d9f3c00906c9f88a9d789e9bf2323");
var deleteBlogPost = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("704963a34f54ce3f30c8654b70ba82b954d90a3c");
var upsertNewsItem = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("8f1f409bc0d7240f9aa2328f36cf6adbff7da751");
var deleteNewsItem = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("d50890f4d9fdd25661d4b91d67084525bf3d32bb");
var updateContactStatus = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("ef1cd80dbe95b6a5acc84a2bb0a44a22ecbe0d48");
var updateProjectSubmissionStatus = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("237b9633131324fddfb6adc2ca1bb6c7fbf5a037");
var signIn = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("4c0c00dad3d7fe45c8f0ac83e3a10eaa48b88f48");
var signOut = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("88df60f36d07fe8587f97a2c1b3d4927dc717367");
var bookAppointment = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("d2a55da2ff13f3e07358a0d220a9a1fff3f3806b");
var getAllAppointments = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("689f55fce30667fe6aa16401a432e54d68a1384e");
var updateAppointmentStatus = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("b5e703f8a9ca04d7824349f0bf5bca7771d2f980");
var replyToContact = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("f8e6e1753cdd98f9057d8a7f4f856ada846ba6e3");
var replyToAppointment = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("3434c3e5a988e604b3de4d0d72b22739e3a915bb");
var inviteUser = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("2076c29857cc54ad0ed8cc9e556eee831944e564");
var updateUserRole = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("57e5d68a1c04973711a83be9f5553779cf78f679");
var confirmUserEmail = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("71b59b6d201182bb16545b8fd5515642795b9875");
var getAllUsers = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("030999dd2ba2701e3ee2703c0889558d1fad5ceb");
var createUser = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("cca337b5c71b22d62f2d0e137709f0e531e94c9d");



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ })

});