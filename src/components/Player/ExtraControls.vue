<style scoped lang="sass">
.autoplay
  label
    font-weight: $weight-bold
    color: $primary-color
    font-size: 16px
    margin-bottom: 0

.viewer-count
  text-align: center
  font-weight: $weight-bold
</style>

<template lang="pug">
.frow.centered.nowrap
  .autoplay.mr-20
    label.row-start.direction-reverse Autoplay
      input(
        type="checkbox"
        :checked="autoplay"
        @change="toggleAutoplay"
      )
  .viewer-count
    | {{ receiverViewerCount + 1 }} {{ receiverViewerCount + 1 === 1 ? 'Viewer' : 'Viewers' }}
  div {{ stream.roomDescription }}
</template>

<script>

export default {
  name: 'ExtraControls',
  props: {
    receiverViewerCount: {
      type: Number,
      default: 0,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    stream: {
      type: MediaStream,
      default: null,
    },
  },
  methods: {
    toggleAutoplay() {
      console.log('444444', this.stream.roomDescription);
      this.$emit('update:autoplay', !this.autoplay);
      this.$nextTick(() => {
        window.localStorage.setItem('autoplay', this.autoplay);
      });
    },
  },
};
</script>
