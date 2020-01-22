<template lang="pug">
  
</template>

<script>
export default {
  name: 'DesktopCapturer',
  props: {
    enableVideo: Boolean,
  },
  data() {
    return {
      isSharing: false,
      enableAudio: false,
    };
  },
  watch: {
    isSharing(newValue) {
      this.$emit('isSharing', newValue);
    },
  },
  methods: {
    setDefaults() {
      this.$emit('setDefaults');
      this.isSharing = false;
    },
    startStream() {
      this.setDefaults();
      this.isSharing = true;
      this.enableAudio = true;
      this.captureDesktop();
    },
    stopStream() {
      this.isSharing = false;

      // SM: post Vue migration, the logic that would previously run in captureDesktop can instead be executed via setDefaults
      // this.captureDesktop();
      this.setDefaults();

      // runtimePort.postMessage({
      //   messageFromContentScript1234: true,
      //   stopSharing: true,
      // });
    },
    captureDesktop() {
      // TODO: resolutions no longer passed to anything, unnecessary now?
      var resolutions = {};

      // TODO: review me
      // old todo: this may need to change (or be removed) because captureDesktop will be called to end a stream
      // this.isSharing = true;

      var _resolutions = window.localStorage.getItem('resolutions');
      if (!_resolutions) {
        _resolutions = 'fit-screen';
        // chrome.storage.sync.set(
        //   {
        //     resolutions: "fit-screen",
        //   },
        //   function() {}
        // );
      }

      if (_resolutions === 'fit-screen') {
        // resolutions.maxWidth = screen.availWidth;
        // resolutions.maxHeight = screen.availHeight;

        resolutions.maxWidth = screen.width;
        resolutions.maxHeight = screen.height;
      }

      if (_resolutions === '4K') {
        resolutions.maxWidth = 3840;
        resolutions.maxHeight = 2160;
      }

      if (_resolutions === '1080p') {
        resolutions.maxWidth = 1920;
        resolutions.maxHeight = 1080;
      }

      if (_resolutions === '720p') {
        resolutions.maxWidth = 1280;
        resolutions.maxHeight = 720;
      }

      if (_resolutions === '480p') {
        resolutions.maxWidth = 853;
        resolutions.maxHeight = 480;
      }

      if (_resolutions === '360p') {
        resolutions.maxWidth = 640;
        resolutions.maxHeight = 360;
      }

      // TODO: review: sources are no longer used
      var sources = [
        // 'screen',
        // 'window',
        'tab',
      ];

      if (this.enableAudio) {
        sources.push('audio');
      }

      // if (externalThis.enableTabCaptureAPI) {
      //   captureTabUsingTabCapture(resolutions);
      //   return;
      // }

      // externalThis.desktop_id = chrome.desktopCapture.chooseDesktopMedia(sources, function(
      //   chromeMediaSourceId,
      //   opts
      // ) {
      //   opts = opts || {};
      //   opts.resolutions = resolutions;
      //   onAccessApproved(chromeMediaSourceId, opts);
      // });
      this.onAccessApproved();
    },
    onAccessApproved() {
      // if (!chromeMediaSourceId) {
      //   setDefaults();
      //   return;
      // }

      // var resolutions = opts.resolutions;

      // console.log(navigator.mediaDevices.getSupportedConstraints());

      let constraints = {
        video: {
          // TODO: displaySurface support is waiting on browser support https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/displaySurface
          // displaySurface: ["application", "browser", "monitor", "window"]
        },
        audio: {
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: false,
          googDisableLocalEcho: false, // https://www.chromestatus.com/feature/5056629556903936
        },
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

      const startScreenCapture = async () => {
        let captureStream;
        try {
          captureStream = await navigator.mediaDevices.getDisplayMedia(
            constraints,
          );
        } catch (err) {
          this.setDefaults();
        }
        return captureStream;
      };

      const startCapturing = async () => {
        let stream = await startScreenCapture();
        // console.log(stream.getTracks()[0].getCapabilities());
        // console.log(stream.getTracks()[0].getSettings());
        if (!this.enableVideo && stream.getAudioTracks().length === 0) {
          alert('Make sure to check the "Share audio" box in Google Chrome');
        }
        this.gotStream(stream);
      };
      startCapturing();
    },
    gotStream(stream) {
      if (!stream) {
        this.setDefaults();

        // chrome.windows.create({
        //   url:
        //     "data:text/html,<h1>Internal error occurred while capturing the screen.</h1>",
        //   type: "popup",
        //   width: screen.width / 2,
        //   height: 170,
        // });
        return;
      }

      // chrome.browserAction.setTitle({
      //   title: "Connecting to WebSockets server.",
      // });

      // chrome.browserAction.disable();

      stream.addEventListener('inactive', () => {
        this.setDefaults();
      });

      this.addStreamStopListener(stream, () => {
        this.setDefaults();
        // chrome.runtime.reload();
      });

      this.$emit('gotStream', stream);

      // chrome.browserAction.setIcon({
      //   path: "images/icon-active_128.png",
      // });
    },
    addStreamStopListener(stream, callback) {
      var streamEndedEvent = 'ended';
      if ('oninactive' in stream) {
        streamEndedEvent = 'inactive';
      }
      stream.addEventListener(
        streamEndedEvent,
        function() {
          callback();
          callback = function() {};
        },
        false,
      );
      stream.getAudioTracks().forEach(function(track) {
        track.addEventListener(
          streamEndedEvent,
          function() {
            callback();
            callback = function() {};
          },
          false,
        );
      });
      stream.getVideoTracks().forEach(function(track) {
        track.addEventListener(
          streamEndedEvent,
          function() {
            callback();
            callback = function() {};
          },
          false,
        );
      });
    },
  },
};
</script>
