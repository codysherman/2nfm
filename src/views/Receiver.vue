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

#media-controls
  width: 60%
  animation: fade-in 0.4s

#play-button-container
  width: 30px
  height: 30px
  margin-right: 20px

  svg
    width: 30px
    height: 30px
    fill: $primary-color

#volume-slider
  max-width: 120px

#fullscreen-button
  svg
    width: 30px
    fill: $primary-color
    transition: transform 0.4s

  &:hover,
  &:active,
  &:focus
    transform: scale(1.1)

#info-bar
  font-size: 24px
  margin-top: 20px
  text-align: center
  transition: fade-in 0.4s

#create-message
  font-size: 24px
  margin-top: 20px
  text-decoration: underline
  transition: fade-in 0.4s

// #chat-container
//   position: fixed
//   right: 20px
//   bottom: 20px
//   height: 370px
//   width: 300px
//   background: white
//   z-index: 9
//   border-radius: 5px
//   text-align: left
//   box-shadow: 0px 0px 1px 7px #b9b9b9

// #chat-container,
// #chat-container *
//   padding: 0

// #chat-messages
//   height: 335px
//   overflow-x: hidden
//   overflow-y: auto
//   width: 300px

// #chat-messages div
//   border-bottom: 1px solid lightgray
//   padding: 2px 5px
//   font-size: 20px

// #chat-messages div span.name
//   font-weight: bold

// #txt-chat-message
//   width: 300px
//   border: 0
//   border-top: 1px solid lightgray
//   font-size: 20px
//   padding: 2px 5px

// .checkmark
//   width: 18px
//   vertical-align: middle
</style>

<template lang="pug">
#receiver.height-100
  .menu-bar
    .frow.row-start
      button#show-stats-bar.button-link(v-if="isStream" @click="showStats") Stats
      // <button id="show-chats" class="button-link">Past Tabs</button>
  #stats-bar.shadow-light(v-if="statsVisible")
    #hide-stats-bar(@click="hideStats")
      XSvg
    #stats-bar-html
      div(v-if="stats.video.recv.codecs.length > 0") {{ `Video: ${stats.video.recv.codecs}` }}
      div(v-if="stats.video.recv.codecs.length > 0") {{ `Resolution: ${stats.resolutions.recv.width}x${stats.resolutions.recv.height}` }}
      div(v-if="stats.audio.recv.codecs.length > 0") {{ `Audio: ${stats.audio.recv.codecs}` }}
      div {{ `Data: ${this.bytesToSize(stats.audio.bytesReceived + stats.video.bytesReceived)}` }}
  .frow.centered-column.nowrap
    LoadingSvg#loading-logo(v-if="!isStream")
    LogoSvg#logo(v-if="isStream")
    #tab-title.mt-30.mb-20(onclick="document.execCommand('copy')")
    video.shadow-light(ref='videoPlayer' @click='togglePlayback' playsinline :hidden="!stream.isVideo")
      | Your browser does not support the video element.
    audio(ref='audioPlayer' :hidden="!stream.isAudio")
      | Your browser does not support the audio element.
    #media-controls.frow.nowrap(v-if="isStream" :class="{ 'justify-between': stream.isVideo }")
      .frow.nowrap
        button#play-button-container.frow.nowrap.button-none(
          type="button"
          v-if="(stream.isAudio) || (stream.isVideo && !isPlaying)"
          @click="togglePlayback"
        )
          PlaySvg(v-if="!isPlaying")
          PauseSvg(v-else)
        input#volume-slider(type="range" min="0" max="100" value="50" step="1" @change="setVolume")
      button#fullscreen-button.button-none(type="button" v-if="stream.isVideo" @click="fullscreenVideo")
        FullscreenSvg
    #info-bar(v-if="!isStream") {{ infoBarMessage }}
    router-link#create-message(v-if="!isStream", to="/streamer") Create your own room
  #chat-container(hidden)
    #chat-messages
    input#txt-chat-message(type="text" placeholder="Enter Chat Message" hidden)

</template>

<script>
import XSvg from "@/assets/svgs/x.svg";
import LoadingSvg from "@/assets/svgs/loading.svg";
import LogoSvg from "@/assets/svgs/logo.svg";
import PlaySvg from "@/assets/svgs/play.svg";
import PauseSvg from "@/assets/svgs/pause.svg";
import FullscreenSvg from "@/assets/svgs/fullscreen.svg";

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
  components: {
    XSvg,
    LoadingSvg,
    LogoSvg,
    PlaySvg,
    PauseSvg,
    FullscreenSvg
  },
  data() {
    return {
      roomName: this.$route.params.room,
      stream: {},
      isStream: false,
      isPlaying: false,
      connection: null,
      params: {},
      statsVisible: false,
      NO_MORE: false,
      stats: {},
      infoBarMessage: "",
      presenceCheckWait: 3750
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
    }
  },
  methods: {
    async playMedia() {
      try {
        await this.player.play();
        this.isPlaying = true;
      } catch (err) {
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
      this.$refs.audioPlayer.volume = event.srcElement.valueAsNumber / 100;
      this.$refs.videoPlayer.volume = event.srcElement.valueAsNumber / 100;
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
            if (this.presenceCheckWait < 60000) {
              this.presenceCheckWait = this.presenceCheckWait * 2;
            }
            this.infoBarMessage = `Room: ${this.roomName} isn't hosted yet.
              Checking again ${
                this.presenceCheckWait === 60000 ? "every" : "in"
              }
              ${this.presenceCheckWait / 1000} seconds.`;

            setTimeout(this.checkPresence, this.presenceCheckWait);
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
    }
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
        this.infoBarMessage = "Incorrect password";
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
        this.$refs.videoPlayer.srcObject = this.stream;
        this.$refs.videoPlayer.srcObject.getVideoTracks()[0].enabled = true;
        if (this.$refs.videoPlayer.srcObject.getAudioTracks().length) {
          this.$refs.videoPlayer.srcObject.getAudioTracks()[0].enabled = true;
        }
        this.$refs.videoPlayer.volume = 0.5;
      } else {
        this.$refs.audioPlayer.srcObject = this.stream;
        this.$refs.audioPlayer.srcObject.getAudioTracks()[0].enabled = true;
        this.$refs.audioPlayer.volume = 0.5;
      }
      this.isStream = true;
      this.playMedia();
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
        this.infoBarMessage = "You seem to be offline.";
      },
      false
    );

    window.addEventListener(
      "online",
      () => {
        this.infoBarMessage = "You are back online. Reloading the page...";
        location.reload();
      },
      false
    );
  }
};
</script>
