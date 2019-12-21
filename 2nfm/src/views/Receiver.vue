<style scoped lang="sass">
body
  text-align: center

#home-logo
  height: 70px
  width: auto
  margin: 0 auto
  fill: #4f4f51
  animation: fade-in 2s ease-out

/* XS
@media (max-width: 767px)
  #home-logo
    height: 50px

.home-half
  width: 45%
  padding: 20px 0

/* XS
@media (max-width: 767px)
  .home-half
    width: 100%
  .home-half > .frow
    flex-direction: row
    justify-content: center

.stream-button,
#enter-room
  font-size: 40px

/* XS
@media (max-width: 767px)
  .stream-button,
  #enter-room
    font-size: 30px

.stream-button
  width: 200px
  margin: 0 auto
  background-color: red
  border-color: red
  animation: pulse 1.5s ease-in-out infinite alternate

.stream-button:hover
  animation: none
  background-color: red
  border-color: red

.line-divider
  margin: 0 30px
  background-color: #eaeaea
  width: 2px

/* XS
@media (max-width: 767px)
  .line-divider
    margin: 30px 30px
    width: 100%
    height: 2px

#room-input
  font-size: 30px
  width: 205px

#enter-room
  width: 70px
  margin-left: 10px

.menu-bar
  position: fixed
  left: 10px
  top: 5px

.menu-bar button
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

#hide-stats-bar svg
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
  stroke: #bebebe
  stroke-width: 1.5
  stroke-dasharray: 495
  stroke-dashoffset: 990
  animation: dash 15s ease-in-out 1.5s infinite

@keyframes fade-in
  0%
    opacity: 0.1
  100%
    opactity: 1


#logo
  height: 50px
  width: auto
  fill: #4f4f51
  animation: fade-in 2s ease-out

video
  width: 60%
  height: auto
  object-fit: contain
  margin-bottom: 20px
  background-color: #eaeaea

#media-controls
  width: 60%
  opacity: 0
  transition: opacity 0.4s

.stream-live #media-controls
  opacity: 1

#play-button-container
  width: 30px
  height: 30px
  margin-right: 20px

#play-button-container:disabled
  display: none

.play-button
  width: 15px
  height: 30px
  background: #4f4f51
  transition: clip-path 0.3s ease

.play-button-before
  clip-path: polygon(0 0, 100% 25%, 100% 75%, 0% 100%)

.play-button-after
  clip-path: polygon(0% 25%, 100% 50%, 100% 50%, 0% 75%)

#play-button-container.playing .play-button-before
  clip-path: polygon(0 0, 70% 0, 70% 100%, 0% 100%)

#play-button-container.playing .play-button-after
  clip-path: polygon(30% 0, 100% 0, 100% 100%, 30% 100%)

#volume-slider
  max-width: 120px

#fullscreen-button svg
  fill: 4f4f51
  transition: transform 0.4s

#fullscreen-button:hover,
#fullscreen-button:active,
#fullscreen-button:focus
  transform: scale(1.1)

#info-bar
  font-size: 24px
  margin-top: 20px
  opacity: 1
  transition: opacity 0.4s

#create-message
  font-size: 24px
  margin-top: 20px
  opacity: 1
  text-decoration: underline
  transition: opacity 0.4s

.stream-live #info-bar,
.stream-live #create-message
  opacity: 0

#chat-container
  position: fixed
  right: 20px
  bottom: 20px
  height: 370px
  width: 300px
  background: white
  z-index: 9
  border-radius: 5px
  text-align: left
  -moz-box-shadow: 0px 0px 1px 7px #b9b9b9
  -webkit-box-shadow: 0px 0px 1px 7px #b9b9b9
  box-shadow: 0px 0px 1px 7px #b9b9b9

#chat-container,
#chat-container *
  padding: 0

#chat-messages
  height: 335px
  overflow-x: hidden
  overflow-y: auto
  width: 300px

#chat-messages div
  border-bottom: 1px solid lightgray
  padding: 2px 5px
  font-size: 20px

#chat-messages div span.name
  font-weight: bold

#txt-chat-message
  width: 300px
  border: 0
  border-top: 1px solid lightgray
  font-size: 20px
  padding: 2px 5px

.checkmark
  width: 18px
  vertical-align: middle
</style>

<template lang="pug">
#receiver.height-100(:class="{ 'stream-live': isPlaying }")
  .menu-bar
    .frow.row-start
      button#show-stats-bar.button-link(@click="showStats") Stats
      // <button id="show-chats" class="button-link">Past Tabs</button>
  #stats-bar.shadow-light(v-if="statsVisible")
    #hide-stats-bar(@click="hideStats")
      svg(xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24')
        path(d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z')
    #stats-bar-html
      div {{ `Video: ${stats.video.recv.codecs.length > 0 ? stats.video.recv.codecs : 'N/A'}` }}
      div {{ `Resolution: ${stats.resolutions.recv.width}x${stats.resolutions.recv.height}` }}
      div {{ `Audio: ${stats.audio.recv.codecs.length > 0 ? stats.audio.recv.codecs : 'N/A'}` }}
      div {{ `Data: ${this.bytesToSize(stats.audio.bytesReceived + stats.video.bytesReceived)}` }}
  .frow.centered-column.nowrap
    svg#loading-logo(v-if='!isPlaying' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 92 53' width='92' height='53' isolation='isolate')
      defs
        clippath
          rect(width='92' height='53')
      g(clip-path='url(#_clipPath_DBKJNQ6ncz1fVktbefDVInZnlBu8kyHj)')
        rect(width='92' height='53' fill-opacity='0' fill='rgb(185,187,189)')
        path(d='M2.6 17.5C3.2 13.8 4.2 10.8 5.8 8.8 7.2 6.7 9.4 5.1 12.1 3.9 14.8 2.8 18.6 2.2 23.4 2.2 28.4 2.2 32.3 2.8 35 3.8 37.9 4.9 40.1 6.5 41.6 8.8 43.2 11 44.1 13.4 44.1 16.3 44.1 19.1 43.2 22 41.3 24.6 39.5 27.3 36.2 30.2 31.3 33.5 28.4 35.3 26.6 36.6 25.6 37.3 24.6 38 23.4 39 22.1 40.2L45.4 40.2 45.4 1.9C49.7 2.5 53.8 3.9 57.5 6.5Q60.4 8.4 67.1 15.7C68.3 17.1 69.6 18.7 70.9 20.6 72.9 23.6 74.3 25.6 75.2 26.4 76 27.4 77 28.7 78.3 30L78.3 1.9 90.4 1.9 90.4 51.1C85.9 50.7 81.9 49.1 78 46.5 75.3 44.6 72 41.6 68.6 37.3L68.6 37.3C67.3 35.9 66.1 34.3 64.8 32.4 62.7 29.4 58.5 24.4 57.3 23L57.3 51.1 1.6 51.1C2.1 47.2 3.6 43.5 6.1 39.9 8.5 36.5 13.3 32.3 20.1 27.6 24.3 24.7 27 22.4 28.2 21 29.3 19.4 29.9 18 29.9 16.7 29.9 15.2 29.3 14 28.2 13 27 11.8 25.6 11.4 23.7 11.4 22 11.4 20.4 12 19.3 13 18.1 14.1 17.6 14.8 17.1 17.5L2.6 17.5Z' fill='none' vector-effect='non-scaling-stroke' stroke-linejoin='miter' stroke-linecap='butt' stroke-miterlimit='4')
    svg#logo(v-if='isPlaying' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 61.9 34.3' width='61.9' height='34.3' isolation='isolate')
      defs
        clippath
          rect(width='61.9' height='34.3')
      g(clip-path='url(#_clipPath_tcUaJZ4siK7ZJPj4ATDJEfxLNlNwtkyj)')
        path(d='M30.5 26.7L30.5 0C33.5 0.4 36.4 1.4 39 3.2 41 4.5 43.2 6.7 45.7 9.7L45.7 9.6C46.5 10.6 47.4 11.7 48.3 13 49.7 15.1 50.7 16.5 51.3 17.1 51.9 17.8 52.6 18.7 53.5 19.6L53.5 0 61.9 0 61.9 34.3C58.8 34 56 32.9 53.3 31.1 51.4 29.8 49.1 27.7 46.7 24.7L46.7 24.7C45.8 23.7 45 22.6 44.1 21.3 42.6 19.2 41.6 17.9 41.1 17.2 40.5 16.5 39.7 15.7 38.8 14.7L38.8 34.3 30.5 34.3 30.5 34.3 0 34.3C0.3 31.6 1.4 29 3.1 26.5 4.8 24.1 8.1 21.2 12.9 17.9 15.8 15.9 17.7 14.3 18.5 13.3 19.3 12.2 19.7 11.2 19.7 10.3 19.7 9.3 19.3 8.4 18.5 7.7 17.7 6.9 16.7 6.6 15.4 6.6 14.2 6.6 13.1 7 12.3 7.7 11.5 8.5 11.1 9 10.8 10.9L0.7 10.9C1.1 8.3 1.8 6.2 2.9 4.8 3.9 3.3 5.4 2.2 7.3 1.4 9.2 0.6 11.8 0.2 15.2 0.2 18.7 0.2 21.4 0.6 23.3 1.3 25.3 2.1 26.8 3.2 27.9 4.8 29 6.3 29.6 8 29.6 10 29.6 12 29 14 27.7 15.8 26.4 17.7 24.1 19.7 20.7 22 18.7 23.3 17.4 24.2 16.7 24.7 16 25.2 15.2 25.9 14.3 26.7L30.5 26.7Z' fill-rule='evenodd')
    #tab-title.mt-30.mb-20(onclick="document.execCommand('copy')")
    video.shadow-light(ref='videoPlayer' playsinline='' @click='togglePlayback')
      | Your browser does not support the video element.
    audio(ref='audioPlayer')
      | Your browser does not support the audio element.
    #media-controls.frow.nowrap(:class="{ 'justify-between': isVideo }")
      .frow.nowrap
        button#play-button-container.frow.nowrap.button-none(type='button' :class='{ playing: isPlaying }' @click='togglePlayback' :disabled='!isPlaying || (isPlaying && isVideo)')
          .play-button.play-button-before
          .play-button.play-button-after
        input#volume-slider(type='range' v-if='isPlaying' min='0' max='1' value='0.5' step='0.01' @change='setVolume')
      button#fullscreen-button.button-none(type='button' v-if='isVideo' @click='fullscreenVideo')
        svg(xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24')
          path(d='M24 9h-2v-4h-4v-2h6v6zm-6 12v-2h4v-4h2v6h-6zm-18-6h2v4h4v2h-6v-6zm6-12v2h-4v4h-2v-6h6z')
    #info-bar {{ infoBarMessage }}
    router-link#create-message(v-if="!isPlaying", to='/streamer') Create your own room
  #chat-container(hidden)
    #chat-messages
    input#txt-chat-message(type='text' placeholder='Enter Chat Message' hidden)

</template>

<script>
import io from "socket.io-client";
// TODO: Remove need to do this
window.io = io;
import adapter from "webrtc-adapter";
import RTCMultiConnection from "rtcmulticonnection";

// import * as globals from "@/utils/background/globals.js";
import { setDefaults } from "@/utils/background/setDefaults.js";
import { captureDesktop } from "@/utils/background/captureDesktop.js";

import { CodecsHandler } from "@/utils/background/helpers/CodecsHandler.js";
import { IceServersHandler } from "@/utils/background/helpers/IceServersHandler.js";
import { getStats } from "@/utils/background/helpers/getStats.js";

export default {
  name: "Receiver",
  data() {
    return {
      roomName: this.$route.params.room,
      stream: {},
      isPlaying: false,
      isVideo: false,
      isAudio: false,
      connection: null,
      params: {},
      statsVisible: false,
      NO_MORE: false,
      stats: {},
      infoBarMessage: '',
      presenceCheckWait: 1000,
    };
  },
  computed: {
  },
  methods: {
    togglePlayback() {
      if (this.stream.isVideo) {
        this.$refs.videoPlayer.paused
          ? this.$refs.videoPlayer.play()
          : this.$refs.videoPlayer.pause();
      } else {
        this.$refs.audioPlayer.paused
          ? this.$refs.audioPlayer.play()
          : this.$refs.audioPlayer.pause();
      }
    },
    setVolume(input) {
      this.$refs.audioPlayer.volume = input;
      this.$refs.videoPlayer.volume = input;
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
    checkPresence() {
      this.connection.checkPresence(
        this.roomName,
        (isRoomExist, roomid, extra) => {
          if (isRoomExist === false) {
            this.infoBarMessage = `Waiting for someone to host the room: ${this.roomName}`;

            setTimeout(() => {
              this.presenceCheckWait < 60000 &&
                (this.presenceCheckWait = this.presenceCheckWait * 2);
              setTimeout(this.checkPresence, this.presenceCheckWait);
            }, this.presenceCheckWait);
            return;
          }

          this.infoBarMessage = `Joining room: ${this.roomName}`;

          this.connection.password = null;
          if (this.params.p) {
            this.connection.password = this.params.p;
          }

          this.connection.join(this.roomName);
        }
      );
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
      // TODO: Should this by 1024?
      var k = 1000;
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes === 0) {
        return "0 Bytes";
      }
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
      return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    },
    onGettingWebRCStats(stats, userid) {
      if (!this.connection.peers[userid] || this.NO_MORE) {
        stats.nomore();
        return;
      }
      this.stats = stats;
      // var html = "Video: " + stats.video.recv.codecs;
      // html += "<br>";
      // html +=
      //   "Resolution: " +
      //   stats.resolutions.recv.width +
      //   "x" +
      //   stats.resolutions.recv.height;
      // html += "<br>";
      // html += "Audio: " + stats.audio.recv.codecs;
      // html += "<br>";
      // html +=
      //   "Data: " +
      //   bytesToSize(stats.audio.bytesReceived + stats.video.bytesReceived);
      // // html += '<br>';
      // // html += 'Speed: ' + bytesToSize(stats.bandwidth.speed || 0);
      // statsBarHTML.innerHTML = html;
    },
  },
  mounted() {
    let r;
    let DEFAULTS;
    let tempParams;
    (tempParams = {}),
      (r = /([^&=]+)=?([^&]*)/g),
      (DEFAULTS = { bandwidth: 8192 });

    function d(s) {
      return decodeURIComponent(s.replace(/\+/g, " "));
    }

    var match,
      search = window.location.search;
    while ((match = r.exec(search.substring(1))))
      tempParams[d(match[1])] = d(match[2]);

    this.params = Object.assign({}, DEFAULTS, tempParams);

    // http://www.rtcmulticonnection.org/docs/constructor/
    this.connection = new RTCMultiConnection(this.roomName);
    this.connection.socketURL = "https://api.2n.fm:9001/";
    this.connection.autoCloseEntireSession = true;

    // this must match the extension page
    this.connection.socketMessageEvent = "desktopCapture";

    this.connection.enableLogs = true;
    this.connection.session = {
      audio: true,
      video: true,
      data: true,
      oneway: true
    };

    // www.rtcmulticonnection.org/docs/sdpConstraints/
    this.connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    };

    this.connection.getExternalIceServers = false;
    this.connection.iceServers = IceServersHandler.getIceServers();

    function setBandwidth(sdp) {
      sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, "");
      sdp = sdp.replace(/a=mid:video\r\n/g, "a=mid:video\r\nb=AS:10000\r\n");
      return sdp;
    }

    this.connection.processSdp = sdp => {
      var bandwidth = this.params.bandwidth;
      var codecs = this.params.codecs;

      if (bandwidth) {
        try {
          bandwidth = parseInt(bandwidth);
        } catch (e) {
          bandwidth = null;
        }

        if (
          bandwidth &&
          bandwidth != NaN &&
          bandwidth != "NaN" &&
          typeof bandwidth == "number"
        ) {
          sdp = setBandwidth(sdp, bandwidth);
          sdp = BandwidthHandler.setVideoBitrates(sdp, {
            min: bandwidth,
            max: bandwidth
          });
        }
      }

      if (!!codecs && codecs !== "default") {
        sdp = CodecsHandler.preferCodec(sdp, codecs);
      }
      return sdp;
    };

    this.connection.optionalArgument = {
      optional: [],
      mandatory: {}
    };

    this.connection.onstatechange = state => {
      this.infoBarMessage = `${state.name}: ${state.reason}`;
      if (state.name == "request-rejected" && this.params.p) {
        this.infoBarMessage = 'Incorrect password';
      }

      if (state.name === "room-not-available") {
        this.infoBarMessage = 
          "Screen share session is closed or paused. You will join automatically when share session is resumed.";
      }
    };

    this.connection.onstreamid = event => {
      this.infoBarMessage = "Remote peer is about to send his screen.";
    };

    this.connection.onstream = e => {
      this.$refs.videoPlayer.srcObject = null;
      this.$refs.audioPlayer.srcObject = null;
      this.stream = e.stream;
      this.stream.mute();
      if (this.stream.isVideo) {
        this.isVideo = true;
        this.$refs.videoPlayer.srcObject = this.stream;
        this.$refs.videoPlayer.srcObject.getVideoTracks()[0].enabled = true;
        if (this.$refs.videoPlayer.srcObject.getAudioTracks().length) {
          this.$refs.videoPlayer.srcObject.getAudioTracks()[0].enabled = true;
        }
        this.$refs.videoPlayer.volume = 0.5;
        this.$refs.videoPlayer.play();
      } else {
        this.isAudio = true;
        this.$refs.audioPlayer.srcObject = this.stream;
        this.$refs.audioPlayer.srcObject.getAudioTracks()[0].enabled = true;
        this.$refs.audioPlayer.volume = 0.5;
        this.$refs.audioPlayer.play();
        playButton.disabled = false;
      }
    };

    // if user left
    this.connection.onleave = this.connection.onstreamended = this.connection.onSessionClosed = e => {
      if (e.userid !== this.roomName) return;

      this.$refs.videoPlayer.srcObject = null;

      this.infoBarMessage = "Screen sharing has been closed.";
      this.hideStats();
      this.connection.close();
      this.connection.closeSocket();
      this.connection.userid = this.connection.token();

      location.reload();
    };

    this.connection.onJoinWithPassword = remoteUserId => {
      if (!this.params.p) {
        this.params.p = prompt(
          remoteUserId + " is password protected. Please enter the pasword:"
        );
      }

      this.connection.password = this.params.p;
      this.connection.join(remoteUserId);
    };

    this.connection.onInvalidPassword = (remoteUserId, oldPassword) => {
      var password = prompt(
        remoteUserId +
          " is password protected. Your entered wrong password (" +
          oldPassword +
          "). Please enter valid pasword:"
      );
      this.connection.password = password;
      this.connection.join(remoteUserId);
    };

    this.connection.onPasswordMaxTriesOver = remoteUserId => {
      alert(
        remoteUserId +
          " is password protected. Your max password tries exceeded the limit."
      );
    };

    this.connection.onSocketDisconnect = event => {
      // alert('Connection to the server is closed.');
      if (this.connection.getAllParticipants().length > 0) return;
      location.reload();
    };

    this.connection.onSocketError = event => {
      alert("Unable to connect to the server. Please try again.");

      setTimeout(() => {
        location.reload();
      }, 1000);
    };

    this.connection.onopen = event => {
      //
    };

    // Start chat feature
    // var chatContainer = document.getElementById("chat-container");
    // var lastMessage = "";
    // this.connection.onmessage = (event) => {
    //   if (event.data.openChat === true) {
    //     chatContainer.removeAttribute("hidden");
    //   }

    //   if (event.data.closeChat === true) {
    //     chatContainer.setAttribute("hidden", "");
    //   }

    //   if (event.data.newChatMessage && event.data.newChatMessage != lastMessage) {
    //     lastMessage = event.data.newChatMessage;

    //     // there is a possibility that broadcaster did not send "openChat:true" signal
    //     // chatContainer.removeAttribute('hidden');

    //     appendChatMessage("Broadcaster", event.data.newChatMessage);
    //     updateTitle(event.data.newChatMessage);
    //     this.connection.send({
    //       receivedChatMessage: true,
    //       checkmark_id: event.data.checkmark_id
    //     });
    //   }

    //   if (event.data.receivedChatMessage) {
    //     if (document.getElementById(event.data.checkmark_id)) {
    //       document.getElementById(event.data.checkmark_id).style.display = "";
    //     }
    //   }
    // };

    // var txtChatMessage = document.getElementById("txt-chat-message");
    // var chatMessages = document.getElementById("chat-messages");

    // txtChatMessage.onkeyup = (e) => {
    //   if (e.keyCode === 13) {
    //     var checkmark_id = (Math.random() * 100).toString().replace(".", "");
    //     appendChatMessage("You", this.value, checkmark_id);
    //     this.connection.send({
    //       newChatMessage: this.value
    //     });
    //     this.value = "";
    //   }
    // };

    // function appendChatMessage(name, message, checkmark_id) {
    //   var div = document.createElement("div");
    //   if (checkmark_id) {
    //     div.innerHTML =
    //       '<p><span class="name">' +
    //       name +
    //       ': <img class="checkmark" id="' +
    //       checkmark_id +
    //       '" title="Received" src="images/checkmark.png"></span></p><p>' +
    //       message +
    //       "</p>";
    //   } else {
    //     div.innerHTML =
    //       '<p><span class="name">' + name + ":</span></p><p>" + message + "</p>";
    //   }
    //   chatMessages.appendChild(div);

    //   chatMessages.scrollTop = chatMessages.clientHeight;
    //   chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.scrollTop;
    // }

    // var tabTitle = document.getElementById("tab-title");
    // function updateTitle(message) {
    //   tabTitle.innerHTML = message;
    // }
    // End chat feature

    this.connection.socketCustomEvent = this.roomName;

    if (this.roomName) {
      this.checkPresence();
    }

    var dontDuplicate = {};
    this.connection.onPeerStateChanged = event => {
      if (!this.connection.getRemoteStreams(this.roomName).length) {
        if (event.signalingState === "have-remote-offer") {
          this.infoBarMessage = `Received WebRTC offer from: ${this.roomName}`;
        } else if (
          event.iceGatheringState === "complete" &&
          event.iceConnectionState === "connected"
        ) {
          this.infoBarMessage = `WebRTC handshake is completed. Waiting for remote video from: ${this.roomName}`;
        }
      }

      if (
        event.iceConnectionState === "connected" &&
        event.signalingState === "stable"
      ) {
        if (dontDuplicate[event.userid]) return;
        dontDuplicate[event.userid] = true;

        var peer = this.connection.peers[event.userid].peer;

        getStats(
          peer,
          stats => {
            this.onGettingWebRCStats(stats, event.userid);
          },
          1000
        );
      }
    };

    // document.getElementById("show-chats").onclick = () => {
    //   chatContainer.toggleAttribute("hidden");
    //   chatMessages.scrollTo(0, chatMessages.scrollHeight);
    // };

    window.addEventListener(
      "offline",
      () => {
        this.infoBarMessage = 'You seem to be offline.';
      },
      false
    );

    window.addEventListener(
      "online",
      () => {
        this.infoBarMessage = 'You are back online. Reloading the page...';
        location.reload();
      },
      false
    );
  }
};
</script>
