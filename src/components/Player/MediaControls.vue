<style scoped lang="sass">
.media-controls
  width: 60%
  animation: fade-in $animate-speed

  .play-button-container
    width: 30px
    margin-right: 5px

    svg
      width: 30px
      fill: $primary-color

  .microphone
    width: 30px
    margin-right: 5px
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
    transition: transform $animate-speed

  &:hover,
  &:active,
  &:focus
    transform: scale(1.1)

.fullscreen-button
  svg
    width: 30px
    fill: $primary-color
    transition: transform $animate-speed

  &:hover,
  &:active,
  &:focus
    transform: scale(1.1)

  @supports (-webkit-touch-callout: none) // fullscreen API doesn't work on iOS, so hide it
    visibility: hidden
</style>

<template lang="pug">
.media-controls
  .frow.nowrap(:class="{ 'justify-between': containsVideo }")
    .frow.nowrap
      button.play-button-container.frow.nowrap.button-none(
        type="button"
        v-if="!containsMic"
        @click="togglePlayback"
      )
        PlaySvg(v-if="!isPlaying")
        PauseSvg(v-else)
      MicrophoneSvg.microphone(v-if="containsMic")
      input.volume-slider.frow.nowrap(
        type="range"
        v-if="containsAudio || containsMic"
        :value="volume"
        min="0"
        max="1"
        step="0.01"
        @input="setVolume"
      )
    .frow(v-if="containsVideo && isPlaying && !containsMic")
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
import MicrophoneSvg from '@/assets/svgs/microphone.svg';

import ReceiverConnection from '@/components/ReceiverConnection.vue';

export default {
  name: 'MediaControls',
  components: {
    PlaySvg,
    PauseSvg,
    FullscreenSvg,
    TheaterSvg,
    MicrophoneSvg,
    ReceiverConnection,
  },
  props: {
    containsVideo: {
      type: Boolean,
      default: false,
    },
    containsAudio: {
      type: Boolean,
      default: false,
    },
    containsMic: {
      type: Boolean,
      default: false,
    },
    player: {
      type: [ HTMLVideoElement, HTMLAudioElement ],
      default: null,
    },
    theaterMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
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
    togglePlayback() {
      this.$emit('toggle-playback');
    },
    setVolume(event) {
      this.player.volume = event.srcElement.valueAsNumber;
      this.volume = event.srcElement.valueAsNumber;
      if (!this.containsMic) {
        localStorage.setItem('volume', event.srcElement.valueAsNumber);
      }
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
      this.$emit('update:theater-mode', !this.theaterMode);
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