<style scoped lang="sass">
::v-deep
  video
    width: 60%

    &.theater-mode
      width: 100%
</style>

<template lang="pug">
  .frow.centered-column
    VideoPlayer(
      :class="{ 'theater-mode': theaterMode }"
      v-show="stream.isVideo"
      ref="videoPlayer"
    )
    AudioPlayer(
      v-show="stream.isAudio"
      ref="audioPlayer"
    )
    MediaControls(
      v-if="stream"
      :isVideo="stream.isVideo"
      :isAudio="stream.isAudio"
      :player="player"
      :autoplay.sync="autoplay"
      :theaterMode.sync="theaterMode"
      :receiverViewerCount="receiverViewerCount"
    )
</template>

<script>
import ReceiverConnection from '@/components/ReceiverConnection.vue';
import VideoPlayer from '@/components/Player/VideoPlayer.vue';
import AudioPlayer from '@/components/Player/AudioPlayer.vue';
import MediaControls from '@/components/Player/MediaControls.vue';


export default {
  name: 'Player',
  components: {
    ReceiverConnection,
    VideoPlayer,
    AudioPlayer,
    MediaControls,
  },
  props: {
    stream: {
      type: MediaStream,
      default: null,
    },
    receiverViewerCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isStream: false,
      isPlaying: false,
      theaterMode: false,
      statsVisible: false,
      volume: window.localStorage.getItem('volume') || 0.5,
      stats: {},
      infoBarMessage: '',
      // set by Receiver.onPresenceCheckWait / Connection(@presenceCheckWait)
      presenceCheckWait: null,
      autoplay: JSON.parse(window.localStorage.getItem('autoplay')) === false ? false : true,
    };
  },
  computed: {
    player() {
      if (this.stream.isVideo) {
        return this.$refs.videoPlayer.$refs.player;
      } else if (this.stream.isAudio) {
        return this.$refs.audioPlayer.$refs.player;
      }
      return null;
    },
  },
  watch: {
    stream() {
      this.onStream();
    },
  },
  methods: {
    onStream() {
      this.player.srcObject = null;
      this.stream.mute();
      
      this.player.srcObject = this.stream;
      if (this.stream.isVideo) {
        this.player.srcObject.getVideoTracks()[0].enabled = true;
      }
      if (this.player.srcObject.getAudioTracks().length) {
        this.player.srcObject.getAudioTracks()[0].enabled = true;
      }
      this.player.volume = this.volume;
      if (this.autoplay) {
        this.playMedia();
      }
    },
    onPresenceCheckWait(newValue) {
      this.presenceCheckWait = newValue;
    },
    async playMedia() {
      try {
        await this.player.play();
        this.isPlaying = true;
      } catch (err) {
        console.error(err);
        // Playback Failed
      }
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
      this.player.volume = event.srcElement.valueAsNumber;
      this.volume = event.srcElement.valueAsNumber;
      localStorage.setItem('volume', event.srcElement.valueAsNumber);
    },
    fullscreenVideo() {
      if (this.player.requestFullscreen) this.player.requestFullscreen();
      else if (this.player.mozRequestFullScreen)
        this.player.mozRequestFullScreen();
      else if (this.player.webkitRequestFullScreen)
        this.player.webkitRequestFullScreen();
      else if (this.player.msRequestFullscreen)
        this.player.msRequestFullscreen();
    },
  },
};
</script>
