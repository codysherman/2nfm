<style scoped lang="scss">
body {
  text-align: center;
}

.menu-bar {
  position: fixed;
  left: 10px;
  top: 5px;
}

.menu-bar button {
  color: gray;
  margin-right: 10px;
}

#stats-bar {
  background-color: rgba(255, 255, 255, 0.92);
  top: 35px;
  left: 20px;
  position: absolute;
  text-align: left;
  padding: 10px;
}

#stats-bar-html {
  padding: 5px 10px;
}

#hide-stats-bar {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}

#hide-stats-bar svg {
  width: 10px;
  height: 10px;
}

#loading-logo {
  height: 53px;
  width: auto;
}

@keyframes dash {
  90% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

#loading-logo path {
  stroke: #bebebe;
  stroke-width: 1.5;
  stroke-dasharray: 495;
  stroke-dashoffset: 990;
  animation: dash 15s ease-in-out 1.5s infinite;
}

@keyframes fade-in {
  0% {
    opacity: 0.1;
  }
  100% {
    opactity: 1;
  }
}

#logo {
  height: 50px;
  width: auto;
  fill: #4f4f51;
  animation: fade-in 2s ease-out;
}

video {
  width: 60%;
  height: auto;
  object-fit: contain;
  margin-bottom: 20px;
  background-color: #eaeaea;
}

#media-controls {
  width: 60%;
  opacity: 0;
  transition: opacity 0.4s;
}

.stream-live #media-controls {
  opacity: 1;
}

#play-button-container {
  width: 30px;
  height: 30px;
  margin-right: 20px;
}

#play-button-container:disabled {
  display: none;
}

.play-button {
  width: 15px;
  height: 30px;
  background: #4f4f51;
  transition: clip-path 0.3s ease;
}

.play-button-before {
  clip-path: polygon(0 0, 100% 25%, 100% 75%, 0% 100%);
}

.play-button-after {
  clip-path: polygon(0% 25%, 100% 50%, 100% 50%, 0% 75%);
}

#play-button-container.playing .play-button-before {
  clip-path: polygon(0 0, 70% 0, 70% 100%, 0% 100%);
}

#play-button-container.playing .play-button-after {
  clip-path: polygon(30% 0, 100% 0, 100% 100%, 30% 100%);
}

#volume-slider {
  max-width: 120px;
}

#fullscreen-button svg {
  fill: 4f4f51;
  transition: transform 0.4s;
}

#fullscreen-button:hover,
#fullscreen-button:active,
#fullscreen-button:focus {
  transform: scale(1.1);
}

#info-bar {
  font-size: 24px;
  margin-top: 20px;
  opacity: 1;
  transition: opacity 0.4s;
}

.stream-live #info-bar {
  opacity: 0;
}

#chat-container {
  position: fixed;
  right: 20px;
  bottom: 20px;
  height: 370px;
  width: 300px;
  background: white;
  z-index: 9;
  border-radius: 5px;
  text-align: left;
  -moz-box-shadow: 0px 0px 1px 7px #b9b9b9;
  -webkit-box-shadow: 0px 0px 1px 7px #b9b9b9;
  box-shadow: 0px 0px 1px 7px #b9b9b9;
}

#chat-container,
#chat-container * {
  padding: 0;
}

#chat-messages {
  height: 335px;
  overflow-x: hidden;
  overflow-y: auto;
  width: 300px;
}

#chat-messages div {
  border-bottom: 1px solid lightgray;
  padding: 2px 5px;
  font-size: 20px;
}

#chat-messages div span.name {
  font-weight: bold;
}

#txt-chat-message {
  width: 300px;
  border: 0;
  border-top: 1px solid lightgray;
  font-size: 20px;
  padding: 2px 5px;
}

.checkmark {
  width: 18px;
  vertical-align: middle;
}
</style>

<template>
  <div>
    <div class="menu-bar">
      <div class="frow row-start">
        <button id="show-stats-bar" class="button-link">Stats</button>
        <!-- <button id="show-chats" class="button-link">Past Tabs</button> -->
      </div>
    </div>

    <div id="stats-bar" class="shadow-light" hidden>
      <div id="hide-stats-bar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
          />
        </svg>
      </div>
      <div id="stats-bar-html"></div>
    </div>

    <div class="frow centered-column nowrap">
      <svg
        id="loading-logo"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 92 53"
        width="92"
        height="53"
        isolation="isolate"
      >
        <defs>
          <clipPath>
            <rect width="92" height="53" />
          </clipPath>
        </defs>
        <g clip-path="url(#_clipPath_DBKJNQ6ncz1fVktbefDVInZnlBu8kyHj)">
          <rect
            width="92"
            height="53"
            fill-opacity="0"
            fill="rgb(185,187,189)"
          />
          <path
            d="M2.6 17.5C3.2 13.8 4.2 10.8 5.8 8.8 7.2 6.7 9.4 5.1 12.1 3.9 14.8 2.8 18.6 2.2 23.4 2.2 28.4 2.2 32.3 2.8 35 3.8 37.9 4.9 40.1 6.5 41.6 8.8 43.2 11 44.1 13.4 44.1 16.3 44.1 19.1 43.2 22 41.3 24.6 39.5 27.3 36.2 30.2 31.3 33.5 28.4 35.3 26.6 36.6 25.6 37.3 24.6 38 23.4 39 22.1 40.2L45.4 40.2 45.4 1.9C49.7 2.5 53.8 3.9 57.5 6.5Q60.4 8.4 67.1 15.7C68.3 17.1 69.6 18.7 70.9 20.6 72.9 23.6 74.3 25.6 75.2 26.4 76 27.4 77 28.7 78.3 30L78.3 1.9 90.4 1.9 90.4 51.1C85.9 50.7 81.9 49.1 78 46.5 75.3 44.6 72 41.6 68.6 37.3L68.6 37.3C67.3 35.9 66.1 34.3 64.8 32.4 62.7 29.4 58.5 24.4 57.3 23L57.3 51.1 1.6 51.1C2.1 47.2 3.6 43.5 6.1 39.9 8.5 36.5 13.3 32.3 20.1 27.6 24.3 24.7 27 22.4 28.2 21 29.3 19.4 29.9 18 29.9 16.7 29.9 15.2 29.3 14 28.2 13 27 11.8 25.6 11.4 23.7 11.4 22 11.4 20.4 12 19.3 13 18.1 14.1 17.6 14.8 17.1 17.5L2.6 17.5Z"
            fill="none"
            vector-effect="non-scaling-stroke"
            stroke-linejoin="miter"
            stroke-linecap="butt"
            stroke-miterlimit="4"
          />
        </g>
      </svg>
      <svg
        id="logo"
        hidden
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 61.9 34.3"
        width="61.9"
        height="34.3"
        isolation="isolate"
      >
        <defs>
          <clipPath>
            <rect width="61.9" height="34.3" />
          </clipPath>
        </defs>
        <g clip-path="url(#_clipPath_tcUaJZ4siK7ZJPj4ATDJEfxLNlNwtkyj)">
          <path
            d="M30.5 26.7L30.5 0C33.5 0.4 36.4 1.4 39 3.2 41 4.5 43.2 6.7 45.7 9.7L45.7 9.6C46.5 10.6 47.4 11.7 48.3 13 49.7 15.1 50.7 16.5 51.3 17.1 51.9 17.8 52.6 18.7 53.5 19.6L53.5 0 61.9 0 61.9 34.3C58.8 34 56 32.9 53.3 31.1 51.4 29.8 49.1 27.7 46.7 24.7L46.7 24.7C45.8 23.7 45 22.6 44.1 21.3 42.6 19.2 41.6 17.9 41.1 17.2 40.5 16.5 39.7 15.7 38.8 14.7L38.8 34.3 30.5 34.3 30.5 34.3 0 34.3C0.3 31.6 1.4 29 3.1 26.5 4.8 24.1 8.1 21.2 12.9 17.9 15.8 15.9 17.7 14.3 18.5 13.3 19.3 12.2 19.7 11.2 19.7 10.3 19.7 9.3 19.3 8.4 18.5 7.7 17.7 6.9 16.7 6.6 15.4 6.6 14.2 6.6 13.1 7 12.3 7.7 11.5 8.5 11.1 9 10.8 10.9L0.7 10.9C1.1 8.3 1.8 6.2 2.9 4.8 3.9 3.3 5.4 2.2 7.3 1.4 9.2 0.6 11.8 0.2 15.2 0.2 18.7 0.2 21.4 0.6 23.3 1.3 25.3 2.1 26.8 3.2 27.9 4.8 29 6.3 29.6 8 29.6 10 29.6 12 29 14 27.7 15.8 26.4 17.7 24.1 19.7 20.7 22 18.7 23.3 17.4 24.2 16.7 24.7 16 25.2 15.2 25.9 14.3 26.7L30.5 26.7Z"
            fill-rule="evenodd"
          />
        </g>
      </svg>

      <div
        id="tab-title"
        class="mt-30 mb-20"
        onclick="document.execCommand('copy')"
      >
        &nbsp;
      </div>

      <video
        id="video"
        class="shadow-light"
        playsinline
        onclick="togglePlayback()"
        hidden
      >
        Your browser does not support the video element.
      </video>
      <audio id="audio" hidden>
        Your browser does not support the audio element.
      </audio>

      <div id="media-controls" class="frow nowrap">
        <div class="frow nowrap">
          <button
            type="button"
            id="play-button-container"
            class="frow nowrap button-none"
            onclick="togglePlayback()"
            disabled
          >
            <div class="play-button play-button-before"></div>
            <div class="play-button play-button-after"></div>
          </button>
          <input
            type="range"
            id="volume-slider"
            min="0"
            max="1"
            value="0.5"
            step="0.01"
            oninput="setVolume(this.value)"
            disabled
          />
        </div>
        <button
          type="button"
          id="fullscreen-button"
          class="button-none"
          hidden
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M24 9h-2v-4h-4v-2h6v6zm-6 12v-2h4v-4h2v6h-6zm-18-6h2v4h4v2h-6v-6zm6-12v2h-4v4h-2v-6h6z"
            />
          </svg>
        </button>
      </div>

      <div id="info-bar">&nbsp;</div>
      <a id="create-message" href="/streamer">Create your own room</a>
    </div>

    <div id="chat-container" hidden>
      <div id="chat-messages"></div>
      <input
        type="text"
        id="txt-chat-message"
        placeholder="Enter Chat Message"
        hidden
      />
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import adapter from "@/utils/background/helpers/adapter.js";
import RTCMultiConnection from "@/utils/background/helpers/RTCMultiConnection.js";

import { CodecsHandler } from "@/utils/background/helpers/CodecsHandler.js";
import { IceServersHandler } from "@/utils/background/helpers/IceServersHandler.js";
import { getStats } from "@/utils/background/helpers/getStats.js";

// NOTE: SM: since this file is the receiver, and not the receiver, only background/helpers should
// be necessary (during migration from no-vuejs), nothing from background/* itself needed
//
// TODO: switch from document.* DOM manipulation to Vue; possibly broken
export default {
  name: "Receiver",
  mounted() {
    (function() {
      var params = {},
        r = /([^&=]+)=?([^&]*)/g,
        DEFAULTS = { s: "2nfm", bandwidth: 8192 };

      function d(s) {
        return decodeURIComponent(s.replace(/\+/g, " "));
      }

      var match,
        search = window.location.search;
      while ((match = r.exec(search.substring(1))))
        params[d(match[1])] = d(match[2]);

      window.params = Object.assign({}, DEFAULTS, params);
    })();

    var infoBar = document.getElementById("info-bar");
    var body = document.getElementsByTagName("BODY")[0];

    // http://www.rtcmulticonnection.org/docs/constructor/
    var connection = new RTCMultiConnection(params.s);
    connection.socketURL = "https://api.2n.fm:9001/";
    connection.autoCloseEntireSession = true;

    // this must match the extension page
    connection.socketMessageEvent = "desktopCapture";

    connection.enableLogs = true;
    connection.session = {
      audio: true,
      video: true,
      data: true,
      oneway: true
    };

    // www.rtcmulticonnection.org/docs/sdpConstraints/
    connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    };

    connection.getExternalIceServers = false;
    connection.iceServers = IceServersHandler.getIceServers();

    function setBandwidth(sdp) {
      sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, "");
      sdp = sdp.replace(/a=mid:video\r\n/g, "a=mid:video\r\nb=AS:10000\r\n");
      return sdp;
    }

    connection.processSdp = function(sdp) {
      var bandwidth = params.bandwidth;
      var codecs = params.codecs;

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

    connection.optionalArgument = {
      optional: [],
      mandatory: {}
    };

    connection.onstatechange = function(state) {
      infoBar.innerHTML = state.name + ": " + state.reason;

      if (state.name == "request-rejected" && params.p) {
        infoBar.innerHTML =
          "Password (" +
          params.p +
          ") did not match with broadcaster, that is why your participation request has been rejected.<br>Please contact him and ask for valid password.";
      }

      if (state.name === "room-not-available") {
        infoBar.innerHTML =
          "Screen share session is closed or paused. You will join automatically when share session is resumed.";
      }
    };

    connection.onstreamid = function(event) {
      infoBar.innerHTML = "Remote peer is about to send his screen.";
    };

    var mediaControls = document.getElementById("media-controls");
    var playButton = document.getElementById("play-button-container");
    var volumeSlider = document.getElementById("volume-slider");
    var fullscreenButton = document.getElementById("fullscreen-button");

    var video = document.getElementById("video");
    var audio = document.getElementById("audio");

    video.onplay = event => {
      playButton.classList.add("playing");
    };

    video.onpause = event => {
      playButton.classList.remove("playing");
    };

    audio.onplay = event => {
      playButton.classList.add("playing");
    };

    audio.onpause = event => {
      playButton.classList.remove("playing");
    };

    var loadingLogo = document.getElementById("loading-logo");
    var logo = document.getElementById("logo");

    var stream = null;
    connection.onstream = function(e) {
      loadingLogo.setAttribute("hidden", "");
      logo.removeAttribute("hidden");
      video.srcObject = null;
      audio.srcObject = null;
      stream = e.stream;
      stream.mute();
      if (stream.isVideo) {
        video.removeAttribute("hidden");
        video.srcObject = stream;
        video.srcObject.getVideoTracks()[0].enabled = true;
        if (video.srcObject.getAudioTracks.length) {
          video.srcObject.getAudioTracks()[0].enabled = true;
        }
        video.volume = 0.5;
        video.play();
        fullscreenButton.removeAttribute("hidden");
        mediaControls.classList.add("justify-between");
      } else {
        audio.removeAttribute("hidden");
        audio.srcObject = stream;
        audio.srcObject.getAudioTracks()[0].enabled = true;
        audio.volume = 0.5;
        audio.play();
        playButton.removeAttribute("disabled");
      }
      volumeSlider.removeAttribute("disabled");
      body.classList.add("stream-live");
    };

    togglePlayback = function() {
      if (stream.isVideo) {
        video.paused ? video.play() : video.pause();
      } else {
        audio.paused ? audio.play() : audio.pause();
      }
    };

    setVolume = function(input) {
      audio.volume = input;
      video.volume = input;
    };

    fullscreenButton.addEventListener("click", function(e) {
      if (video.requestFullscreen) video.requestFullscreen();
      else if (video.mozRequestFullScreen) video.mozRequestFullScreen();
      else if (video.webkitRequestFullScreen) video.webkitRequestFullScreen();
      else if (video.msRequestFullscreen) video.msRequestFullscreen();
    });

    // if user left
    connection.onleave = connection.onstreamended = connection.onSessionClosed = function(
      e
    ) {
      if (e.userid !== params.s) return;

      video.srcObject = null;

      infoBar.innerHTML = "Screen sharing has been closed.";
      body.classList.remove("stream-live");
      statsBar.setAttribute("hidden", "");
      connection.close();
      connection.closeSocket();
      connection.userid = connection.token();

      location.reload();
    };

    connection.onJoinWithPassword = function(remoteUserId) {
      if (!params.p) {
        params.p = prompt(
          remoteUserId + " is password protected. Please enter the pasword:"
        );
      }

      connection.password = params.p;
      connection.join(remoteUserId);
    };

    connection.onInvalidPassword = function(remoteUserId, oldPassword) {
      var password = prompt(
        remoteUserId +
          " is password protected. Your entered wrong password (" +
          oldPassword +
          "). Please enter valid pasword:"
      );
      connection.password = password;
      connection.join(remoteUserId);
    };

    connection.onPasswordMaxTriesOver = function(remoteUserId) {
      alert(
        remoteUserId +
          " is password protected. Your max password tries exceeded the limit."
      );
    };

    connection.onSocketDisconnect = function(event) {
      // alert('Connection to the server is closed.');
      if (connection.getAllParticipants().length > 0) return;
      location.reload();
    };

    connection.onSocketError = function(event) {
      alert("Unable to connect to the server. Please try again.");

      setTimeout(function() {
        location.reload();
      }, 1000);
    };

    connection.onopen = function(event) {
      //
    };

    var chatContainer = document.getElementById("chat-container");
    var lastMessage = "";
    connection.onmessage = function(event) {
      if (event.data.openChat === true) {
        chatContainer.removeAttribute("hidden");
      }

      if (event.data.closeChat === true) {
        chatContainer.setAttribute("hidden", "");
      }

      if (
        event.data.newChatMessage &&
        event.data.newChatMessage != lastMessage
      ) {
        lastMessage = event.data.newChatMessage;

        // there is a possibility that broadcaster did not send "openChat:true" signal
        // chatContainer.removeAttribute('hidden');

        appendChatMessage("Broadcaster", event.data.newChatMessage);
        updateTitle(event.data.newChatMessage);
        connection.send({
          receivedChatMessage: true,
          checkmark_id: event.data.checkmark_id
        });
      }

      if (event.data.receivedChatMessage) {
        if (document.getElementById(event.data.checkmark_id)) {
          document.getElementById(event.data.checkmark_id).style.display = "";
        }
      }
    };

    var txtChatMessage = document.getElementById("txt-chat-message");
    var chatMessages = document.getElementById("chat-messages");

    txtChatMessage.onkeyup = function(e) {
      if (e.keyCode === 13) {
        var checkmark_id = (Math.random() * 100).toString().replace(".", "");
        appendChatMessage("You", this.value, checkmark_id);
        connection.send({
          newChatMessage: this.value
        });
        this.value = "";
      }
    };

    function appendChatMessage(name, message, checkmark_id) {
      var div = document.createElement("div");
      if (checkmark_id) {
        div.innerHTML =
          '<p><span class="name">' +
          name +
          ': <img class="checkmark" id="' +
          checkmark_id +
          '" title="Received" src="images/checkmark.png"></span></p><p>' +
          message +
          "</p>";
      } else {
        div.innerHTML =
          '<p><span class="name">' +
          name +
          ":</span></p><p>" +
          message +
          "</p>";
      }
      chatMessages.appendChild(div);

      chatMessages.scrollTop = chatMessages.clientHeight;
      chatMessages.scrollTop =
        chatMessages.scrollHeight - chatMessages.scrollTop;
    }

    var tabTitle = document.getElementById("tab-title");
    function updateTitle(message) {
      tabTitle.innerHTML = message;
    }

    connection.socketCustomEvent = params.s;

    let presenceCheckWait = 1000;

    function checkPresence() {
      // infoBar.innerHTML = 'Checking room: ' + params.s;

      connection.checkPresence(params.s, function(isRoomExist, roomid, extra) {
        if (isRoomExist === false) {
          let noHostMessage =
            "Waiting for someone to host the room: " + params.s;
          if (infoBar.innerHTML != noHostMessage) {
            infoBar.innerHTML = noHostMessage;
          }

          setTimeout(function() {
            presenceCheckWait < 60000 &&
              (presenceCheckWait = presenceCheckWait * 2);
            setTimeout(checkPresence, presenceCheckWait);
          }, presenceCheckWait);
          return;
        }

        infoBar.innerHTML = "Joining room: " + params.s;

        connection.password = null;
        if (params.p) {
          connection.password = params.p;
        }

        connection.join(params.s);
      });
    }

    if (params.s) {
      checkPresence();
    }

    var dontDuplicate = {};
    connection.onPeerStateChanged = function(event) {
      if (!connection.getRemoteStreams(params.s).length) {
        if (event.signalingState === "have-remote-offer") {
          infoBar.innerHTML = "Received WebRTC offer from: " + params.s;
        } else if (
          event.iceGatheringState === "complete" &&
          event.iceConnectionState === "connected"
        ) {
          infoBar.innerHTML =
            "WebRTC handshake is completed. Waiting for remote video from: " +
            params.s;
        }
      }

      if (
        event.iceConnectionState === "connected" &&
        event.signalingState === "stable"
      ) {
        if (dontDuplicate[event.userid]) return;
        dontDuplicate[event.userid] = true;

        var peer = connection.peers[event.userid].peer;

        getStats(
          peer,
          function(stats) {
            onGettingWebRCStats(stats, event.userid);
          },
          1000
        );

        // statsBar.removeAttribute('hidden');
      }
    };

    var statsBar = document.getElementById("stats-bar");
    var statsBarHTML = document.getElementById("stats-bar-html");
    var NO_MORE = false;

    document.getElementById("show-stats-bar").onclick = function() {
      statsBar.toggleAttribute("hidden");
      NO_MORE = false;
    };

    document.getElementById("hide-stats-bar").onclick = function() {
      statsBar.setAttribute("hidden", "");
      NO_MORE = true;
    };

    document.getElementById("show-chats").onclick = function() {
      chatContainer.toggleAttribute("hidden");
      chatMessages.scrollTo(0, chatMessages.scrollHeight);
    };

    function onGettingWebRCStats(stats, userid) {
      if (!connection.peers[userid] || NO_MORE) {
        stats.nomore();
        return;
      }

      var html = "Video: " + stats.video.recv.codecs;
      html += "<br>";
      html +=
        "Resolution: " +
        stats.resolutions.recv.width +
        "x" +
        stats.resolutions.recv.height;
      html += "<br>";
      html += "Audio: " + stats.audio.recv.codecs;
      html += "<br>";
      html +=
        "Data: " +
        bytesToSize(stats.audio.bytesReceived + stats.video.bytesReceived);
      // html += '<br>';
      // html += 'Speed: ' + bytesToSize(stats.bandwidth.speed || 0);
      statsBarHTML.innerHTML = html;
    }

    function bytesToSize(bytes) {
      var k = 1000;
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes === 0) {
        return "0 Bytes";
      }
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
      return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    }

    window.addEventListener(
      "offline",
      function() {
        infoBar.innerHTML = "You seem to be offline.";
      },
      false
    );

    window.addEventListener(
      "online",
      function() {
        infoBar.innerHTML = "You are back online. Reloading the page...";
        location.reload();
      },
      false
    );

    document.addEventListener("copy", function(e) {
      e.clipboardData.setData("text/plain", e.target.textContent);
      e.preventDefault();
    });
  }
};
</script>
