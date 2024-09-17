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
/*!*****************************!*\
  !*** ./src/main/preload.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
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
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on(channel, subscription);
            return () => {
                electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeListener(channel, subscription);
            };
        },
        once(channel, func) {
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },
        invoke: (channel, ...args) => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(channel, ...args), // Add invoke method
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
            // ipcRenderer.send('zoom-level-changed', level);
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on('zoom-level-changed', (event, zoomLevel) => {
                electron__WEBPACK_IMPORTED_MODULE_0__.webFrame.setZoomLevel(zoomLevel);
            });
        },
    },
    selectFolder: () => {
        electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send('select-folder'); // Send message to trigger folder selection
    },
};
electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld('electron', electronHandler);

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QixpREFBaUQ7WUFDakQsaURBQVcsQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUU7Z0JBQ3hELDhDQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztLQUNGO0lBQ0QsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUNqQixpREFBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLDJDQUEyQztJQUNoRixDQUFDO0NBQ0YsQ0FBQztBQUVGLG1EQUFhLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGVhZGRicy1zdGltY29udHJvbGxlci93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vbGVhZGRicy1zdGltY29udHJvbGxlci9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9sZWFkZGJzLXN0aW1jb250cm9sbGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2xlYWRkYnMtc3RpbWNvbnRyb2xsZXIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vbGVhZGRicy1zdGltY29udHJvbGxlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbGVhZGRicy1zdGltY29udHJvbGxlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2xlYWRkYnMtc3RpbWNvbnRyb2xsZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9sZWFkZGJzLXN0aW1jb250cm9sbGVyLy4vc3JjL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyLCBJcGNSZW5kZXJlckV2ZW50LCB3ZWJGcmFtZSB9IGZyb20gJ2VsZWN0cm9uJztcblxuLy8gZXhwb3J0IHR5cGUgQ2hhbm5lbHMgPSAnaXBjLWV4YW1wbGUnO1xuXG4vLyBjb25zdCBlbGVjdHJvbkhhbmRsZXIgPSB7XG4vLyAgIGlwY1JlbmRlcmVyOiB7XG4vLyAgICAgc2VuZE1lc3NhZ2UoY2hhbm5lbDogQ2hhbm5lbHMsIC4uLmFyZ3M6IHVua25vd25bXSkge1xuLy8gICAgICAgaXBjUmVuZGVyZXIuc2VuZChjaGFubmVsLCAuLi5hcmdzKTtcbi8vICAgICB9LFxuLy8gICAgIG9uKGNoYW5uZWw6IENoYW5uZWxzLCBmdW5jOiAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkKSB7XG4vLyAgICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSAoX2V2ZW50OiBJcGNSZW5kZXJlckV2ZW50LCAuLi5hcmdzOiB1bmtub3duW10pID0+XG4vLyAgICAgICAgIGZ1bmMoLi4uYXJncyk7XG4vLyAgICAgICBpcGNSZW5kZXJlci5vbihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuXG4vLyAgICAgICByZXR1cm4gKCkgPT4ge1xuLy8gICAgICAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuLy8gICAgICAgfTtcbi8vICAgICB9LFxuLy8gICAgIG9uY2UoY2hhbm5lbDogQ2hhbm5lbHMsIGZ1bmM6ICguLi5hcmdzOiB1bmtub3duW10pID0+IHZvaWQpIHtcbi8vICAgICAgIGlwY1JlbmRlcmVyLm9uY2UoY2hhbm5lbCwgKF9ldmVudCwgLi4uYXJncykgPT4gZnVuYyguLi5hcmdzKSk7XG4vLyAgICAgfSxcbi8vICAgfSxcbi8vIH07XG5cbi8vIGNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2VsZWN0cm9uJywgZWxlY3Ryb25IYW5kbGVyKTtcblxuLy8gZXhwb3J0IHR5cGUgRWxlY3Ryb25IYW5kbGVyID0gdHlwZW9mIGVsZWN0cm9uSGFuZGxlcjtcblxuLy8gRGlzYWJsZSBuby11bnVzZWQtdmFycywgYnJva2VuIGZvciBzcHJlYWQgYXJnc1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBvZmYgKi9cbmltcG9ydCB7XG4gIGNvbnRleHRCcmlkZ2UsXG4gIGlwY1JlbmRlcmVyLFxuICBJcGNSZW5kZXJlckV2ZW50LFxuICB3ZWJGcmFtZSxcbn0gZnJvbSAnZWxlY3Ryb24nO1xuXG5leHBvcnQgdHlwZSBDaGFubmVscyA9ICdpcGMtZXhhbXBsZSc7XG5cbmNvbnN0IGVsZWN0cm9uSGFuZGxlciA9IHtcbiAgaXBjUmVuZGVyZXI6IHtcbiAgICBzZW5kTWVzc2FnZShjaGFubmVsOiBDaGFubmVscywgLi4uYXJnczogdW5rbm93bltdKSB7XG4gICAgICBpcGNSZW5kZXJlci5zZW5kKGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgIH0sXG4gICAgb24oY2hhbm5lbDogQ2hhbm5lbHMsIGZ1bmM6ICguLi5hcmdzOiB1bmtub3duW10pID0+IHZvaWQpIHtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IChfZXZlbnQ6IElwY1JlbmRlcmVyRXZlbnQsIC4uLmFyZ3M6IHVua25vd25bXSkgPT5cbiAgICAgICAgZnVuYyguLi5hcmdzKTtcbiAgICAgIGlwY1JlbmRlcmVyLm9uKGNoYW5uZWwsIHN1YnNjcmlwdGlvbik7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlwY1JlbmRlcmVyLnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIHN1YnNjcmlwdGlvbik7XG4gICAgICB9O1xuICAgIH0sXG4gICAgb25jZShjaGFubmVsOiBDaGFubmVscywgZnVuYzogKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gdm9pZCkge1xuICAgICAgaXBjUmVuZGVyZXIub25jZShjaGFubmVsLCAoX2V2ZW50LCAuLi5hcmdzKSA9PiBmdW5jKC4uLmFyZ3MpKTtcbiAgICB9LFxuICAgIGludm9rZTogKGNoYW5uZWwsIC4uLmFyZ3MpID0+IGlwY1JlbmRlcmVyLmludm9rZShjaGFubmVsLCAuLi5hcmdzKSwgLy8gQWRkIGludm9rZSBtZXRob2RcbiAgfSxcbiAgLy8gem9vbToge1xuICAvLyAgIHpvb21JbigpIHtcbiAgLy8gICAgIHdlYkZyYW1lLnNldFpvb21MZXZlbCh3ZWJGcmFtZS5nZXRab29tTGV2ZWwoKSArIDEpO1xuICAvLyAgIH0sXG4gIC8vICAgem9vbU91dCgpIHtcbiAgLy8gICAgIHdlYkZyYW1lLnNldFpvb21MZXZlbCh3ZWJGcmFtZS5nZXRab29tTGV2ZWwoKSAtIDEpO1xuICAvLyAgIH0sXG4gIC8vICAgcmVzZXRab29tKCkge1xuICAvLyAgICAgd2ViRnJhbWUuc2V0Wm9vbUxldmVsKDApO1xuICAvLyAgIH0sXG4gIC8vIH0sXG4gIC8vIHpvb206IHtcbiAgLy8gICB6b29tSW4oKSB7XG4gIC8vICAgICBjb25zdCBuZXdab29tTGV2ZWwgPSB3ZWJGcmFtZS5nZXRab29tTGV2ZWwoKSArIDE7XG4gIC8vICAgICB3ZWJGcmFtZS5zZXRab29tTGV2ZWwobmV3Wm9vbUxldmVsKTtcbiAgLy8gICAgIGlwY1JlbmRlcmVyLnNlbmQoJ3pvb20tbGV2ZWwtY2hhbmdlZCcsIG5ld1pvb21MZXZlbCk7XG4gIC8vICAgfSxcbiAgLy8gICB6b29tT3V0KCkge1xuICAvLyAgICAgY29uc3QgbmV3Wm9vbUxldmVsID0gd2ViRnJhbWUuZ2V0Wm9vbUxldmVsKCkgLSAxO1xuICAvLyAgICAgd2ViRnJhbWUuc2V0Wm9vbUxldmVsKG5ld1pvb21MZXZlbCk7XG4gIC8vICAgICBpcGNSZW5kZXJlci5zZW5kKCd6b29tLWxldmVsLWNoYW5nZWQnLCBuZXdab29tTGV2ZWwpO1xuICAvLyAgIH0sXG4gIC8vICAgcmVzZXRab29tKCkge1xuICAvLyAgICAgY29uc3QgbmV3Wm9vbUxldmVsID0gMDtcbiAgLy8gICAgIHdlYkZyYW1lLnNldFpvb21MZXZlbChuZXdab29tTGV2ZWwpO1xuICAvLyAgICAgaXBjUmVuZGVyZXIuc2VuZCgnem9vbS1sZXZlbC1jaGFuZ2VkJywgbmV3Wm9vbUxldmVsKTtcbiAgLy8gICB9LFxuICAvLyB9LFxuICB6b29tOiB7XG4gICAgc2V0Wm9vbUxldmVsKGxldmVsOiBhbnkpIHtcbiAgICAgIHdlYkZyYW1lLnNldFpvb21MZXZlbChsZXZlbCk7XG4gICAgICAvLyBpcGNSZW5kZXJlci5zZW5kKCd6b29tLWxldmVsLWNoYW5nZWQnLCBsZXZlbCk7XG4gICAgICBpcGNSZW5kZXJlci5vbignem9vbS1sZXZlbC1jaGFuZ2VkJywgKGV2ZW50LCB6b29tTGV2ZWwpID0+IHtcbiAgICAgICAgd2ViRnJhbWUuc2V0Wm9vbUxldmVsKHpvb21MZXZlbCk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuICBzZWxlY3RGb2xkZXI6ICgpID0+IHtcbiAgICBpcGNSZW5kZXJlci5zZW5kKCdzZWxlY3QtZm9sZGVyJyk7IC8vIFNlbmQgbWVzc2FnZSB0byB0cmlnZ2VyIGZvbGRlciBzZWxlY3Rpb25cbiAgfSxcbn07XG5cbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2VsZWN0cm9uJywgZWxlY3Ryb25IYW5kbGVyKTtcblxuZXhwb3J0IHR5cGUgRWxlY3Ryb25IYW5kbGVyID0gdHlwZW9mIGVsZWN0cm9uSGFuZGxlcjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==