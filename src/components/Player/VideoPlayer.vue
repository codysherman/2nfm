<style scoped lang="sass">
video
  height: auto
  background-color: $tertiary-color
  transition: width $animate-speed
</style>

<template lang="pug">
  video.shadow-light(
    ref='player'
    @click='togglePlayback'
    playsinline
  )
    | Your browser does not support the video element.
</template>

<script>
export default {
  name: 'VideoPlayer',
  data() {
    return {
      stream: {},
      isStream: false,
      isPlaying: false,
      volume: window.localStorage.getItem('volume') || 0.5,
    };
  },
  methods: {
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
  },
};
</script>
