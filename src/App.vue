<style lang="sass">
@import ~frow/_variables
@import @/assets/sass/_colors.sass
@import @/assets/sass/_variables.sass
@import ~frow
@import @/assets/sass/global.sass

.min-100vh
  min-height: 100vh
</style>

<template lang="pug">
  #app.frow-container
    router-view.frow.centered.min-100vh.py-20(:key="$route.fullPath")
</template>

<script>
export default {
  name: 'App',
  metaInfo: { title: '2N.fm' },
};
</script>