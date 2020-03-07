<style scoped lang="sass"></style>

<template lang="pug">
  .audio-player
    audio(ref='audioPlayer')
      | Your browser does not support the audio element.
    MediaControls
</template>

<script>
import ReceiverConnection from '@/components/ReceiverConnection.vue';
import MediaControls from '@/components/Player/MediaControls.vue';

export default {
  name: 'Receiver',
  components: {
    ReceiverConnection,
    MediaControls,
  },
  data() {
    return {
      stream: {},
      isStream: false,
      isPlaying: false,
      volume: window.localStorage.getItem('volume') || 0.5,
      // set by Receiver.onPresenceCheckWait / Connection(@presenceCheckWait)
      presenceCheckWait: null,
    };
  },
  computed: {
    player() {
      if (this.stream.isVideo) {
        return this.$refs.videoPlayer;
      } else if (this.stream.isAudio) {
        return this.$refs.audioPlayer;
      } else {
        return null;
      }
    },
  },
  methods: {
    onStream(stream) {
      this.$refs.videoPlayer.srcObject = null;
      this.$refs.audioPlayer.srcObject = null;
      this.stream = stream;
      this.stream.mute();

      if (this.stream.isVideo) {
        this.$refs.videoPlayer.srcObject = this.stream;
        this.$refs.videoPlayer.srcObject.getVideoTracks()[0].enabled = true;
        if (this.$refs.videoPlayer.srcObject.getAudioTracks().length) {
          this.$refs.videoPlayer.srcObject.getAudioTracks()[0].enabled = true;
        }
        this.$refs.videoPlayer.volume = this.volume;
      } else {
        this.$refs.audioPlayer.srcObject = this.stream;
        this.$refs.audioPlayer.srcObject.getAudioTracks()[0].enabled = true;
        this.$refs.audioPlayer.volume = this.volume;
      }
      this.playMedia();
    },
    onPresenceCheckWait(newValue) {
      this.presenceCheckWait = newValue;
    },
    async playMedia() {
      try {
        await this.player.play();
        this.isPlaying = true;
      } catch (err) {
        // Playback Failed
      }
    },
    togglePlayback() {
      if (this.player.paused) {
        this.playMedia();
      } else {
        this.player.pause();
        this.isPlaying = false;
      }
    },
    setVolume(event) {
      this.$refs.audioPlayer.volume = event.srcElement.valueAsNumber;
      this.$refs.videoPlayer.volume = event.srcElement.valueAsNumber;
      this.volume = event.srcElement.valueAsNumber;
      localStorage.setItem('volume', event.srcElement.valueAsNumber);
    },
    fullscreenVideo() {
      if (this.$refs.videoPlayer.requestFullscreen)
        this.$refs.videoPlayer.requestFullscreen();
      else if (this.$refs.videoPlayer.mozRequestFullScreen)
        this.$refs.videoPlayer.mozRequestFullScreen();
      else if (this.$refs.videoPlayer.webkitRequestFullScreen)
        this.$refs.videoPlayer.webkitRequestFullScreen();
      else if (this.$refs.videoPlayer.msRequestFullscreen)
        this.$refs.videoPlayer.msRequestFullscreen();
    },
    toggleTheaterMode() {
      this.theaterMode = !this.theaterMode;
    },
  },
};
</script>
