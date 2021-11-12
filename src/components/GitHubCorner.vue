<style scoped lang="sass">
@keyframes octocat-wave
  0%,
  100%
    transform: rotate(0)
  20%,
  60%
    transform: rotate(-25deg)
  40%,
  80%
    transform: rotate(10deg)

.github-corner
  fill: var(--inverse-color)
  color: $white
  position: absolute
  top: -2px
  border: 0
  left: 0
  transform: rotate(-90deg)

  &:hover .octo-arm
    animation: 560ms ease-in-out octocat-wave

  svg
    width: 80px
    height: 80px

.octo-body,
.octo-arm
  fill: var(--theme-color)

.octo-arm
  transform-origin: 130px 106px
</style>

<template lang="pug">
a.github-corner(href="https://github.com/codysherman/2nfm" target="_blank" rel="noopener")
  GitHubSvg
</template>

<script>
import GitHubSvg from '@/assets/svgs/github.svg';

export default {
  name: 'GitHubCorner',
  components: { GitHubSvg },
};
</script>