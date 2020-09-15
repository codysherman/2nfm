<style scoped lang="sass">
.menu-bar
  position: fixed
  left: 10px
  top: 5px

  button
    color: $gray-dark
    margin-right: 10px

.stats-box
  background-color: rgba(255, 255, 255, 0.92)
  top: 35px
  left: 20px
  position: absolute
  text-align: left
  padding: 10px

  svg
    position: absolute
    top: 5px
    right: 5px
    cursor: pointer
    width: 10px
    height: 10px

.loading-logo
  height: 53px
  width: auto
  margin-bottom: 20px

@keyframes dash
  90%
    stroke-dashoffset: 0
  100%
    stroke-dashoffset: 0

.loading-logo path
  stroke: $secondary-color
  stroke-width: 1.5
  stroke-dasharray: 495
  stroke-dashoffset: 990
  animation: dash 15s ease-in-out 1.5s infinite

.reciever-logo
  height: 50px
  width: auto
  fill: $primary-color
  animation: fade-in 2s ease-out

.info-bar
  font-size: 24px
  margin-top: 20px
  text-align: center
  transition: fade-in 0.4s

.create-message
  font-size: 24px
  margin-top: 20px
  text-decoration: underline
  transition: fade-in 0.4s
</style>

<template lang="pug">
div
  ReceiverConnection(
    :roomName="roomName"
    @state="onConnectionStateChanged"
    @stream="onStream"
    @presenceCheckWait="onPresenceCheckWait"
    @stats="onStats"
    @receiverViewerCount="onReceiverViewerCount"
  )
  .menu-bar
    .frow.row-start
      button.button-link(v-if="isStream" @click="showStats")
        | Stats
  .stats-box.shadow-light(v-if="statsVisible")
    XSvg(@click="hideStats")
    .m-10
      div(v-if="stats.video.recv.codecs.length > 0")
        | {{ `Video: ${stats.video.recv.codecs}` }}
      div(v-if="stats.video.recv.codecs.length > 0")
        | {{ `Resolution: ${stats.resolutions.recv.width}x${stats.resolutions.recv.height}` }}
      div(v-if="stats.audio.recv.codecs.length > 0")
        | {{ `Audio: ${stats.audio.recv.codecs}` }}
      div
        | {{ `Data: ${this.bytesToSize(stats.audio.bytesReceived + stats.video.bytesReceived)}` }}
  .frow.centered-column.nowrap
    router-link.create-message(v-if="!isStream", to="/")
      LoadingSvg.loading-logo
    router-link.mb-50(v-if="isStream", to="/")
      LogoSvg.reciever-logo
    Player(
      v-show="isStream"
      :stream="stream"
      :receiverViewerCount="receiverViewerCount"
      :showExtraControls="true"
    )
    .info-bar(v-if="!isStream")
      | {{ infoBarMessage }}
    router-link.create-message(v-if="!isStream", to="/streamer")
      | Create your own room
    PublicRooms.mt-40(v-if="!isStream")
</template>

<script>
import XSvg from '@/assets/svgs/x.svg';
import LoadingSvg from '@/assets/svgs/loading.svg';
import LogoSvg from '@/assets/svgs/logo.svg';
import PlaySvg from '@/assets/svgs/play.svg';
import PauseSvg from '@/assets/svgs/pause.svg';
import FullscreenSvg from '@/assets/svgs/fullscreen.svg';
import TheaterSvg from '@/assets/svgs/theater.svg';

import ReceiverConnection from '@/components/ReceiverConnection.vue';
import PublicRooms from '@/components/PublicRooms.vue';

import Player from '@/components/Player/Player.vue';

export default {
  name: 'Receiver',
  metaInfo() {
    return { title: `2N.fm · ${this.roomName}` };
  },
  components: {
    XSvg,
    LoadingSvg,
    LogoSvg,
    PlaySvg,
    PauseSvg,
    FullscreenSvg,
    TheaterSvg,
    ReceiverConnection,
    PublicRooms,
    Player,
  },
  data() {
    return {
      roomName: this.$route.params.room,
      stream: new MediaStream,
      isStream: false,
      statsVisible: false,
      stats: {},
      infoBarMessage: '',
      // set by Receiver.onPresenceCheckWait / Connection(@presenceCheckWait)
      presenceCheckWait: null,
      receiverViewerCount: 0,
    };
  },
  created() {
    const sanitizedRoomId = this.$route.params.room
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_]/g, '')
      .toLowerCase();
    if (this.$route.params.room !== sanitizedRoomId) {
      this.$router.push(sanitizedRoomId);
    }
  },
  mounted() {
    window.addEventListener('offline', this.setOffline, false);
    window.addEventListener('online', this.setOnline, false);
  },
  beforeDestroy() {
    window.removeEventListener('offline', this.setOffline, false);
    window.removeEventListener('online', this.setOnline, false);
  },
  methods: {
    onConnectionStateChanged(state) {
      switch (state.value) {
        case ReceiverConnection.STATE.NOT_HOSTED:
          this.infoBarMessage = `Room: ${this.roomName} isn't hosted yet.
            Checking again ${this.presenceCheckWait === 60000 ? 'every' : 'in'}
            ${Math.round(this.presenceCheckWait / 1000)} seconds.`;
          break;
        case ReceiverConnection.STATE.JOINING:
          this.infoBarMessage = `Joining room: ${this.roomName}`;
          break;
        case ReceiverConnection.STATE.UNAUTHORIZED:
          this.infoBarMessage = 'Incorrect password';
          break;
        case ReceiverConnection.STATE.UNAVAILABLE:
          this.infoBarMessage = `
          Screen share session is closed or paused.
          You will join automatically when share session is resumed.
        `;
          break;
        case ReceiverConnection.STATE.PEER_WILL_SEND:
          this.infoBarMessage = 'Remote peer is about to send his screen.';
          break;
        case ReceiverConnection.STATE.SOCKET_CLOSED:
          this.stream = null;

          this.infoBarMessage = 'Screen sharing has been closed.';
          this.hideStats();

          location.reload();
          break;
        case ReceiverConnection.STATE.SOCKET_DISCONNECT:
        // Required only when ending a stream using "share tab chrome bar" while a receiver is open.
          this.isStream = false;

          location.reload();
          break;
        case ReceiverConnection.STATE.SOCKET_ERROR:
          alert('Unable to connect to the server. Please try again.');

          setTimeout(() => {
            location.reload();
          }, 1000);
          break;
        case ReceiverConnection.STATE.HAVE_OFFER:
          this.infoBarMessage = `Received WebRTC offer from: ${this.roomName}`;
          break;
        case ReceiverConnection.STATE.HANDSHAKE_COMPLETE:
          this.infoBarMessage = `
          WebRTC handshake is completed.
          Waiting for remote video from: ${this.roomName}
        `;
          break;
        case ReceiverConnection.STATE.CONNECTED:
          this.isStream = true;
          break;
        case ReceiverConnection.STATE.DISCONNECTED:
          this.isStream = false;

          this.infoBarMessage = 'You\'ve been disconnected. Please try again.';
          break;
        case ReceiverConnection.STATE.GENERIC:
          this.infoBarMessage = `${state.name}: ${state.reason}`;
          break;
      }
    },
    onStream(stream) {
      this.stream = stream;
    },
    onPresenceCheckWait(newValue) {
      this.presenceCheckWait = newValue;
    },
    onReceiverViewerCount(count) {
      this.receiverViewerCount = count;
    },
    onStats(stats) {
      this.stats = stats;
    },
    showStats() {
      this.statsVisible = true;
    },
    hideStats() {
      this.statsVisible = false;
    },
    bytesToSize(bytes) {
      let k = 1000;
      let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) {
        return '0 Bytes';
      }
      let i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
      return `${(bytes / Math.pow(k, i)).toPrecision(3)} ${sizes[i]}`;
    },
  },
  setOffline() {
    this.infoBarMessage = 'You seem to be offline.';
  },
  setOnline() {
    this.infoBarMessage = 'You are back online. Reloading the page...';
    location.reload();
  },
};
</script>