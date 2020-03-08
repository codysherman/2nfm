<style scoped lang="sass">
.media-controls, .media-settings
  width: 60%
  animation: fade-in 0.4s
  .volume-slider, .play-button-container, .autoplay
      margin: 6px 6px

  .play-button-container
    width: 30px
    height: 30px
    margin-right: 5px

    svg
      width: 30px
      height: 30px
      fill: $primary-color

  .volume-slider
    max-width: 120px
    @media only screen and (max-device-width: 768px)
      max-width: 80px
    @supports (-webkit-touch-callout: none) // iOS volume slider doesn't work, so hide it
      visibility: hidden

  .autoplay
    input, label
      margin: auto 4px 47px

.fullscreen-button
  svg
    width: 30px
    fill: $primary-color
    transition: transform 0.4s

  &:hover,
  &:active,
  &:focus
    transform: scale(1.1)
  @supports (-webkit-touch-callout: none) // fullscreen API doesn't work on iOS, so hide it
    visibility: hidden

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

.viewer-count
  margin: 5px 5px 5px
  text-align: center
  font-size: 20px
  font-weight: bold
  @media only screen and (max-device-width: 768px)
    font-size: 18px
</style>

<template lang="pug">
div
  .media-controls.frow.nowrap(v-if="isStream" :class="{ 'justify-between': isVideo }")
    .frow.nowrap
      button.play-button-container.frow.nowrap.button-none(
        type="button"
        v-if="isAudio || isVideo"
        @click="togglePlayback"
      )
        PlaySvg(v-if="!isPlaying")
        PauseSvg(v-else)
      input.volume-slider.frow.nowrap(
        type="range"
        :value="volume"
        min="0"
        max="1"
        step="0.01"
        @input="setVolume"
      )

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
  //- .media-settings.frow.nowrap(v-if="isStream" :class="{ 'justify-between': isVideo }")
    div.autoplay.frow.nowrap
      input(
        type="checkbox"
        :checked = "autoplay"
        @change="toggleAutoPlay"
      )
      label AutoPlay
    .viewer-count
      span.viewer-count-number
      | {{ receiverViewerCount }} {{ receiverViewerCount === 1 ? 'Viewer' : 'Viewers' }}
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
    recieverViewerCount: {
      type: Number,
      default: 0,
    },
    player: {
      type: [HTMLVideoElement, HTMLAudioElement],
      default: null,
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
