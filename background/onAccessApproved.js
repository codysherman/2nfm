function onAccessApproved(chromeMediaSourceId, opts) {
  // if (!chromeMediaSourceId) {
  //   setDefaults();
  //   return;
  // }

  // var resolutions = opts.resolutions;

  constraints = {
    audio: false,
    video: {
      mandatory: {
        // maxWidth: resolutions.maxWidth,
        // maxHeight: resolutions.maxHeight,
        // minWidth: resolutions.minWidth,
        // minHeight: resolutions.minHeight,
        // minAspectRatio: getAspectRatio(
        //   resolutions.maxWidth,
        //   resolutions.maxHeight
        // ),
        // maxAspectRatio: getAspectRatio(
        //   resolutions.maxWidth,
        //   resolutions.maxHeight
        // ),
        // minFrameRate: 64,
        // maxFrameRate: 128,
      },
      optional: [],
    },
  };

  constraints.audio = {
    mandatory: {
      // echoCancellation: true,
      // autoGainControl: false,
      // noiseSuppression: false,
      // sampleRate: 48000,
      // sampleSize: 16,
    },
    optional: [
      {
        googDisableLocalEcho: false, // https://www.chromestatus.com/feature/5056629556903936
      },
    ],
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
    gotStream(stream);
  }
  startCapturing();
}
