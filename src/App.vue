<style lang="sass">
@import ~frow/_variables
@import @/assets/sass/_colors.sass
@import @/assets/sass/_variables.sass
@import ~frow
@import @/assets/sass/global.sass

.theme-svg
  height: 25px
  width: auto
  position: fixed
  right: 10px
  top: 10px
  &:hover
    cursor: pointer
.min-100vh
  min-height: 100vh
</style>

<template lang="pug">
  #app.frow-container
    LightThemeSun.theme-svg.animate-pop-in(v-if="theme === 'light'" @click="toggleDarkTheme")
    DarkThemeMoon.theme-svg.animate-pop-in(v-if="theme === 'dark'" @click="toggleDarkTheme")
    router-view.frow.centered.min-100vh.py-20(:key="$route.fullPath")
</template>

<script>
import LightThemeSun from '@/assets/svgs/light-theme-sun.svg';
import DarkThemeMoon from '@/assets/svgs/dark-theme-moon.svg';
export default {
  name: 'App',
  metaInfo: { title: '2N.fm' },
  components: {
    LightThemeSun,
    DarkThemeMoon,
  },
  data: function () {
    return { theme: 'light' };
  },
  created() {
    document.documentElement.setAttribute(
      'data-theme', localStorage.getItem('theme') || 'dark',
    );
    this.theme = document.documentElement.getAttribute('data-theme');
  },
  methods: {
    toggleDarkTheme() {
      if (
        !document.documentElement.getAttribute('data-theme')
        || document.documentElement.getAttribute('data-theme') === 'light'
      ) {
        this.theme = 'dark';
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        this.theme = 'light';
        document.documentElement.setAttribute('data-theme', 'light');
      }
      localStorage.setItem('theme', document.documentElement.getAttribute('data-theme'));
    },
  },
};
</script>