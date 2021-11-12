<style lang="sass">
@import ~frow/_variables
@import @/assets/sass/_colors.sass
@import @/assets/sass/_variables.sass
@import ~frow
@import @/assets/sass/global.sass

.bounce-in-enter-active
  animation: pop-in $animate-speed

.theme-svg
  height: 25px
  width: auto
  position: fixed
  right: 10px
  top: 10px
  cursor: pointer
  transition: 0s
.min-100vh
  min-height: 100vh
</style>

<template lang="pug">
  #app.frow-container
    transition(name="bounce-in")
      AutoTheme.theme-svg(v-if="theme === 'auto'" @click="theme='dark'")
    transition(name="bounce-in")
      DarkThemeMoon.theme-svg(v-if="theme === 'dark'" @click="theme='light'")
    transition(name="bounce-in")
      LightThemeSun.theme-svg(v-if="theme === 'light'" @click="theme='auto'")
    router-view.frow.centered.min-100vh.py-20(:key="$route.fullPath")
</template>

<script>
import LightThemeSun from '@/assets/svgs/light-theme-sun.svg';
import DarkThemeMoon from '@/assets/svgs/dark-theme-moon.svg';
import AutoTheme from '@/assets/svgs/auto_theme.svg';
export default {
  name: 'App',
  metaInfo: { title: '2N.fm' },
  components: {
    LightThemeSun,
    DarkThemeMoon,
    AutoTheme,
  },
  data: function () {
    return { theme: 'light' };
  },
  watch: {
    theme: function (theme) {
      switch (theme) {
        case 'light':
          document.documentElement.setAttribute('data-theme', 'light');
          break;
        case 'dark':
          document.documentElement.setAttribute('data-theme', 'dark');
          break;
        case 'auto':
          document.documentElement.setAttribute('data-theme', 'auto');
          break;
        default:
          document.documentElement.setAttribute('data-theme', 'auto');
      }
      localStorage.setItem('theme', document.documentElement.getAttribute('data-theme'));
    },
  },
  created() {
    document.documentElement.setAttribute(
      'data-theme', localStorage.getItem('theme') || 'light',
    );
    this.theme = document.documentElement.getAttribute('data-theme');
  },
};
</script>