<style scoped lang="sass">
.card
  background-color: $white
  padding: 15px
  text-align: center

#logo
  display: block
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
  font-weight: $weight-bold
  font-size: 91px
  text-align: center

  &.live
    color: red
    border-color: red
    animation: pulse 1.5s ease-in-out infinite alternate

#id-taken
  color: #721c24
  background-color: #f8d7da
  border: 1px solid #f5c6cb
  padding: 0.6em
  margin-top: 0.5em
  border-radius: $border-radius-small

/* XS */
@media (max-width: 767px)
  #logo
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

/* XS */
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
    border-radius: $border-radius-small
    padding: 2px 10px
    width: auto
    z-index: $z-page

    &.right-item
      left: auto
      right: 30px
      cursor: pointer

      svg
        height: 8px
        width: auto
        margin: 0 4px 2px

  .advanced
    overflow: hidden

    &,
    & > .frow
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0

    > .frow
      animation: slide-down $animate-speed ease
      background-color: $tertiary-color
      border: 2px solid $tertiary-color
      height: 100%

.settings-item
  margin-bottom: 40px

  label
    margin-bottom: 0

#start
  border: 2px solid $tertiary-color
  border-radius: 10px
  padding: 40px 40px 35px
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
    width: 40px
    height: auto
    margin-bottom: 10px

  path
    fill: $primary-color
    transition: fill 0.3s

  &:hover svg path
    fill: $black

.and-mic
  opacity: 0
  transition: opacity $animate-speed
</style>

<template lang="pug">
.frow.centered
  DesktopCapturer(
    ref="capturer"
    :enableVideo="enableVideo"
    :enableAudio="enableAudio"
    :isMic="isMic"
    :resolution="resolution"
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
    :privacy="privacy"
    :enableVideo="enableVideo"
    :enableAudio="enableAudio"
    :isP2POnly="isP2POnly"
    @sessionId="onSessionId"
    @viewerCount="onViewerCount"
    @idTaken="onIdTaken"
  )
  .col-md-1-2
    router-link#logo(to="/")
      LogoSvg
    #live-indicator(:class="{ live: isSharingOn && sessionId }") LIVE
  .col-md-1-2
    div#id-taken(v-if="useridAlreadyTaken")
      | ⚠️ Whoops,
      b &nbsp;{{useridAlreadyTaken}}&nbsp;
      | already taken! Please choose another room name.
    section#setup-section(v-if="!isSharingOn || !sessionId")
      label#room-id-label.row-start
        span.shrink-0 2n.fm/
        input#room-id(
          type="text"
          placeholder="Random"
          v-model="room_id"
          @change="setRoomName"
          @blur="setRoomName")
      section#options
        .label Options
        .label.right-item(@click="showAdvancedOptions = !showAdvancedOptions")
          div(v-if="!showAdvancedOptions")
            | ⚙
            sup !
          div(v-if="showAdvancedOptions")
            XSvg
        .advanced(v-show="showAdvancedOptions")
          .frow.centered
            label.row-center.mb-0
              input(type="checkbox" v-model="isP2POnly")
              | Only send audio and video via peer-to-peer connections
        .frow.gutters
          .col-xs-1-2
            .settings-item
              label
                | Resolution
                select#resolutions(v-model="resolution")
                  option(:value="Resolutions.FitScreen" selected="") Fit Screen
                  option(:value="Resolutions.Fit4K") 4K (2160p)
                  option(:value="Resolutions.Fit2K") 2K (1440p)
                  option(:value="Resolutions.Fit1080p") Full-HD (1080p)
                  option(:value="Resolutions.Fit720p") HD (720p)
                  option(:value="Resolutions.Fit480p") SD (480p)
                  option(:value="Resolutions.Fit360p") SD (360p)
          .col-xs-1-2
            label.row-start
              input(type="radio" value="private" v-model="privacy")
              | Private Room
            label.row-start.mb-0
              input(type="radio" value="public" v-model="privacy")
              | Public Room
          .col-xs-1-2
            label.row-start
              input(type="checkbox" v-model="isMic")
              | Enable Microphone
          .col-xs-1-2
            label.row-start
              | Codec
              select.ml-5(v-model="codecs")
                //- option(value="default" selected="") Default (VP9)
                option(:value="Codecs.vp9") VP9 (Screensharing)
                option(:value="Codecs.vp8") VP8 (Gaming)
                option(:value="Codecs.h264" :disabled="!isP2POnly") H.264
            //- .text-center
              span(v-if="codecs === Codecs.vp9")
                | Better quality, less data
              span(v-if="codecs === Codecs.vp8")
                | Lower quality, more FPS
              span(v-if="codecs === Codecs.h264")
                | Less strain on oldest devices
          //- .col-xs-1-2
          //-   .settings-item.mb-0
          //-     label
          //-       | Bandwidth
          //-       input#bandwidth(
          //-         type="text"
          //-         value=""
          //-         placeholder="Optional: 8192, 1048, 512, etc."
          //-         @change="setBandwidth"
          //-       )
          //- .col-xs-1-2
          //-   .settings-item.mb-0
          //-     label
          //-       | Room Password
          //-       input#room_password(type="password" value="" placeholder="Optional")
      
      section#stream-section
        #start
          .label Start
          .frow.gutters
            .col-xs-1-3
              .stream-button(@click="startStream(true, false)")
                .frow.column-center
                  VideoSvg
                  | Video Only
                  .and-mic(:class="{'opacity-100': isMic }")
                    | & Mic
            .col-xs-1-3
              .stream-button(@click="startStream(true, true)")
                .frow.column-center
                  VideoAndAudioSvg
                  | Video + Audio
                  .and-mic(:class="{'opacity-100': isMic }")
                    | & Mic
            .col-xs-1-3
              .stream-button(@click="startStream(false, true)")
                .frow.column-center
                  AudioSvg
                  | Audio Only
                  .and-mic(:class="{'opacity-100': isMic }")
                    | & Mic
    StopSection(
      v-if="isSharingOn && sessionId"
      :sessionId="sessionId"
      :viewerCount="viewerCount"
      :stream="stream"
      :privacy="privacy"
      @stopStream="stopStream"
    )
</template>

<script>
import { Resolutions } from '@/utils/enums/Resolutions';
import { Codecs } from '@/utils/enums/Codecs';

import LogoSvg from '@/assets/svgs/logo.svg';
import VideoSvg from '@/assets/svgs/video.svg';
import AudioSvg from '@/assets/svgs/audio.svg';
import VideoAndAudioSvg from '@/assets/svgs/video-and-audio.svg';
import XSvg from '@/assets/svgs/x.svg';

import StopSection from '@/components/Streamer/StopSection.vue';
import DesktopCapturer from '@/components/DesktopCapturer.vue';
import StreamerConnection from '@/components/StreamerConnection.vue';

export default {
  name: 'Streamer',
  metaInfo() {
    return {
      title: (
        `2N.fm ${this.isSharingOn && this.sessionId ?
          `· ${this.room_id} (${this.viewerCount})` : ''}`
      ),
    };
  },
  components: {
    LogoSvg,
    VideoSvg,
    AudioSvg,
    VideoAndAudioSvg,
    XSvg,
    StopSection,
    DesktopCapturer,
    StreamerConnection,
  },
  data() {
    return {
      isSharingOn: false,
      // sessionId aka room name
      sessionId: null,
      stream: null,
      desktop_id: null,
      constraints: null,
      room_password: '',
      room_id: window.localStorage.getItem('room_id') || '',
      resolution: Resolutions.FitScreen,
      codecs: Codecs.vp8,
      bandwidth: null,
      enableVideo: false,
      enableAudio: false,
      streaming_method: 'RTCMultiConnection',
      viewerCount: 0,
      privacy: 'private',
      useridAlreadyTaken: '',
      isMic: false,
      showAdvancedOptions: false,
      isP2POnly: false,
    };
  },
  computed: {
    Resolutions() { return Resolutions; },
    Codecs() { return Codecs; },
  },
  watch: {
    isP2POnly(isP2POnly) {
      if (!isP2POnly && this.codecs == Codecs.h264) {
        // TODO: we may want to alert the user of this change somehow
        this.codecs = Codecs.vp8;
      }
    },
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
    startStream(enableVideo, enableAudio) {
      this.enableVideo = enableVideo;
      this.enableAudio = enableAudio;
    

      if (this.$refs.connection.connection && this.$refs.connection.connection.attachStreams[0]) {
        this.onSetDefaults();
        return;
      }

      this.room_id = '';

      if (window.localStorage.getItem('room_id')) {
        this.room_id = window.localStorage.getItem('room_id');
      }

      let protectedRoutes = ['streamer'];
      if (protectedRoutes.includes(this.room_id)) {
        this.useridAlreadyTaken = 'streamer';
        return;
      }
      this.$refs.capturer.startStream();
    },
    stopStream() {
      this.$refs.capturer.stopStream();
      this.stream = null;
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
    onGotStream(stream) {
      this.stream = stream;
      this.stream.enableVideo = this.enableVideo;
      this.stream.enableAudio = this.enableAudio;
      this.$refs.connection.shareStreamUsingRTCMultiConnection(this.stream);
    },
    onSessionId(id) {
      this.useridAlreadyTaken = '';
      this.sessionId = id;
    },
    onSetDefaults() {
      this.$refs.connection.setDefaults();
    },
    onIdTaken(takenID) {
      this.useridAlreadyTaken = takenID;
      this.room_id = '';
    },
    onIsSharing(isSharing) {
      this.isSharingOn = isSharing;
      if (!this.isSharingOn) {
        this.sessionId = null;
      }
    },
    onViewerCount(count) {
      this.viewerCount = count;
    },
  },
};
</script>
