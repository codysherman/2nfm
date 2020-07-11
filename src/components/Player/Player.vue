<style scoped lang="sass">
::v-deep
  video
    width: 60%

    &.theater-mode
      width: 100%
</style>

<template lang="pug">
.frow.column-center.width-100.nowrap
  VideoPlayer(
    :class="{ 'theater-mode': theaterMode }"
    v-show="stream.containsVideo"
    ref="videoPlayer"
  )
  AudioPlayer(
    v-show="!stream.containsVideo && stream.containsAudio"
    ref="audioPlayer"
  )
  AudioPlayer(
    v-show="stream.containsMic"
    ref="micPlayer"
  )
  MediaControls(
    :class="{ 'mt-20': stream.containsVideo }"
    :containsVideo="stream.containsVideo"
    :player="player"
    :theaterMode.sync="theaterMode"
    @togglePlayback="togglePlayback"
  )
  MediaControls.mt-10(
    v-if="stream.containsMic"
    :containsVideo="stream.containsVideo"
    :containsMic="true"
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
      if (this.stream.containsVideo) {
        this.player = this.$refs.videoPlayer.$refs.player;
      } else {
        this.player = this.$refs.audioPlayer.$refs.player;
      }

      if (this.stream.containsMic) {
        this.micPlayer = this.$refs.micPlayer.$refs.player;
      }
    },
    onStream() {
      if (typeof this.stream.mute === 'function' && !navigator.mozGetUserMedia) {
        // HACK: Avoids double audio in Chrome-based browsers
        console.warn('Avoiding double audio in Chrome via RTCMultiConnection#mute');
        // this.stream.mute();
      }

      this.determinePlayers();

      // NOTE: we clone all individual tracks so we can stop the old ones later.
      const tempPlayerStream = new MediaStream();
      if (this.stream.containsVideo) {
        const track = this.stream.getVideoTracks()[0].clone();
        tempPlayerStream.addTrack(track);
      }
      if (!(this.stream.getAudioTracks().length === 1 && this.stream.containsMic)
        && this.stream.getAudioTracks().length) {
        const track = this.stream.getAudioTracks()[0].clone();
        tempPlayerStream.addTrack(track);
      }

      tempPlayerStream.getTracks().forEach((track) => { track.enabled = true; });
      this.player.srcObject = tempPlayerStream;

      if (this.stream.containsMic) {
        const tempMicStream = new MediaStream();
        const track = this.stream.getAudioTracks().slice(-1)[0].clone(); // get last track
        tempMicStream.addTrack(track);
        tempMicStream.getTracks()[0].enabled = true;
        this.micPlayer.srcObject = tempMicStream;
      }

      if (navigator.mozGetUserMedia) {
        // HACK: Avoids double audio in Firefox
        console.warn('Avoiding double audio in Firefox via MediaStreamTrack#stop');
        this.stream.getAudioTracks().forEach((track) => track.stop());
      }

      this.player.volume = this.volume;
      if (this.autoplay && !this.disableAutoplay) {
        this.playMedia();
      }
    },
    async playMedia() {
      try {
        await this.player.play();
        if (this.stream.containsMic) {
          await this.micPlayer.play();
        }
      } catch (err) {
        if (err.name == 'NotAllowedError') {
          console.warn(
            'Unable to playMedia due to browser permissions;',
            'this is probably autoplay, so failing silently',
          );
        } else {
          // Playback Failed
          console.error(err);
        }
      }
    },
    togglePlayback() {
      if (this.player.paused) {
        this.playMedia();
      } else {
        this.player.pause();
        if (this.stream.containsMic) {
          this.micPlayer.pause();
        }
      }
    },
  },
};
</script>
