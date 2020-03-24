<style scoped lang="sass">
::v-deep
  video
    width: 60%

    &.theater-mode
      width: 100%
</style>

<template lang="pug">
  .frow.column-center.width-100
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
      :isVideo="stream.isVideo"
      :isAudio="stream.isAudio"
      :player="player"
      :autoplay.sync="autoplay"
      :theaterMode.sync="theaterMode"
      :receiverViewerCount="receiverViewerCount"
      :showExtraControls="showExtraControls"
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
    disableAutoplay: {
      type: Boolean,
      default: false,
    },
    showExtraControls: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      theaterMode: false,
      player: null,
      volume: window.localStorage.getItem('volume') || 0.5,
      autoplay: JSON.parse(window.localStorage.getItem('autoplay')) === false ? false : true,
    };
  },
  watch: {
    stream() {
      if (this.stream.active) {
        this.onStream();
      }
    },
  },
  mounted() {
    if (this.stream && this.stream.active) {
      this.onStream();
    }
  },
  methods: {
    determinePlayer() {
      if (this.stream.isVideo) {
        this.player = this.$refs.videoPlayer.$refs.player;
      } else {
        this.player = this.$refs.audioPlayer.$refs.player;
      }
    },
    onStream() {
      if (typeof this.stream.mute === 'function') { 
        this.stream.mute();  // HACK: Avoids double audio
      }
      this.determinePlayer();
      this.player.srcObject = null;
      
      this.player.srcObject = this.stream;
      if (this.stream.isVideo) {
        this.player.srcObject.getVideoTracks()[0].enabled = true;
      }
      if (this.player.srcObject.getAudioTracks().length) {
        this.player.srcObject.getAudioTracks()[0].enabled = true;
      }
      this.player.volume = this.volume;
      if (this.autoplay && !this.disableAutoplay) {
        this.playMedia();
      }
    },
    async playMedia() {
      try {
        await this.player.play();
      } catch (err) {
        console.error(err);
        // Playback Failed
      }
    },
  },
};
</script>
