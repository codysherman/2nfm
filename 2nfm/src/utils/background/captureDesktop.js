
import * as globals from './globals';
import { setDefaults } from './setDefaults';
import { onAccessApproved } from './onAccessApproved';

export function captureDesktop() {
  if (globals.connection && globals.connection.attachStreams[0]) {
    setDefaults();
    return;
  }

  globals.desktop_id = null;
  globals.constraints = null;
  globals.room_password = "";
  globals.room_id = "";
  globals.codecs = "default";
  globals.bandwidth = null;

  globals.enableTabCaptureAPI = null;
  globals.enableVideo = null;
  globals.enableAudio = null;
  globals.isSharingOn = null;

  globals.streaming_method = "RTCMultiConnection";

  globals.room_url_box = true;

  var resolutions = {};

  if (window.localStorage.getItem("room_password")) {
    globals.room_password = window.localStorage.getItem("room_password");
  }

  if (window.localStorage.getItem("room_id")) {
    globals.room_id = window.localStorage.getItem("room_id");
  }

  if (window.localStorage.getItem("streaming_method")) {
    globals.streaming_method = window.localStorage.getItem("streaming_method");
  }

  if (window.localStorage.getItem("room_url_box") === "false") {
    globals.room_url_box = false;
  }

  if (window.localStorage.getItem("codecs")) {
    globals.codecs = window.localStorage.getItem("codecs");
  }

  if (window.localStorage.getItem("bandwidth")) {
    globals.bandwidth = window.localStorage.getItem("bandwidth");
  }

  if (window.localStorage.getItem("enableVideo") == "true") {
    globals.enableVideo = window.localStorage.getItem("enableVideo");
  }

  if (window.localStorage.getItem("enableAudio") == "true") {
    globals.enableAudio = window.localStorage.getItem("enableAudio");
  }

  if (window.localStorage.getItem("enableTabCaptureAPI") == "true") {
    globals.enableTabCaptureAPI = window.localStorage.getItem("enableTabCaptureAPI");
  }

  if (window.localStorage.getItem("isSharingOn") == "true") {
    globals.isSharingOn = window.localStorage.getItem("isSharingOn");
  }

  var _resolutions = window.localStorage.getItem("resolutions");
  if (!_resolutions) {
    _resolutions = "fit-screen";
    // chrome.storage.sync.set(
    //   {
    //     resolutions: "fit-screen",
    //   },
    //   function() {}
    // );
  }

  if (_resolutions === "fit-screen") {
    // resolutions.maxWidth = screen.availWidth;
    // resolutions.maxHeight = screen.availHeight;

    resolutions.maxWidth = screen.width;
    resolutions.maxHeight = screen.height;
  }

  if (_resolutions === "4K") {
    resolutions.maxWidth = 3840;
    resolutions.maxHeight = 2160;
  }

  if (_resolutions === "1080p") {
    resolutions.maxWidth = 1920;
    resolutions.maxHeight = 1080;
  }

  if (_resolutions === "720p") {
    resolutions.maxWidth = 1280;
    resolutions.maxHeight = 720;
  }

  if (_resolutions === "480p") {
    resolutions.maxWidth = 853;
    resolutions.maxHeight = 480;
  }

  if (_resolutions === "360p") {
    resolutions.maxWidth = 640;
    resolutions.maxHeight = 360;
  }

  if (_resolutions === "4K") {
    alert(
      '"4K" resolutions is not stable in Chrome. Please try "fit-screen" instead.'
    );
  }

  var sources = [
    // 'screen',
    // 'window',
    "tab"
  ];

  if (globals.enableAudio) {
    sources.push("audio");
  }

  // if (globals.enableTabCaptureAPI) {
  //   captureTabUsingTabCapture(resolutions);
  //   return;
  // }

  // globals.desktop_id = chrome.desktopCapture.chooseDesktopMedia(sources, function(
  //   chromeMediaSourceId,
  //   opts
  // ) {
  //   opts = opts || {};
  //   opts.resolutions = resolutions;
  //   onAccessApproved(chromeMediaSourceId, opts);
  // });
  onAccessApproved();
}
