"use strict";

let stream = null;

function init() {
  var isSharingOn = window.localStorage.getItem("isSharingOn") === "true";

  document.getElementById("setup-section").style.display = isSharingOn
    ? "none"
    : "block";
  if (isSharingOn) {
    document.getElementById("live-indicator").classList.add("live");
    var linkToSession = document.getElementById("public-link");
    linkToSession.innerHTML =
      "2n.fm/?s=" + window.localStorage.getItem("sessionId");
    linkToSession.href = "https://" + linkToSession.innerHTML;
    // if setDefaults hasn't been called yet, key-values are undefined, otherwise empty string
    linkToSession.href +=
      (window.localStorage.getItem("room_password") || "") == ""
        ? ""
        : "&p=" + window.localStorage.getItem("room_password");
    document.getElementById("stop-section").hidden = false;
    // auto-stop-sharing
    // document.getElementById('stop-sharing').click();
  } else {
    document.getElementById("live-indicator").classList.remove("live");
    // if setDefaults hasn't been called yet, key-values are undefined, otherwise empty string
    document.getElementById("stop-section").hidden = true;
    document.getElementById("room-id").value =
      window.localStorage.getItem("room_id") || "";
  }
}
init();

document.getElementById("video-button").onclick = function() {
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
  // init();
};

document.getElementById("audio-button").onclick = function() {
  setDefaults();
  const streamFlags = {
    enableTabCaptureAPI: "false",
    isSharingOn: "true",
    enableVideo: "false",
    enableAudio: "true",
  };
  Object.keys(streamFlags).forEach(function(key) {
    window.localStorage.setItem(key, streamFlags[key]);
  });
  captureDesktop();
  // init();
};

document.getElementById("stop-sharing").onclick = function() {
  window.localStorage.setItem("isSharingOn", false);
  captureDesktop();
  init();
  // runtimePort.postMessage({
  //   messageFromContentScript1234: true,
  //   stopSharing: true,
  // });
};

document.getElementById("room-id").onchange = function(event) {
  event && event.stopPropagation();
  window.localStorage.setItem("room_id", this.value);
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
