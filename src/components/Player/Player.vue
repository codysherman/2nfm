<style scoped lang="sass"></style>

<template lang="pug">
  .player
    VideoPlayer(
      v-show="stream.isVideo"
      ref="videoPlayer"
    )
    AudioPlayer(
      v-show="stream.isAudio"
      ref="audioPlayer"
    )
    p(@click="togglePlayback") play {{ stream }}
</template>

<script>
import ReceiverConnection from '@/components/ReceiverConnection.vue';
import VideoPlayer from '@/components/Player/VideoPlayer.vue';
import AudioPlayer from '@/components/Player/AudioPlayer.vue';

export default {
  name: 'Player',
  components: {
    ReceiverConnection,
    VideoPlayer,
    AudioPlayer,
  },
  props: {
    stream: {
      type: MediaStream,
      default: null,
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
    };
  },
  computed: {
    player() {
      if (this.stream.isVideo) {
        return this.$refs.videoPlayer.$refs.videoPlayer;
      } else if (this.stream.isAudio) {
        return this.$refs.audioPlayer.$refs.audioPlayer;
      } else {
        return null;
      }
    },
  },
  watch: {
    stream: function() {
      this.onStream();
    },
  },
  methods: {
    onStream() {
      console.log('=====ON STREAM=====');
      this.player.srcObject = null;
      this.$refs.audioPlayer.srcObject = null;
      this.stream.mute();

      if (this.stream.isVideo) {
        this.player.srcObject = this.stream;
        this.player.srcObject.getVideoTracks()[0].enabled = true;
        if (this.player.srcObject.getAudioTracks().length) {
          this.player.srcObject.getAudioTracks()[0].enabled = true;
        }
        this.player.volume = this.volume;
      } else {
        this.$refs.audioPlayer.srcObject = this.stream;
        this.$refs.audioPlayer.srcObject.getAudioTracks()[0].enabled = true;
        this.$refs.audioPlayer.volume = this.volume;
      }
      this.playMedia();
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
