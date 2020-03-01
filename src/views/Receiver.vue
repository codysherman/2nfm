<style scoped lang="sass">
.menu-bar
  position: fixed
  left: 10px
  top: 5px

  button
    color: gray
    margin-right: 10px

#stats-bar
  background-color: rgba(255, 255, 255, 0.92)
  top: 35px
  left: 20px
  position: absolute
  text-align: left
  padding: 10px

#stats-bar-html
  padding: 5px 10px

#hide-stats-bar
  position: absolute
  top: 5px
  right: 5px
  cursor: pointer

  svg
    width: 10px
    height: 10px

#loading-logo
  height: 53px
  width: auto

@keyframes dash
  90%
    stroke-dashoffset: 0
  100%
    stroke-dashoffset: 0


#loading-logo path
  stroke: $secondary-color
  stroke-width: 1.5
  stroke-dasharray: 495
  stroke-dashoffset: 990
  animation: dash 15s ease-in-out 1.5s infinite

#logo
  height: 50px
  width: auto
  fill: $primary-color
  animation: fade-in 2s ease-out

video
  width: 60%
  height: auto
  object-fit: contain
  margin-bottom: 20px
  background-color: $tertiary-color
  transition: width $animate-speed

  &.theater-mode
    width: 100%

#media-controls, #media-settings
  width: 60%
  animation: fade-in 0.4s
  #volume-slider, #play-button-container, #autoplay
      margin: 6px 6px

  #play-button-container
    width: 30px
    height: 30px
    margin-right: 5px

    svg
      width: 30px
      height: 30px
      fill: $primary-color

  #volume-slider
    max-width: 120px
    @media only screen and (max-device-width: 768px)
      max-width: 80px
    @supports (-webkit-touch-callout: none) // iOS volume slider doesn't work, so hide it
      visibility: hidden

  #autoplay
    input, label
      margin: auto 4px 47px

#fullscreen-button
  svg
    width: 30px
    fill: $primary-color
    transition: transform 0.4s

  &:hover,
  &:active,
  &:focus
    transform: scale(1.1)
  @supports (-webkit-touch-callout: none) // fullscreen API doesn't work on iOS, so hide it
    visibility: hidden

#theater-button
  svg
    width: 30px
    fill: $primary-color
    transition: transform 0.4s

  &:hover,
  &:active,
  &:focus
    transform: scale(1.1)

#theater-button svg
  width: 18px

#info-bar
  font-size: 24px
  margin-top: 20px
  text-align: center
  transition: fade-in 0.4s

.create-message
  font-size: 24px
  margin-top: 20px
  text-decoration: underline
  transition: fade-in 0.4s

.viewer-count
  margin: 5px 5px 5px
  text-align: center
  font-size: 20px
  font-weight: bold
  @media only screen and (max-device-width: 768px)
    font-size: 18px
</style>

<template lang="pug">
#receiver.height-100
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
      button#show-stats-bar.button-link(v-if="isStream" @click="showStats") Stats
      // <button id="show-chats" class="button-link">Past Tabs</button>
  #stats-bar.shadow-light(v-if="statsVisible")
    #hide-stats-bar(@click="hideStats")
      XSvg
    #stats-bar-html
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
      LoadingSvg#loading-logo
    router-link(v-if="isStream", to="/")
      LogoSvg#logo
    #tab-title.mt-30.mb-20(onclick="document.execCommand('copy')")
    video.shadow-light(
      ref='videoPlayer'
      :class="{ 'theater-mode': theaterMode }"
      @click='togglePlayback'
      playsinline
      :hidden="!stream.isVideo"
    )
      | Your browser does not support the video element.
    audio(ref='audioPlayer' :hidden="!stream.isAudio")
      | Your browser does not support the audio element.
    #media-controls.frow.nowrap(v-if="isStream" :class="{ 'justify-between': stream.isVideo }")
      .frow.nowrap
        button#play-button-container.frow.nowrap.button-none(
          type="button"
          v-if="stream.isAudio || stream.isVideo"
          @click="togglePlayback"
        )
          PlaySvg(v-if="!isPlaying")
          PauseSvg(v-else)
        input#volume-slider.frow.nowrap(
          type="range"
          :value="volume"
          min="0"
          max="1"
          step="0.01"
          @input="setVolume"
        )

      .frow(v-if="stream.isVideo && isPlaying")
        button#theater-button.button-none.mr-20(
          type="button"
          @click="toggleTheaterMode"
        )
          TheaterSvg
        button#fullscreen-button.button-none(
          type="button"
          @click="fullscreenVideo"
        )
          FullscreenSvg
    #media-settings.frow.nowrap(v-if="isStream" :class="{ 'justify-between': stream.isVideo }")
      div#autoplay.frow.nowrap
        input(
          type="checkbox"
          :checked = "autoplay"
          @change="toggleAutoPlay"
        )
        label AutoPlay
      .viewer-count
        span#viewer-count-number
        | {{ receiverViewerCount }} {{ receiverViewerCount === 1 ? 'Viewer' : 'Viewers' }}
    #info-bar(v-if="!isStream") {{ infoBarMessage }}
    router-link.create-message(v-if="!isStream", to="/streamer") Create your own room
  #chat-container(hidden)
    #chat-messages
    input#txt-chat-message(type="text" placeholder="Enter Chat Message" hidden)

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

export default {
  name: 'Receiver',
  components: {
    XSvg,
    LoadingSvg,
    LogoSvg,
    PlaySvg,
    PauseSvg,
    FullscreenSvg,
    TheaterSvg,
    ReceiverConnection,
  },
  data() {
    return {
      roomName: this.$route.params.room,
      stream: {},
      isStream: false,
      isPlaying: false,
      theaterMode: false,
      statsVisible: false,
      volume: window.localStorage.getItem('volume') || 0.5,
      NO_MORE: false,
      stats: {},
      infoBarMessage: '',
      // set by Receiver.onPresenceCheckWait / Connection(@presenceCheckWait)
      presenceCheckWait: null,
      receiverViewerCount: 0,
      autoplay: true,
    };
  },
  computed: {
    player() {
      if (this.stream.isVideo) {
        return this.$refs.videoPlayer;
      } else if (this.stream.isAudio) {
        return this.$refs.audioPlayer;
      } else {
        return null;
      }
    },
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
    const localstorageAutoplay = JSON.parse(localStorage.getItem('autoplay'))
    if (localstorageAutoplay !== null) {
      this.autoplay = localstorageAutoplay
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
            ${this.presenceCheckWait / 1000} seconds.`;
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
        this.$refs.videoPlayer.srcObject = null;

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
      this.$refs.videoPlayer.srcObject = null;
      this.$refs.audioPlayer.srcObject = null;
      this.stream = stream;
      this.stream.mute();

      if (this.stream.isVideo) {
        this.$refs.videoPlayer.srcObject = this.stream;
        this.$refs.videoPlayer.srcObject.getVideoTracks()[0].enabled = true;
        if (this.$refs.videoPlayer.srcObject.getAudioTracks().length) {
          this.$refs.videoPlayer.srcObject.getAudioTracks()[0].enabled = true;
        }
        this.$refs.videoPlayer.volume = this.volume;
      } else {
        this.$refs.audioPlayer.srcObject = this.stream;
        this.$refs.audioPlayer.srcObject.getAudioTracks()[0].enabled = true;
        this.$refs.audioPlayer.volume = this.volume;
      }
      if (this.autoplay) {
        this.playMedia();
      }
    },
    onPresenceCheckWait(newValue) {
      this.presenceCheckWait = newValue;
    },
    onReceiverViewerCount(count) {
      this.receiverViewerCount = count;
    },
    onStats(stats) {
      if (this.NO_MORE) {
        stats.nomore();
        return;
      }
      this.stats = stats;
    },
    async playMedia() {
      try {
        await this.player.play();
        this.isPlaying = true;
      } catch (err) {
        // Playback Failed
      }
    },
    toggleAutoPlay() {
      this.autoplay = !this.autoplay
      localStorage.setItem('autoplay', JSON.stringify(this.autoplay))
    },
    togglePlayback() {
      if (this.player.paused) {
        this.playMedia();
      } else {
        this.player.pause();
        this.isPlaying = false;
      }
    },
    setVolume(event) {
      this.$refs.audioPlayer.volume = event.srcElement.valueAsNumber;
      this.$refs.videoPlayer.volume = event.srcElement.valueAsNumber;
      this.volume = event.srcElement.valueAsNumber;
      localStorage.setItem('volume', event.srcElement.valueAsNumber);
    },
    fullscreenVideo() {
      if (this.$refs.videoPlayer.requestFullscreen)
        this.$refs.videoPlayer.requestFullscreen();
      else if (this.$refs.videoPlayer.mozRequestFullScreen)
        this.$refs.videoPlayer.mozRequestFullScreen();
      else if (this.$refs.videoPlayer.webkitRequestFullScreen)
        this.$refs.videoPlayer.webkitRequestFullScreen();
      else if (this.$refs.videoPlayer.msRequestFullscreen)
        this.$refs.videoPlayer.msRequestFullscreen();
    },
    toggleTheaterMode() {
      this.theaterMode = !this.theaterMode;
    },
    showStats() {
      this.statsVisible = true;
      this.NO_MORE = false;
    },
    hideStats() {
      this.statsVisible = false;
      this.NO_MORE = true;
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
