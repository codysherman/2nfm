<style scoped lang="sass">
.public-link
  text-align: center
  display: inline-block
  font-size: 40px
  color: $primary-color
  margin: 0

  // XS
  @media (max-width: 767px)
    font-size: 30px

.copy-button
  display: inline-block
  margin-left: 14px
  cursor: pointer

  svg
    width: 30px
    fill: $primary-color

.copy-notification
  font-size: 20px
  text-align: center

.public-indicator
  border-radius: $border-radius-small
  padding: 3px 5px
  background-color: $gray-light
  text-transform: capitalize
  color: $white

  &.public
    background-color: $blue

.viewer-count
  text-align: center
  font-size: 20px
  font-weight: $weight-bold

.streamer-control-buttons
  button
    margin: 0 auto
    font-size: 30px
    padding: 15px
    background: none
    border: 3px solid $primary-color
    color: $primary-color
    border-radius: 10px
</style>

<template lang="pug">
div
  .frow.row-center
    router-link.public-link(:to="sessionId" target="_blank")
      | {{ `2n.fm/${sessionId}` }}
    .copy-button(@click="copyUrl()")
        CopySvg
  .copy-notification.animate-fade-in(v-if="copyNotification")
    | Copied
  .viewer-count.mt-20
    | {{ viewerCount }} {{ viewerCount === 1 ? 'Viewer' : 'Viewers' }}
  .frow.mt-5.mb-30
    .public-indicator(:class="{'public': privacy === 'public'}") {{privacy}}
  Player.mb-20(
    v-if="showPreview"
    :stream="stream"
    :receiverViewerCount="viewerCount"
    :disableAutoplay="true"
  )
  label.row-start(v-if="enableMic")
    input(type="checkbox" v-model="muteMic" v-on:change="toggleMicMute")
    | Mute Mic {{ muteMic }}
  .streamer-control-buttons
    .frow.row-between
      button.col-xs-2-5(type="button" @click="stopStream")
        | End Sharing
      button.col-xs-2-5(type="button" @click="showPreview = !showPreview")
        | {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
  .frow.width-100.mt-20
    a.text-underline(
      href="https://caniuse.com/#search=getDisplayMedia"
      rel="noopener"
      target="_blank"
    )
      | OS and Browser Limitations
</template>

<script>
import CopySvg from '@/assets/svgs/copy.svg';

import Player from '@/components/Player/Player.vue';

export default {
  name: 'StopSection',
  components: {
    CopySvg,
    Player,
  },
  props: {
    stream: {
      type: MediaStream,
      default: null,
    },
    sessionId: {
      type: String,
      default: null,
    },
    viewerCount: {
      type: Number,
      default: 0,
    },
    enableMic: {
      type: Boolean,
      default: false,
    },
    privacy: {
      type: String,
      default: 'private',
    },
  },
  data() {
    return {
      copyNotification: false,
      showPreview: false,
      muteMic: false,
    };
  },
  methods: {
    toggleMicMute() {
      this.$emit('muteMicToggle', this.muteMic);
    },
    copyUrl() {
      let tempInput = document.createElement('input');
      tempInput.setAttribute('value', `https://2n.fm/${this.sessionId}`);
      document.body.appendChild(tempInput);
      tempInput.select();
      let result = document.execCommand('copy');
      if (result) {
        this.copyNotification = true;
        setTimeout(() => {
          this.copyNotification = false;
        }, 5000);
      } else {
        console.error('Copy failed');
      }
      document.body.removeChild(tempInput);
    },
    stopStream() {
      this.$emit('stopStream');
    },
  },
};
</script>
