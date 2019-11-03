function onAccessApproved(chromeMediaSourceId, opts) {
  // if (!chromeMediaSourceId) {
  //   setDefaults();
  //   return;
  // }

  // var resolutions = opts.resolutions;

  // console.log(navigator.mediaDevices.getSupportedConstraints());

  constraints = {
    video: {
      // displaySurface: ["application", "browser", "monitor", "window"] // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
    },
    audio: {
      autoGainControl: false,
      echoCancellation: false,
      noiseSuppression: false,
      googDisableLocalEcho: false // https://www.chromestatus.com/feature/5056629556903936
    }
  };

  // navigator.webkitGetUserMedia(
  //   constraints,
  //   function(screenStream) {
  //     var win;
  //     addStreamStopListener(screenStream, function() {
  //       if (win && !win.closed) {
  //         win.close();
  //       } else {
  //         captureDesktop();
  //       }
  //     });

  //     gotStream(screenStream);
  //   },
  //   getUserMediaError
  // );

  async function startScreenCapture() {
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(constraints);
    } catch (err) {
      setDefaults();
    }
    return captureStream;
  }

  async function startCapturing(e) {
    let stream = await startScreenCapture();
    // console.log(stream.getTracks()[0].getCapabilities());
    // console.log(stream.getTracks()[0].getSettings());
    if (
      window.localStorage.getItem("enableVideo") == "false" &&
      stream.getAudioTracks().length === 0
    ) {
      alert(`Make sure the check the "Share audio" box in Google Chrome`);
    }
    gotStream(stream);
  }
  startCapturing();
}
