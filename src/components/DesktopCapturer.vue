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

      // SM: post Vue migration, what previously ran in captureDesktop is instead in setDefaults
      // this.captureDesktop();
      this.setDefaults();

      // runtimePort.postMessage({
      //   messageFromContentScript1234: true,
      //   stopSharing: true,
      // });
    },
    captureDesktop() {
      /**
       * TODO: review me
       * old todo: this may need to change (or be removed) because captureDesktop will be called to
       * end a stream
       */
      // this.isSharing = true;

      this.onAccessApproved();
    },
    onAccessApproved() {
      // console.log(navigator.mediaDevices.getSupportedConstraints());

      let constraints = {
        video: {
          // TODO: displaySurface support is waiting on browser support
          // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/displaySurface
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
