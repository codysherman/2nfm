"use strict";

let stream = null;

function startScreenCapture() {
  if (navigator.getDisplayMedia) {
    return navigator.getDisplayMedia({ video: true, audio: true });
  } else if (navigator.mediaDevices.getDisplayMedia) {
    return navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
  } else {
    return navigator.mediaDevices.getUserMedia({
      video: { mediaSource: "screen" },
    });
  }
}

async function startCapturing(e) {
  if (window.localStorage.getItem("room_id")) {
    room_id = window.localStorage.getItem("room_id");
  }
  stream = await startScreenCapture();
  stream.addEventListener("inactive", e => {
    stopCapturing(e);
  });
  shareStreamUsingRTCMultiConnection(stream);
}

function stopCapturing(e) {
  stream.getTracks().forEach(track => track.stop());
  stream = null;
}

document.getElementById("video-and-audio").onclick = function() {
  setDefaults();
  const streamFlags = {
    enableTabCaptureAPI: "false",
    isSharingOn: "true",
    enableVideo: "true",
    enableAudio: "true",
  };
  Object.keys(streamFlags).forEach(function(key) {
    window.localStorage.setItem(key, streamFlags[key]);
  });
  captureDesktop();
};

var isSharingOn = window.localStorage.getItem("isSharingOn") === "true";

document.getElementById("stream-section").style.display = isSharingOn
  ? "none"
  : "block";
document.getElementById("stop-section").style.display = isSharingOn
  ? "block"
  : "none";
if (isSharingOn) {
  document.getElementById("options-button").setAttribute("disabled", "");
} else {
  document.getElementById("options-button").removeAttribute("disabled");
}

if (isSharingOn) {
  document.getElementById("room-id-label").hidden = true;
  var linkToSession = document.getElementById("link-to-session");
  linkToSession.innerHTML =
    "2n.fm/?s=" + window.localStorage.getItem("sessionId");
  linkToSession.href = "https://" + linkToSession.innerHTML;
  // if setDefaults hasn't been called yet, key-values are undefined, otherwise empty string
  linkToSession.href +=
    (window.localStorage.getItem("room_password") || "") == ""
      ? ""
      : "&p=" + window.localStorage.getItem("room_password");
  linkToSession.hidden = false;

  // auto-stop-sharing
  // document.getElementById('stop-sharing').click();
} else {
  // if setDefaults hasn't been called yet, key-values are undefined, otherwise empty string
  document.getElementById("room-id").value =
    window.localStorage.getItem("room_id") || "";
}

document.getElementById("stop-sharing").onclick = function() {
  window.localStorage.setItem("isSharingOn", false);
  // runtimePort.postMessage({
  //   messageFromContentScript1234: true,
  //   stopSharing: true,
  // });
};

document.getElementById("room-id").onchange = function(event) {
  event && event.stopPropagation();
  window.localStorage.setItem("room_id", this.value);
};

document.getElementById("options-button").onclick = function() {
  if (document.getElementById("options").hidden) {
    document.getElementById("options").removeAttribute("hidden");
  } else {
    document.getElementById("options").setAttribute("hidden", "");
  }
};

// document.getElementById('enable-chat').onclick = function() {
//   var popup_width = 312;
//   var popup_height = 400;

//   runtimePort.postMessage({
//     messageFromContentScript1234: true,
//     openChat: true
//   });

//   window.open('chat.html','Chat','width='+popup_width+',height='+popup_height+',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=0,top='+(screen.height - popup_height)+',left=' + (screen.width - popup_width - 30));
//   window.close();
// };
