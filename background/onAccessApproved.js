function onAccessApproved(chromeMediaSourceId, opts) {
  if (!chromeMediaSourceId) {
    setDefaults();
    return;
  }

  var resolutions = opts.resolutions;

  chrome.storage.sync.get(null, function(items) {
    constraints = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: chromeMediaSourceId,
          maxWidth: resolutions.maxWidth,
          maxHeight: resolutions.maxHeight,
          minWidth: resolutions.minWidth,
          minHeight: resolutions.minHeight,
          minAspectRatio: getAspectRatio(
            resolutions.maxWidth,
            resolutions.maxHeight
          ),
          maxAspectRatio: getAspectRatio(
            resolutions.maxWidth,
            resolutions.maxHeight
          ),
          minFrameRate: 64,
          maxFrameRate: 128,
        },
        optional: [],
      },
    };

    if (opts.canRequestAudioTrack === true) {
      constraints.audio = {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: chromeMediaSourceId,
          echoCancellation: true,
        },
        optional: [
          {
            googDisableLocalEcho: false, // https://www.chromestatus.com/feature/5056629556903936
          },
        ],
      };
    }

    navigator.webkitGetUserMedia(
      constraints,
      function(screenStream) {
        var win;
        addStreamStopListener(screenStream, function() {
          if (win && !win.closed) {
            win.close();
          } else {
            captureDesktop();
          }
        });

        gotStream(screenStream);
      },
      getUserMediaError
    );
  });
}
