(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./src/main/preload.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
// // Disable no-unused-vars, broken for spread args
// /* eslint no-unused-vars: off */
// import { contextBridge, ipcRenderer, IpcRendererEvent, webFrame } from 'electron';
// export type Channels = 'ipc-example';
// const electronHandler = {
//   ipcRenderer: {
//     sendMessage(channel: Channels, ...args: unknown[]) {
//       ipcRenderer.send(channel, ...args);
//     },
//     on(channel: Channels, func: (...args: unknown[]) => void) {
//       const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
//         func(...args);
//       ipcRenderer.on(channel, subscription);
//       return () => {
//         ipcRenderer.removeListener(channel, subscription);
//       };
//     },
//     once(channel: Channels, func: (...args: unknown[]) => void) {
//       ipcRenderer.once(channel, (_event, ...args) => func(...args));
//     },
//   },
// };
// contextBridge.exposeInMainWorld('electron', electronHandler);
// export type ElectronHandler = typeof electronHandler;
// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */

const electronHandler = {
    ipcRenderer: {
        sendMessage(channel, ...args) {
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send(channel, ...args);
        },
        on(channel, func) {
            const subscription = (_event, ...args) => func(...args);
            // const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => {
            //   try {
            //     func(...args);
            //   } catch (error) {
            //     // Handle or log the error here
            //     console.error('Error in IPC callback:', error);
            //   }
            // };
            // const subscription = (_event, ...args) => {
            //   console.log(`Received args for channel ${channel}:`, args);
            //   if (args && args.length > 0 && args[0] !== undefined) {
            //     func(...args);
            //   } else {
            //     console.error(
            //       `Received undefined or empty args for channel ${channel}`,
            //     );
            //   }
            // };
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on(channel, subscription);
            return () => {
                electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeListener(channel, subscription);
            };
        },
        once(channel, func) {
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },
    },
    // zoom: {
    //   zoomIn() {
    //     webFrame.setZoomLevel(webFrame.getZoomLevel() + 1);
    //   },
    //   zoomOut() {
    //     webFrame.setZoomLevel(webFrame.getZoomLevel() - 1);
    //   },
    //   resetZoom() {
    //     webFrame.setZoomLevel(0);
    //   },
    // },
    // zoom: {
    //   zoomIn() {
    //     const newZoomLevel = webFrame.getZoomLevel() + 1;
    //     webFrame.setZoomLevel(newZoomLevel);
    //     ipcRenderer.send('zoom-level-changed', newZoomLevel);
    //   },
    //   zoomOut() {
    //     const newZoomLevel = webFrame.getZoomLevel() - 1;
    //     webFrame.setZoomLevel(newZoomLevel);
    //     ipcRenderer.send('zoom-level-changed', newZoomLevel);
    //   },
    //   resetZoom() {
    //     const newZoomLevel = 0;
    //     webFrame.setZoomLevel(newZoomLevel);
    //     ipcRenderer.send('zoom-level-changed', newZoomLevel);
    //   },
    // },
    zoom: {
        setZoomLevel(level) {
            electron__WEBPACK_IMPORTED_MODULE_0__.webFrame.setZoomLevel(level);
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send('zoom-level-changed', level);
        },
    },
};
electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld('electron', electronHandler);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFPO0lBQ1Asa0JBQWtCO0lBQ2xCLDhCQUE4QjtJQUM5QiwyQ0FBMkM7SUFDM0MsNERBQTREO0lBQzVELE9BQU87SUFDUCxLQUFLO0lBQ0wsSUFBSSxFQUFFO1FBQ0osWUFBWSxDQUFDLEtBQVU7WUFDckIsOENBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0IsaURBQVcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEQsQ0FBQztLQUNGO0NBQ0YsQ0FBQztBQUVGLG1EQUFhLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGVhZGRicy1zdGltY29udHJvbGxlci93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vbGVhZGRicy1zdGltY29udHJvbGxlci9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9sZWFkZGJzLXN0aW1jb250cm9sbGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2xlYWRkYnMtc3RpbWNvbnRyb2xsZXIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vbGVhZGRicy1zdGltY29udHJvbGxlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbGVhZGRicy1zdGltY29udHJvbGxlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2xlYWRkYnMtc3RpbWNvbnRyb2xsZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9sZWFkZGJzLXN0aW1jb250cm9sbGVyLy4vc3JjL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIC8vIERpc2FibGUgbm8tdW51c2VkLXZhcnMsIGJyb2tlbiBmb3Igc3ByZWFkIGFyZ3Ncbi8vIC8qIGVzbGludCBuby11bnVzZWQtdmFyczogb2ZmICovXG4vLyBpbXBvcnQgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciwgSXBjUmVuZGVyZXJFdmVudCwgd2ViRnJhbWUgfSBmcm9tICdlbGVjdHJvbic7XG5cbi8vIGV4cG9ydCB0eXBlIENoYW5uZWxzID0gJ2lwYy1leGFtcGxlJztcblxuLy8gY29uc3QgZWxlY3Ryb25IYW5kbGVyID0ge1xuLy8gICBpcGNSZW5kZXJlcjoge1xuLy8gICAgIHNlbmRNZXNzYWdlKGNoYW5uZWw6IENoYW5uZWxzLCAuLi5hcmdzOiB1bmtub3duW10pIHtcbi8vICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoY2hhbm5lbCwgLi4uYXJncyk7XG4vLyAgICAgfSxcbi8vICAgICBvbihjaGFubmVsOiBDaGFubmVscywgZnVuYzogKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gdm9pZCkge1xuLy8gICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gKF9ldmVudDogSXBjUmVuZGVyZXJFdmVudCwgLi4uYXJnczogdW5rbm93bltdKSA9PlxuLy8gICAgICAgICBmdW5jKC4uLmFyZ3MpO1xuLy8gICAgICAgaXBjUmVuZGVyZXIub24oY2hhbm5lbCwgc3Vic2NyaXB0aW9uKTtcblxuLy8gICAgICAgcmV0dXJuICgpID0+IHtcbi8vICAgICAgICAgaXBjUmVuZGVyZXIucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgc3Vic2NyaXB0aW9uKTtcbi8vICAgICAgIH07XG4vLyAgICAgfSxcbi8vICAgICBvbmNlKGNoYW5uZWw6IENoYW5uZWxzLCBmdW5jOiAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkKSB7XG4vLyAgICAgICBpcGNSZW5kZXJlci5vbmNlKGNoYW5uZWwsIChfZXZlbnQsIC4uLmFyZ3MpID0+IGZ1bmMoLi4uYXJncykpO1xuLy8gICAgIH0sXG4vLyAgIH0sXG4vLyB9O1xuXG4vLyBjb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdlbGVjdHJvbicsIGVsZWN0cm9uSGFuZGxlcik7XG5cbi8vIGV4cG9ydCB0eXBlIEVsZWN0cm9uSGFuZGxlciA9IHR5cGVvZiBlbGVjdHJvbkhhbmRsZXI7XG5cbi8vIERpc2FibGUgbm8tdW51c2VkLXZhcnMsIGJyb2tlbiBmb3Igc3ByZWFkIGFyZ3Ncbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogb2ZmICovXG5pbXBvcnQge1xuICBjb250ZXh0QnJpZGdlLFxuICBpcGNSZW5kZXJlcixcbiAgSXBjUmVuZGVyZXJFdmVudCxcbiAgd2ViRnJhbWUsXG59IGZyb20gJ2VsZWN0cm9uJztcblxuZXhwb3J0IHR5cGUgQ2hhbm5lbHMgPSAnaXBjLWV4YW1wbGUnO1xuXG5jb25zdCBlbGVjdHJvbkhhbmRsZXIgPSB7XG4gIGlwY1JlbmRlcmVyOiB7XG4gICAgc2VuZE1lc3NhZ2UoY2hhbm5lbDogQ2hhbm5lbHMsIC4uLmFyZ3M6IHVua25vd25bXSkge1xuICAgICAgaXBjUmVuZGVyZXIuc2VuZChjaGFubmVsLCAuLi5hcmdzKTtcbiAgICB9LFxuICAgIG9uKGNoYW5uZWw6IENoYW5uZWxzLCBmdW5jOiAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkKSB7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSAoX2V2ZW50OiBJcGNSZW5kZXJlckV2ZW50LCAuLi5hcmdzOiB1bmtub3duW10pID0+XG4gICAgICAgIGZ1bmMoLi4uYXJncyk7XG4gICAgICAvLyBjb25zdCBzdWJzY3JpcHRpb24gPSAoX2V2ZW50OiBJcGNSZW5kZXJlckV2ZW50LCAuLi5hcmdzOiB1bmtub3duW10pID0+IHtcbiAgICAgIC8vICAgdHJ5IHtcbiAgICAgIC8vICAgICBmdW5jKC4uLmFyZ3MpO1xuICAgICAgLy8gICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gICAgIC8vIEhhbmRsZSBvciBsb2cgdGhlIGVycm9yIGhlcmVcbiAgICAgIC8vICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbiBJUEMgY2FsbGJhY2s6JywgZXJyb3IpO1xuICAgICAgLy8gICB9XG4gICAgICAvLyB9O1xuICAgICAgLy8gY29uc3Qgc3Vic2NyaXB0aW9uID0gKF9ldmVudCwgLi4uYXJncykgPT4ge1xuICAgICAgLy8gICBjb25zb2xlLmxvZyhgUmVjZWl2ZWQgYXJncyBmb3IgY2hhbm5lbCAke2NoYW5uZWx9OmAsIGFyZ3MpO1xuICAgICAgLy8gICBpZiAoYXJncyAmJiBhcmdzLmxlbmd0aCA+IDAgJiYgYXJnc1swXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyAgICAgZnVuYyguLi5hcmdzKTtcbiAgICAgIC8vICAgfSBlbHNlIHtcbiAgICAgIC8vICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgLy8gICAgICAgYFJlY2VpdmVkIHVuZGVmaW5lZCBvciBlbXB0eSBhcmdzIGZvciBjaGFubmVsICR7Y2hhbm5lbH1gLFxuICAgICAgLy8gICAgICk7XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH07XG4gICAgICBpcGNSZW5kZXJlci5vbihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuICAgICAgfTtcbiAgICB9LFxuICAgIG9uY2UoY2hhbm5lbDogQ2hhbm5lbHMsIGZ1bmM6ICguLi5hcmdzOiB1bmtub3duW10pID0+IHZvaWQpIHtcbiAgICAgIGlwY1JlbmRlcmVyLm9uY2UoY2hhbm5lbCwgKF9ldmVudCwgLi4uYXJncykgPT4gZnVuYyguLi5hcmdzKSk7XG4gICAgfSxcbiAgfSxcbiAgLy8gem9vbToge1xuICAvLyAgIHpvb21JbigpIHtcbiAgLy8gICAgIHdlYkZyYW1lLnNldFpvb21MZXZlbCh3ZWJGcmFtZS5nZXRab29tTGV2ZWwoKSArIDEpO1xuICAvLyAgIH0sXG4gIC8vICAgem9vbU91dCgpIHtcbiAgLy8gICAgIHdlYkZyYW1lLnNldFpvb21MZXZlbCh3ZWJGcmFtZS5nZXRab29tTGV2ZWwoKSAtIDEpO1xuICAvLyAgIH0sXG4gIC8vICAgcmVzZXRab29tKCkge1xuICAvLyAgICAgd2ViRnJhbWUuc2V0Wm9vbUxldmVsKDApO1xuICAvLyAgIH0sXG4gIC8vIH0sXG4gIC8vIHpvb206IHtcbiAgLy8gICB6b29tSW4oKSB7XG4gIC8vICAgICBjb25zdCBuZXdab29tTGV2ZWwgPSB3ZWJGcmFtZS5nZXRab29tTGV2ZWwoKSArIDE7XG4gIC8vICAgICB3ZWJGcmFtZS5zZXRab29tTGV2ZWwobmV3Wm9vbUxldmVsKTtcbiAgLy8gICAgIGlwY1JlbmRlcmVyLnNlbmQoJ3pvb20tbGV2ZWwtY2hhbmdlZCcsIG5ld1pvb21MZXZlbCk7XG4gIC8vICAgfSxcbiAgLy8gICB6b29tT3V0KCkge1xuICAvLyAgICAgY29uc3QgbmV3Wm9vbUxldmVsID0gd2ViRnJhbWUuZ2V0Wm9vbUxldmVsKCkgLSAxO1xuICAvLyAgICAgd2ViRnJhbWUuc2V0Wm9vbUxldmVsKG5ld1pvb21MZXZlbCk7XG4gIC8vICAgICBpcGNSZW5kZXJlci5zZW5kKCd6b29tLWxldmVsLWNoYW5nZWQnLCBuZXdab29tTGV2ZWwpO1xuICAvLyAgIH0sXG4gIC8vICAgcmVzZXRab29tKCkge1xuICAvLyAgICAgY29uc3QgbmV3Wm9vbUxldmVsID0gMDtcbiAgLy8gICAgIHdlYkZyYW1lLnNldFpvb21MZXZlbChuZXdab29tTGV2ZWwpO1xuICAvLyAgICAgaXBjUmVuZGVyZXIuc2VuZCgnem9vbS1sZXZlbC1jaGFuZ2VkJywgbmV3Wm9vbUxldmVsKTtcbiAgLy8gICB9LFxuICAvLyB9LFxuICB6b29tOiB7XG4gICAgc2V0Wm9vbUxldmVsKGxldmVsOiBhbnkpIHtcbiAgICAgIHdlYkZyYW1lLnNldFpvb21MZXZlbChsZXZlbCk7XG4gICAgICBpcGNSZW5kZXJlci5zZW5kKCd6b29tLWxldmVsLWNoYW5nZWQnLCBsZXZlbCk7XG4gICAgfSxcbiAgfSxcbn07XG5cbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2VsZWN0cm9uJywgZWxlY3Ryb25IYW5kbGVyKTtcblxuZXhwb3J0IHR5cGUgRWxlY3Ryb25IYW5kbGVyID0gdHlwZW9mIGVsZWN0cm9uSGFuZGxlcjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==