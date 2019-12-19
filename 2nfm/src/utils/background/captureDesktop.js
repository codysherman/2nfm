
import { setDefaults } from './setDefaults';
import { onAccessApproved } from './onAccessApproved';

export function captureDesktop(externalThis) {
  if (externalThis.connection && externalThis.connection.attachStreams[0]) {
    setDefaults(externalThis);
    return;
  }

  externalThis.desktop_id = null;
  externalThis.constraints = null;
  externalThis.room_password = "";
  externalThis.room_id = "";
  externalThis.codecs = "default";
  externalThis.bandwidth = null;

  externalThis.enableTabCaptureAPI = null;
  externalThis.enableVideo = null;
  externalThis.enableAudio = null;
  externalThis.isSharingOn = null;

  externalThis.streaming_method = "RTCMultiConnection";

  externalThis.room_url_box = true;

  var resolutions = {};

  if (window.localStorage.getItem("room_password")) {
    externalThis.room_password = window.localStorage.getItem("room_password");
  }

  if (window.localStorage.getItem("room_id")) {
    externalThis.room_id = window.localStorage.getItem("room_id");
  }

  if (window.localStorage.getItem("streaming_method")) {
    externalThis.streaming_method = window.localStorage.getItem("streaming_method");
  }

  if (window.localStorage.getItem("room_url_box") === "false") {
    externalThis.room_url_box = false;
  }

  if (window.localStorage.getItem("codecs")) {
    externalThis.codecs = window.localStorage.getItem("codecs");
  }

  if (window.localStorage.getItem("bandwidth")) {
    externalThis.bandwidth = window.localStorage.getItem("bandwidth");
  }

  if (window.localStorage.getItem("enableVideo") == "true") {
    externalThis.enableVideo = window.localStorage.getItem("enableVideo");
  }

  if (window.localStorage.getItem("enableAudio") == "true") {
    externalThis.enableAudio = window.localStorage.getItem("enableAudio");
  }

  if (window.localStorage.getItem("enableTabCaptureAPI") == "true") {
    externalThis.enableTabCaptureAPI = window.localStorage.getItem("enableTabCaptureAPI");
  }

  // if (window.localStorage.getItem("isSharingOn") == "true") {
  //   externalThis.isSharingOn = window.localStorage.getItem("isSharingOn");
  // }

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

  if (externalThis.enableAudio) {
    sources.push("audio");
  }

  // if (externalThis.enableTabCaptureAPI) {
  //   captureTabUsingTabCapture(resolutions);
  //   return;
  // }

  // externalThis.desktop_id = chrome.desktopCapture.chooseDesktopMedia(sources, function(
  //   chromeMediaSourceId,
  //   opts
  // ) {
  //   opts = opts || {};
  //   opts.resolutions = resolutions;
  //   onAccessApproved(chromeMediaSourceId, opts);
  // });
  onAccessApproved(externalThis);
}
