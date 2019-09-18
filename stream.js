/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
"use strict";

let enableStartCapture = true;
let enableStopCapture = false;
let enableDownloadRecording = false;
let stream = null;
let chunks = [];
let mediaRecorder = null;
let status = "Inactive";
let recording = null;

// static get properties() {
//   return {
//     status: String,
//     enableStartCapture: Boolean,
//     enableStopCapture: Boolean,
//     enableDownloadRecording: Boolean,
//     recording: {
//       type: {
//         fromAttribute: input => input,
//       },
//     },
//   };
// }

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
  console.log("Start capturing.");
  status = "Screen recording started.";
  enableStartCapture = false;
  enableStopCapture = true;
  enableDownloadRecording = false;

  if (recording) {
    window.URL.revokeObjectURL(recording);
  }

  chunks = [];
  recording = null;
  stream = await startScreenCapture();
  stream.addEventListener("inactive", e => {
    console.log("Capture stream inactive - stop recording!");
    stopCapturing(e);
  });
  // mediaRecorder = new MediaRecorder(stream, {
  //   mimeType: "video/webm",
  // });
  // mediaRecorder.addEventListener("dataavailable", event => {
  //   if (event.data && event.data.size > 0) {
  //     chunks.push(event.data);
  //   }
  // });
  // mediaRecorder.start(10);
  setupWebRTCConnection(stream);
}

function stopCapturing(e) {
  console.log("Stop capturing.");
  status = "Screen recorded completed.";
  enableStartCapture = true;
  enableStopCapture = false;
  enableDownloadRecording = true;

  mediaRecorder.stop();
  mediaRecorder = null;
  stream.getTracks().forEach(track => track.stop());
  stream = null;

  recording = window.URL.createObjectURL(
    new Blob(chunks, { type: "video/webm" })
  );
}

document.getElementById("magic").onclick = function() {
  console.log("calling on magic");
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
