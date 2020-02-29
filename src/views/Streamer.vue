<style scoped lang="sass">
.card
  background-color: $white
  padding: 15px
  text-align: center

#logo
  margin: 0 auto
  width: 228px
  height: auto
  fill: $primary-color

#live-indicator
  margin: 15px auto 0
  width: 228px
  color: $tertiary-color
  border-radius: 20px
  border: 6px solid $tertiary-color
  font-weight: bold
  font-size: 91px
  text-align: center

  &.live
    color: red
    border-color: red
    animation: pulse 1.5s ease-in-out infinite alternate

/* XS
@media (max-width: 767px)
  #logo
    margin: 0 auto
    width: 114px
  #live-indicator
    width: 114px
    border-radius: 10px
    border: 3px solid $tertiary-color
    font-size: 45px
    margin-bottom: 30px

#room-id-label
  font-size: 40px
  color: $primary-color

  input
    font-size: 40px
    border-width: 4px

/* XS
@media (max-width: 767px)
  #room-id-label
    font-size: 30px

    input
      font-size: 30px
      border-width: 2px

#options
  border: 2px solid $tertiary-color
  border-radius: 10px
  padding: 40px
  margin: 40px 0
  position: relative

  .label
    position: absolute
    top: -9px
    left: 30px
    background-color: $white
    padding: 0 8px
    width: auto

.settings-item
  margin-bottom: 40px

  label
    margin-bottom: 0

#start
  border: 2px solid $tertiary-color
  border-radius: 10px
  padding: 40px
  margin-top: 40px
  position: relative

  .label
    position: absolute
    top: -9px
    left: 30px
    background-color: $white
    padding: 0 8px
    width: auto

.stream-button
  cursor: pointer
  transition: color 0.3s

  &:hover
    color: $black

  svg
    width: auto
    height: 40px
    margin-bottom: 10px

  path
    fill: $primary-color
    transition: fill 0.3s

  &:hover svg path
    fill: $black

#public-link
  display: block
  font-size: 40px
  color: $primary-color
  margin: 0 auto
  text-align: center

/* XS
@media (max-width: 767px)
  #public-link
    font-size: 30px

.viewer-count
  margin: 5px auto 60px
  text-align: center
  font-size: 20px
  font-weight: bold

#stop-sharing
  margin: 0 auto
  font-size: 40px
  padding: 20px
  background: none
  border: 3px solid $primary-color
  color: $primary-color
  border-radius: 10px
</style>

<template lang="pug">
.frow.centered
  DesktopCapturer(
    ref="capturer"
    :enableVideo="isVideo"
    @isSharing="onIsSharing"
    @gotStream="onGotStream"
    @setDefaults="onSetDefaults"
  )
  StreamerConnection(
    ref="connection"
    :bandwidth="bandwidth"
    :codecs="codecs"
    :roomId="room_id"
    :roomPassword="room_password"
    @sessionId="onSessionId"
    @viewerCount="onViewerCount"
  )
  .col-md-1-2
    LogoSvg#logo
    #live-indicator(:class="{ live: isSharingOn && sessionId }") LIVE
  .col-md-1-2
    section#setup-section(v-if="!isSharingOn || !sessionId")
      label#room-id-label.row-start
        span.shrink-0 2n.fm/
        input#room-id(
          type="text"
          placeholder="Random"
          v-model="room_id"
          @change="setRoomName"
          @blur="setRoomName")
      section#options(hidden="")
        .label Options
        .frow.row-start.gutters
          .col-xs-1-2
            .settings-item
              label
                | Resolution
                select#resolutions
                  option(value="fit-screen" selected="") Fit Screen
                  option(value="4K") 4K (2160p)
                  option(value="1080p") Full-HD (1080p)
                  option(value="720p") HD (720p)
                  option(value="480p") SD (480p)
                  option(value="360p") SD (360p)
          .col-xs-1-2
            .settings-item
              label
                | Codec
                select#codecs(@change="setCodecs")
                  option(value="default" selected="") Default (VP8)
                  option(value="vp8") VP8
                  option(value="vp9") VP9
                  option(value="h264") H264
          .col-xs-1-2
            .settings-item.mb-0
              label
                | Bandwidth
                input#bandwidth(
                  type="text"
                  value=""
                  placeholder="Optional: 8192, 1048, 512, etc."
                  @change="setBandwidth"
                )
          .col-xs-1-2
            .settings-item.mb-0
              label
                | Room Password
                input#room_password(type="password" value="" placeholder="Optional")
      section#stream-section
        #start
          .label Start
          .frow.gutters
            .col-xs-1-2
              #video-button.stream-button(@click="startStream(true)")
                .frow.column-center
                  VideoSvg
                  | Video
            .col-xs-1-2
              #audio-button.stream-button(@click="startStream()")
                .frow.column-center
                  AudioSvg
                  | Audio Only
    section#stop-section(v-if="isSharingOn && sessionId")
      //- router-link#public-link(
      //-   to="{query: { s: sessionId, p: room_password }}`}" target="_blank"
      //- )
      router-link#public-link(:to="sessionId" target="_blank")
        | {{ `2n.fm/${sessionId}` }}
      .viewer-count
        span#viewer-count-number
        | {{ viewerCount }} {{ viewerCount === 1 ? 'Viewer' : 'Viewers' }} 
      button#stop-sharing(type="button" @click="stopStream")
        | End Sharing
    .frow.width-100.mt-20
      a.text-underline(
        href="https://caniuse.com/#search=getDisplayMedia"
        rel="noreferrer"
        target="_blank"
      )
        | OS and Browser Limitations
      //
        <div id="enable-chat">
        <img src="../images/chat.png">
        Open Chat Box
        </div>
</template>

<script>
import LogoSvg from '@/assets/svgs/logo.svg';
import VideoSvg from '@/assets/svgs/video.svg';
import AudioSvg from '@/assets/svgs/audio.svg';

import DesktopCapturer from '@/components/DesktopCapturer.vue';
import StreamerConnection from '@/components/StreamerConnection.vue';

export default {
  name: 'Streamer',
  components: {
    LogoSvg,
    VideoSvg,
    AudioSvg,
    DesktopCapturer,
    StreamerConnection,
  },
  data() {
    return {
      isSharingOn: false,
      // sessionId aka room name
      sessionId: null,
      desktop_id: null,
      constraints: null,
      room_password: '',
      room_id: window.localStorage.getItem('room_id') || '',
      codecs: 'default',
      bandwidth: null,
      isVideo: false,
      streaming_method: 'RTCMultiConnection',
      viewerCount: 0,
    };
  },
  mounted() {
    // document.getElementById('enable-chat').onclick = function() {
    //   var popup_width = 312;
    //   var popup_height = 400;
    //   runtimePort.postMessage({
    //     messageFromContentScript1234: true,
    //     openChat: true
    //   });
    //   window.open('chat.html','Chat','width='+popup_width+',height='+popup_height
    //     +',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=0,top='
    //     +(screen.height - popup_height)+',left=' + (screen.width - popup_width - 30));
    //   window.close();
    // };
  },
  methods: {
    startStream(isVideo = false) {
      this.isVideo = isVideo;

      if (
        this.$refs.connection.connection &&
        this.$refs.connection.connection.attachStreams[0]
      ) {
        this.onSetDefaults();
        return;
      }

      this.room_id = 'cody';

      if (window.localStorage.getItem('room_id')) {
        this.room_id = window.localStorage.getItem('room_id');
      }

      this.$refs.capturer.startStream();
    },
    stopStream() {
      this.$refs.capturer.stopStream();
    },
    setRoomName() {
      this.room_id = this.room_id
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-_]/g, '')
        .toLowerCase();
      window.localStorage.setItem('room_id', this.room_id);
    },
    setBandwidth(value) {
      try {
        this.bandwidth = parseInt(value);
      } catch (e) {
        this.bandwidth = null;
      }
    },
    setCodecs(codec) {
      this.codecs = codec;
    },
    onGotStream(stream) {
      this.$refs.connection.shareStreamUsingRTCMultiConnection(
        stream,
        this.isVideo,
      );
    },
    onSessionId(id) {
      this.sessionId = id;
    },
    onSetDefaults() {
      this.$refs.connection.setDefaults();
    },
    onIsSharing(isSharing) {
      this.isSharingOn = isSharing;
    },
    onViewerCount(count) {
      this.viewerCount = count;
    },
  },
};
</script>
