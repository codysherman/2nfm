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
      :class="{ 'mt-20': stream.isVideo }"
      :isVideo="stream.isVideo"
      :player="player"
      :autoplay.sync="autoplay"
      :theaterMode.sync="theaterMode"
      @togglePlayback="togglePlayback"
    )
    MediaControls.mt-10(
      v-if="stream.micId"
      :isVideo="stream.isVideo"
      :isMic="true"
      :player="this.micPlayer"
    )
    ExtraControls.mt-30(
      v-if="showExtraControls"
      :autoplay.sync="autoplay"
      :receiverViewerCount="receiverViewerCount"
    )
</template>

<script>
import ReceiverConnection from '@/components/ReceiverConnection.vue';
import VideoPlayer from '@/components/Player/VideoPlayer.vue';
import AudioPlayer from '@/components/Player/AudioPlayer.vue';
import MediaControls from '@/components/Player/MediaControls.vue';
import ExtraControls from '@/components/Player/ExtraControls.vue';


export default {
  name: 'Player',
  components: {
    ReceiverConnection,
    VideoPlayer,
    AudioPlayer,
    MediaControls,
    ExtraControls,
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
      if (!(this.stream.getAudioTracks().length === 1 && this.stream.micId)
        && this.stream.getAudioTracks().length) {
        tempPlayerStream.addTrack(this.stream.getAudioTracks()[0]);
        tempPlayerStream.getAudioTracks()[0].enabled = true;
      }
      this.player.srcObject = tempPlayerStream;
      if (this.stream.micId) {
        const tempMicStream = new MediaStream();
        tempMicStream.addTrack(
          this.stream.getAudioTracks()[1]
            ? this.stream.getAudioTracks()[1]
            : this.stream.getAudioTracks()[0],
        );
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
        if (this.stream.micId) {
          await this.micPlayer.play();
        }
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
        if (this.stream.micId) {
          this.micPlayer.pause();
        }
      }
    },
  },
};
</script>
