<style scoped lang="sass">
.media-controls
  width: 60%
  animation: fade-in 0.4s

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

.theater-button
  svg
    width: 18px
    fill: $primary-color
    transition: transform 0.4s

  &:hover,
  &:active,
  &:focus
    transform: scale(1.1)

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

.autoplay
  label
    font-weight: $bold
    color: $primary-color
    font-size: 16px
    margin-bottom: 0

.viewer-count
  text-align: center
  font-weight: $bold
</style>

<template lang="pug">
.media-controls(:class="{ 'mt-20': isVideo }")
  .frow.nowrap(:class="{ 'justify-between': isVideo }")
    .frow.nowrap
      button.play-button-container.frow.nowrap.button-none(
        type="button"
        v-if="isAudio || (isVideo && !isPlaying)"
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
  .frow.centered.nowrap.mt-20(:class="{ 'justify-between': isVideo }")
    .autoplay.mr-20
      label.row-start.direction-reverse Autoplay
        input(
          type="checkbox"
          :checked="autoplay"
          @change="toggleAutoplay"
        )
    .viewer-count
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
    player: {
      type: [HTMLVideoElement, HTMLAudioElement],
      default: null,
    },
    receiverViewerCount: {
      type: Number,
      default: 0,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    theaterMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      stream: {},
      isPlaying: false,
      volume: window.localStorage.getItem('volume') || 0.5,
    };
  },
  watch: {
    player() {
      this.player.addEventListener('pause', this.playbackToggled);
      this.player.addEventListener('playing', this.playbackToggled);
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
      this.$emit('update:theaterMode', !this.theaterMode);
    },
    toggleAutoplay() {
      this.$emit('update:autoplay', !this.autoplay);
      this.$nextTick(() => {
        window.localStorage.setItem('autoplay', this.autoplay);
      });
    },
    playbackToggled() {
      if (this.player.paused) {
        this.isPlaying = false;
      } else {
        this.isPlaying = true;
      }
    },
  },
};
</script>
