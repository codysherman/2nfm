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
    AudioPlayer(
      v-show="stream.micId"
      ref="micPlayer"
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
    MediaControls(
      :isAudio="true"
      :player="this.micPlayer"
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
      micPlayer: null,
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
    determinePlayers() {
      if (this.stream.isVideo) {
        this.player = this.$refs.videoPlayer.$refs.player;
      } else {
        this.player = this.$refs.audioPlayer.$refs.player;
      }
      if (this.stream.micId) {
        this.micPlayer = this.$refs.micPlayer.$refs.player;
      }
    },
    onStream() {
      if (typeof this.stream.mute === 'function') { 
        this.stream.mute();  // HACK: Avoids double audio
      }
      this.determinePlayers();
      const tempPlayerStream = new MediaStream();
      if (this.stream.isVideo) {
        tempPlayerStream.addTrack(
          this.stream.getVideoTracks()[0],
        );
        tempPlayerStream.getVideoTracks()[0].enabled = true;
      }
      if (this.stream.getAudioTracks().length) {
        tempPlayerStream.addTrack(this.stream.getAudioTracks().find(
          (stream) => stream.id === this.stream.systemAudioId,
        ));
        tempPlayerStream.getAudioTracks()[0].enabled = true;
      }
      this.player.srcObject = tempPlayerStream;
      if (this.stream.micId) {
        const tempMicStream = new MediaStream();
        tempMicStream.addTrack(this.stream.getAudioTracks().find(
          (stream) => stream.id === this.stream.micId,
        ));
        tempMicStream.getAudioTracks()[0].enabled = true;
        this.micPlayer.srcObject = tempMicStream;
      }
      this.player.volume = this.volume;
      if (this.autoplay && !this.disableAutoplay) {
        this.playMedia();
      }
    },
    async playMedia() {
      try {
        await this.player.play();
        await this.micPlayer.play();
      } catch (err) {
        console.error(err);
        // Playback Failed
      }
    },
  },
};
</script>
