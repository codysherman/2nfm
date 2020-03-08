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
      //- | {{ receiverViewerCount }} {{ receiverViewerCount === 1 ? 'Viewer' : 'Viewers' }}
    div#autoplay.frow.nowrap
      //- input(
      //-   type="checkbox"
      //-   :checked = "autoplay"
      //-   @change="toggleAutoPlay"
      //- )
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
    parentRefs: {
      type: Object,
      default: null,
    },
    isVideo: {
      type: Boolean,
      default: false,
    },
    isAudio: {
      type: Boolean,
      default: false,
    },
    recieverViewerCount: {
      type: Number,
      default: 0,
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
        return this.parentRefs.videoPlayer;
      } else if (this.isAudio) {
        return this.parentRefs.audioPlayer;
      } else {
        return null;
      }
    },
  },
  methods: {
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
      this.player.volume = event.srcElement.valueAsNumber;
      this.volume = event.srcElement.valueAsNumber;
      localStorage.setItem('volume', event.srcElement.valueAsNumber);
    },
    fullscreenVideo() {
      if (this.player.requestFullscreen)
        this.player.requestFullscreen();
      else if (this.player.mozRequestFullScreen)
        this.player.mozRequestFullScreen();
      else if (this.player.webkitRequestFullScreen)
        this.player.webkitRequestFullScreen();
      else if (this.player.msRequestFullscreen)
        this.player.msRequestFullscreen();
    },
    toggleTheaterMode() {
      this.theaterMode = !this.theaterMode;
    },
  },
};
</script>
