<style scoped lang="sass">
.autoplay
  label
    font-weight: $weight-bold
    color: var(--inverse-color)
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
    | {{ receiverViewerCount + 1 }}
    | {{ receiverViewerCount + 1 === 1 ? 'person' : 'people' }} in room
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
  },
  methods: {
    toggleAutoplay() {
      this.$emit('update:autoplay', !this.autoplay);
      this.$nextTick(() => {
        window.localStorage.setItem('autoplay', this.autoplay);
      });
    },
  },
};
</script>