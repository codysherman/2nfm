
import { setDefaults } from './setDefaults';
import { onAccessApproved } from './onAccessApproved';

export function captureDesktop(externalThis) {
  if (externalThis.connection && externalThis.connection.attachStreams[0]) {
    setDefaults(externalThis);
    return;
  }

  externalThis.room_id = "";

  var resolutions = {};

  if (window.localStorage.getItem("room_id")) {
    externalThis.room_id = window.localStorage.getItem("room_id");
  }

  // TODO: why would we need to do this?
  //   - Cody: we don't need to worry about this because it was here for Chrome Extension
  externalThis.isSharingOn = 'true';

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
