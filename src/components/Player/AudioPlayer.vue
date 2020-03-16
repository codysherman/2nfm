<style scoped lang="sass"></style>

<template lang="pug">
  .audio-player
    audio(ref='player')
      | Your browser does not support the audio element.
</template>

<script>
export default {
  name: 'AudioPlayer',
};
</script>
