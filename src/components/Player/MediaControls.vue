<style scoped lang="sass">
.media-controls
  width: 60%
  animation: fade-in 0.4s

.play-button-container
  width: 30px
  height: 30px
  margin-right: 20px

  svg
    width: 30px
    height: 30px
    fill: $primary-color

.volume-slider
  max-width: 120px
  @supports (-webkit-touch-callout: none) // iOS volume slider doesn't work, so hide it
    visibility: hidden
.autoplay
  input, label
    margin: auto 4px 47px
.fullscreen-button,
.theater-button
  svg
    width: 30px
    fill: $primary-color
    transition: transform 0.4s

  &:hover,
  &:active,
  &:focus
    transform: scale(1.1)

.theater-button svg
  width: 18px
</style>

<template lang="pug">
.media-controls.frow.nowrap(v-if="isStream" :class="{ 'justify-between': isVideo }")
  .frow.nowrap
    button.play-button-container.frow.nowrap.button-none(
      type="button"
      v-if="(isAudio) || (isVideo && !isPlaying)"
      @click="togglePlayback"
    )
      PlaySvg(v-if="!isPlaying")
      PauseSvg(v-else)
    input.volume-slider(
      type="range"
      :value="volume"
      min="0"
      max="1"
      step="0.01"
      @input="setVolume"
    )
    .viewer-count
      span#viewer-count-number
      | {{ receiverViewerCount }} {{ receiverViewerCount === 1 ? 'Viewer' : 'Viewers' }}
    div#autoplay.frow.nowrap
      input(
        type="checkbox"
        :checked = "autoplay"
        @change="toggleAutoPlay"
      )
      label AutoPlay
  .frow(v-if="isVideo && isPlaying")
    button.theater-button.button-none.mr-20(
      type="button"
      @click="toggleTheaterMode"
    )
      TheaterSvg
    button.fullscreen-button.button-none(
      type="button"
      @click="fullscreenVideo"
    )
      FullscreenSvg
</template>

<script>
import PlaySvg from '@/assets/svgs/play.svg';
import PauseSvg from '@/assets/svgs/pause.svg';
import FullscreenSvg from '@/assets/svgs/fullscreen.svg';
import TheaterSvg from '@/assets/svgs/theater.svg';

import ReceiverConnection from '@/components/ReceiverConnection.vue';

export default {
  name: 'MediaControls',
  components: {
    PlaySvg,
    PauseSvg,
    FullscreenSvg,
    TheaterSvg,
    ReceiverConnection,
  },
  props: {
    isVideo: {
      type: Boolean,
      default: false,
    },
    isAudio: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      stream: {},
      isStream: true,
      isPlaying: false,
      theaterMode: false,
      volume: window.localStorage.getItem('volume') || 0.5,
      // set by Receiver.onPresenceCheckWait / Connection(@presenceCheckWait)
      presenceCheckWait: null,
    };
  },
  computed: {
    player() {
      if (this.isVideo) {
        return this.$refs.videoPlayer;
      } else if (this.isAudio) {
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

      if (this.isVideo) {
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
