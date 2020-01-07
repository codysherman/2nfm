import * as globals from "./globals";
import { setDefaults } from "./setDefaults";

export function getAspectRatio(w, h) {
  function gcd(a, b) {
    return b == 0 ? a : gcd(b, a % b);
  }
  var r = gcd(w, h);
  return w / r / (h / r);
}

export function openVideoPreview(stream) {
  // var win = window.open("extension-pages/video.html?src=" + URL.createObjectURL(stream), "_blank", "top=0,left=0");
  var win = window.open("extension-pages/video.html", "_blank", "top=0,left=0");
  var timer = setInterval(function() {
    if (win.closed) {
      // captureDesktop();
      setDefaults();

      clearInterval(timer);
    }
  }, 1000);
  return win;
}

export function initVideoPlayer(stream) {
  var videoPlayer = document.createElement("video");
  videoPlayer.muted = !enableTabCaptureAPI;
  videoPlayer.volume = !!enableTabCaptureAPI;
  videoPlayer.autoplay = true;
  videoPlayer.srcObject = stream;
  globals.videoPlayers.push(videoPlayer);
}

export function addStreamStopListener(stream, callback) {
  var streamEndedEvent = "ended";
  if ("oninactive" in stream) {
    streamEndedEvent = "inactive";
  }
  stream.addEventListener(
    streamEndedEvent,
    function() {
      callback();
      callback = function() {};
    },
    false
  );
  stream.getAudioTracks().forEach(function(track) {
    track.addEventListener(
      streamEndedEvent,
      function() {
        callback();
        callback = function() {};
      },
      false
    );
  });
  stream.getVideoTracks().forEach(function(track) {
    track.addEventListener(
      streamEndedEvent,
      function() {
        callback();
        callback = function() {};
      },
      false
    );
  });
}

export function getUserMediaError(e) {
  setDefaults();

  chrome.windows.create({
    url:
      "data:text/html,<h1>getUserMediaError: " +
      JSON.stringify(e, null, "<br>") +
      "</h1><br>Constraints used:<br><pre>" +
      JSON.stringify(constraints, null, "<br>") +
      "</pre>",
    type: "popup",
    width: screen.width / 2,
    height: 170
  });
}

export function setViewerCount(viewerCount, externalThis) {
  // TODO: Convert this to work with Vue
  // console.log(externalThis);
  externalThis.viewerCount = viewerCount;
}
