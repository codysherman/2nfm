<style scoped lang="sass">
#stop-section
  text-align: center

  #public-link
    display: inline-block
    font-size: 40px
    color: $primary-color
    margin: 0 auto

  #copy-button
    display: inline-block
    margin-left: 14px
    cursor: pointer
    svg
      width: 30px
      fill: $primary-color

  #copy-notification
    font-size: 20px

/* XS
@media (max-width: 767px)
  #public-link
    font-size: 30px

.viewer-count
  margin: 5px auto 20px
  text-align: center
  font-size: 20px
  font-weight: $weight-bold

.streamer-control-buttons
  margin: 0 auto
  font-size: 30px
  padding: 15px
  background: none
  border: 3px solid $primary-color
  color: $primary-color
  border-radius: 10px
</style>

<template lang="pug">
section#stop-section
  //- router-link#public-link(
  //-   to="{query: { s: sessionId, p: room_password }}`}" target="_blank"
  //- )
  router-link#public-link(:to="sessionId" target="_blank")
    | {{ `2n.fm/${sessionId}` }}
  #copy-button(@click="copyUrl()")
      CopySvg
  #copy-notification.animate-fade-in(v-if="copyNotification")
    | Copied
  .viewer-count
    span#viewer-count-number
    | {{ viewerCount }} {{ viewerCount === 1 ? 'Viewer' : 'Viewers' }}
  Player.mb-20(
    v-if="showPreview"
    :stream="stream"
    :receiverViewerCount="viewerCount"
    :disableAutoplay="true"
  )
  .frow.row-between
    button.streamer-control-buttons(type="button" @click="stopStream")
      | End Sharing
    button.streamer-control-buttons(type="button" @click="showPreview = !showPreview")
      | {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
  .frow.width-100.mt-20
    a.text-underline(
      href="https://caniuse.com/#search=getDisplayMedia"
      rel="noreferrer"
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
  },
  data() {
    return {
      copyNotification: false,
      showPreview: false,
    };
  },
  watch: {
  },
  methods: {
    copyUrl() {
      let copyText = document.getElementById('public-link');
      let input = document.createElement('input');
      input.setAttribute('value', `https://${copyText.innerText}`);
      document.body.appendChild(input);
      input.select();

      let result = document.execCommand('copy');
      const copyNotification = document.getElementById('copy-notification');
      if (result) {
        document.body.removeChild(input);
        this.copyNotification = true;
        setTimeout(() => {
          this.copyNotification = false;
        }, 5000);
      } else {
        copyNotification.innerText = 'Copy failed';
      }
    },
    stopStream() {
      this.$emit('stopStream');
    },
  },
};
</script>
