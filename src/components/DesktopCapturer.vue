<template lang="pug">
  
</template>

<script>
export default {
  name: 'DesktopCapturer',
  props: {
    enableVideo: Boolean,
    enableMic: Boolean,
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

      const startMicCapture = async () => {
        let captureMicStream;
        try {
          captureMicStream = await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
              video: false,
            },
          );
        } catch (err) {
          console.log('errored', err);
          this.setDefaults();
        }
        return captureMicStream;
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
        let micStream = null;
        if (this.enableMic === true) {
          micStream = await startMicCapture();
        }
        let stream = await startScreenCapture();
        // console.log(stream.getTracks()[0].getCapabilities());
        // console.log(stream.getTracks()[0].getSettings());
        if (!this.enableVideo && stream.getAudioTracks().length === 0) {
          alert('Make sure to check the "Share audio" box in Google Chrome');
        }
        if (micStream) {
          // let outputTracks = [];
          // outputTracks = outputTracks.concat(stream.getTracks());
          // outputTracks = outputTracks.concat(micStream.getTracks());
          // stream = new MediaStream(outputTracks);
          console.log('mic track', micStream.getAudioTracks());
          console.log('System Audio', stream.getAudioTracks());
          stream.addTrack(micStream.getAudioTracks()[0]);
          console.log('stream before send', stream.getAudioTracks());
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
