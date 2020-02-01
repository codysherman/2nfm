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
        return;
      }

      stream.addEventListener('inactive', () => {
        this.setDefaults();
      });

      this.addStreamStopListener(stream, () => {
        this.setDefaults();
      });

      this.$emit('gotStream', stream);
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
