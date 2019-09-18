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
  stream = await startScreenCapture();
  stream.addEventListener("inactive", e => {
    stopCapturing(e);
  });
  setupWebRTCConnection(stream);
}

function stopCapturing(e) {
  stream.getTracks().forEach(track => track.stop());
  stream = null;
}

document.getElementById("video-and-audio").onclick = function() {
  setDefaults();
  Object.assign(globalSettingsTestObject, {
    enableTabCaptureAPI: "false",
    enableMicrophone: "false",
    enableCamera: "false",
    enableScreen: "false",
    isSharingOn: "true",
    enableVideo: "false",
    enableSpeakers: "true",
  });
  startCapturing();
};

// chrome.storage.sync.get(
//   ["isSharingOn", "room_id", "sessionId", "room_password"],
//   function(obj) {
//     var isSharingOn = obj.isSharingOn === "true";

//     document.getElementById("stream-section").style.display = isSharingOn
//       ? "none"
//       : "block";
//     document.getElementById("stop-section").style.display = isSharingOn
//       ? "block"
//       : "none";
//     if (isSharingOn) {
//       document.getElementById("options-button").setAttribute("disabled", "");
//     } else {
//       document.getElementById("options-button").removeAttribute("disabled");
//     }

//     if (isSharingOn) {
//       document.getElementById("room-id-label").hidden = true;
//       var linkToSession = document.getElementById("link-to-session");
//       linkToSession.innerHTML = "2n.fm/?s=" + obj.sessionId;
//       linkToSession.href = "https://" + linkToSession.innerHTML;
//       // if setDefaults hasn't been called yet, key-values are undefined, otherwise empty string
//       linkToSession.href +=
//         (obj.room_password || "") == "" ? "" : "&p=" + obj.room_password;
//       linkToSession.hidden = false;

//       // auto-stop-sharing
//       // document.getElementById('stop-sharing').click();
//     } else {
//       // if setDefaults hasn't been called yet, key-values are undefined, otherwise empty string
//       document.getElementById("room-id").value = obj.room_id || "";
//     }
//   }
// );

// document.getElementById("stop-sharing").onclick = function() {
//   chrome.storage.sync.set(
//     {
//       isSharingOn: "false",
//     },
//     function() {
//       runtimePort.postMessage({
//         messageFromContentScript1234: true,
//         stopSharing: true,
//       });
//       window.close();
//     }
//   );
// };

// document.getElementById("room-id").onchange = function(event) {
//   event && event.stopPropagation();
//   this.disabled = true;

//   try {
//     chrome.storage.sync.set({ room_id: this.value }, () => {
//       this.disabled = false;
//     });
//   } catch (e) {
//     location.reload();
//   }
// };

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
