<style scoped lang="sass">
video
  width: 60%
  height: auto
  object-fit: contain
  margin-bottom: 20px
  background-color: $tertiary-color
  transition: width $animate-speed

  &.theater-mode
    width: 100%
</style>

<template lang="pug">
  .video-player
    video.shadow-light(
      ref='player'
      :class="{ 'theater-mode': theaterMode }"
      @click='togglePlayback'
      playsinline
    )
      | Your browser does not support the video element.
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    recieverViewerCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      stream: {},
      isStream: false,
      isPlaying: false,
      theaterMode: false,
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
    toggleTheaterMode() {
      this.theaterMode = !this.theaterMode;
    },
  },
};
</script>
