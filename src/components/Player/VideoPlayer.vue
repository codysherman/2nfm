<style scoped lang="sass">
video
  height: auto
  background-color: $tertiary-color
  transition: width $animate-speed
</style>

<template lang="pug">
  video.shadow-light(
    ref='player'
    playsinline
  )
    | Your browser does not support the video element.
</template>

<script>
export default {
  name: 'VideoPlayer',
  data() {
    return {
      stream: {},
      isStream: false,
      isPlaying: false,
      volume: window.localStorage.getItem('volume') || 0.5,
    };
  },
};
</script>
