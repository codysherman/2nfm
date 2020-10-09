<template lang="pug">
</template>

<script>
import { Resolutions, getDimensionsForResolution } from '@/utils/enums/Resolutions';

export default {
  name: 'DesktopCapturer',
  props: {
    enableVideo: Boolean,
    enableAudio: Boolean,
    enableMic: Boolean,
    resolution: {
      type: String,
      default: Resolutions.FitScreen,
    },
  },
  data() {
    return {
      isSharing: false,
      stream: null,
    };
  },
  watch: {
    isSharing(newValue) {
      this.$emit('is-sharing', newValue);
    },
  },
  beforeDestroy() {
    this.stopStream();
  },
  methods: {
    setDefaults() {
      this.$emit('set-defaults');
      this.isSharing = false;
    },
    startStream() {
      this.setDefaults();
      this.isSharing = true;
      this.captureDesktop();
    },
    stopStream() {
      this.isSharing = false;
      this.stream.getTracks().forEach(function (track) {
        try {
          track.stop();
        } catch (e) {
          console.error(e);
        }
      });
      this.stream = null;
      // SM: post Vue migration, what previously ran in captureDesktop is instead in setDefaults
      // this.captureDesktop();
      this.setDefaults();
    },
    captureDesktop() {
      // console.log(navigator.mediaDevices.getSupportedConstraints());
      let dimensions = '';

      if (!this.enableVideo) {
        dimensions = getDimensionsForResolution('Fit144p');
      } else {
        dimensions = getDimensionsForResolution(this.resolution);
      }

      let constraints = {
        video: {
          // TODO: displaySurface support is waiting on browser support
          // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/displaySurface
          // displaySurface: ["application", "browser", "monitor", "window"],
          width: { ideal: dimensions.width },
          height: { ideal: dimensions.height },
        },
      };

      if (this.enableAudio) {
        constraints.audio = {
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: false,
        };
      }

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
          console.error('Error getting microphone', err);
          alert('Your browser denied microphone access');
          // this.setDefaults();
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
        if (this.enableMic === true && !micStream) {
          return;
        }
        this.stream = await startScreenCapture();
        // console.log(stream.getTracks()[0].getCapabilities());
        // console.log(stream.getTracks()[0].getSettings());
        if (this.enableAudio && this.stream.getAudioTracks().length === 0) {
          alert('Make sure to check the "Share audio" box in Google Chrome or Microsoft Edge');
          this.stopStream();
          return;
        }
        if (this.stream.getAudioTracks().length > 0) {
          this.stream.containsAudio = true;
        }
        // Remove the video track from the source stream if audio only
        if (
          !this.enableVideo &&
          this.stream.getVideoTracks().length > 0
        ) {
          this.stream.removeTrack(
            this.stream.getVideoTracks()[0],
          );
        }
        if (this.stream.getVideoTracks().length > 0) {
          this.stream.containsVideo = true;
        }
        if (micStream) {
          this.stream.addTrack(micStream.getAudioTracks()[0]);
          this.stream.containsMic = true;
        }
        this.gotStream();
      };
      startCapturing();
    },
    gotStream() {
      if (!this.stream) {
        this.setDefaults();
        return;
      }

      this.stream.addEventListener('inactive', () => {
        this.setDefaults();
      });

      this.addStreamStopListener(() => {
        this.setDefaults();
      });

      this.$emit('got-stream', this.stream);
    },
    addStreamStopListener(callback) {
      var streamEndedEvent = 'ended';
      if ('oninactive' in this.stream) {
        streamEndedEvent = 'inactive';
      }
      this.stream.addEventListener(
        streamEndedEvent,
        function () {
          callback();
          callback = function () {};
        },
        false,
      );
      this.stream.getAudioTracks().forEach(function (track) {
        track.addEventListener(
          streamEndedEvent,
          function () {
            callback();
            callback = function () {};
          },
          false,
        );
      });
      this.stream.getVideoTracks().forEach(function (track) {
        track.addEventListener(
          streamEndedEvent,
          function () {
            callback();
            callback = function () {};
          },
          false,
        );
      });
    },
  },
};
</script>