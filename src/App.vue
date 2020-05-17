<style lang="sass">
@import ~frow/_variables
@import @/assets/sass/_colors.sass
@import @/assets/sass/_variables.sass
@import ~frow
@import @/assets/sass/global.sass
</style>

<template lang="pug">
  #app.frow-container.height-100
    router-view(:key="$route.fullPath")
</template>

<script>
export default {
  name: 'App', 
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: '2N.fm',
    // all titles will be injected into this template
    titleTemplate: '%s | 2N',
  },
};
</script>
