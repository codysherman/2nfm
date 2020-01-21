import { videoPlayers } from "./globals";

function setDefaults() {
  // TODO: unimplemented outside of Vue
}

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
  videoPlayers.push(videoPlayer);
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
