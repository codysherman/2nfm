<style scoped lang="sass">
.home-logo
  height: 70px
  width: auto
  margin: 0 auto
  fill: var(--inverse-color)
  animation: fade-in 2s ease-out

  // XS
  @media (max-width: 767px)
    height: 50px

.home-half
  width: 45%
  padding: 20px 0
  text-align: center

  // XS
  @media (max-width: 767px)
    width: 100%

    & > .frow
      flex-direction: row
      justify-content: center

.stream-button,
.enter-room
  font-size: 40px

  // XS
  @media (max-width: 767px)
    font-size: 30px

.stream-button
  width: 200px
  margin: 0 auto
  background-color: red
  border-color: red
  animation: pulse 1.5s ease-in-out infinite alternate

  &:hover,
  &:focus,
  &:active
    animation: none
    background-color: red
    border-color: red

.line-divider
  margin: 0 30px
  background-color: $gray-lighter
  width: 2px

  // XS
  @media (max-width: 767px)
    margin: 30px 30px
    width: 100%
    height: 2px

.room-input
  font-size: 30px
  width: 205px

.enter-room
  width: 70px
  margin-left: 10px

  &:disabled
    background: $gray-lighter
</style>

<template lang="pug">
div
  GitHubCorner
  .frow.centered-column.align-between.nowrap.width-100
    LogoSvg.home-logo
    .frow.items-stretch.width-100.mt-50
      .home-half
        .frow.column-end
          div
            h1.mb-30 Start a Room
            router-link.stream-button(type="button" to="/streamer")
              | Stream
      .line-divider
      .home-half
        .frow.column-start
          div
            h1.mb-30 Join a Room
            form.frow.nowrap(@submit.prevent="goToRoom")
              input.room-input(type="text" v-model="roomId" placeholder="Room Name")
              button.enter-room(type="submit" :disabled="!roomId")
                | Go
    PublicRooms(:publicRoomCount.sync="publicRoomCount")
</template>

<script>
import LogoSvg from '@/assets/svgs/logo.svg';
import GitHubCorner from '@/components/GitHubCorner.vue';
import PublicRooms from '@/components/PublicRooms.vue';

export default {
  name: 'Home',
  metaInfo() {
    return {
      title:
      `2N.fm ${!this.publicRoomCount ? ''
        : `· ${this.publicRoomCount} ${this.publicRoomCount === 1 ? 'room' : 'rooms'}`}`,
    };
  },
  components: {
    LogoSvg,
    GitHubCorner,
    PublicRooms,
  },
  data() {
    return {
      roomId: '',
      publicRoomCount: 0,
    };
  },
  methods: {
    goToRoom() {
      this.roomId = this.roomId
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-_]/g, '')
        .toLowerCase();
      this.$router.push(this.roomId);
    },
  },
};
</script>