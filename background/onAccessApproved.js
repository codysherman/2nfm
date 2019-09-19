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

  function startScreenCapture() {
    if (navigator.getDisplayMedia) {
      return navigator.getDisplayMedia(constraints);
    } else if (navigator.mediaDevices.getDisplayMedia) {
      return navigator.mediaDevices.getDisplayMedia(constraints);
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
  startCapturing();

  // console.log(navigator);
  // navigator.getDisplayMedia(
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
}
