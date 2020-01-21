<template lang="pug">
  
</template>

<script>
import io from "socket.io-client";
// TODO: Remove need to do this
window.io = io;
import adapter from "webrtc-adapter";
import RTCMultiConnection from "rtcmulticonnection";

import { CodecsHandler } from "../utils/background/helpers/CodecsHandler";
import { IceServersHandler } from "../utils/background/helpers/IceServersHandler";

export default {
  name: "StreamerConnection",
  data() {
    return {
      connection: null
    };
  },
  props: {
    bandwidth: Number,
    codecs: String,
    room_password: String,
    room_id: String,
    room_url_box: Boolean
  },
  methods: {
    shareStreamUsingRTCMultiConnection(stream, isVideo = false) {
      // www.RTCMultiConnection.org/docs/
      this.connection = new RTCMultiConnection();
      this.connection.socketURL = "https://api.2n.fm:9001/";
      this.connection.autoCloseEntireSession = true;

      // this must match the viewer page
      this.connection.socketMessageEvent = "desktopCapture";

      this.connection.password = null;
      if (this.room_password && this.room_password.length) {
        this.connection.password = this.room_password;
      }

      this.connection.enableLogs = false;
      this.connection.session = {
        audio: true,
        video: true,
        data: true,
        oneway: true
      };

      this.connection.candidates = {
        stun: true,
        turn: true
      };

      this.connection.iceProtocols = {
        tcp: true,
        udp: true
      };

      this.connection.optionalArgument = {
        optional: [],
        mandatory: {}
      };

      this.connection.channel = this.connection.sessionid = this.connection.userid;

      if (this.room_id && this.room_id.length) {
        this.connection.channel = this.connection.sessionid = this.connection.userid = this.room_id;
      }

      this.connection.autoReDialOnFailure = true;
      this.connection.getExternalIceServers = false;

      this.connection.iceServers = IceServersHandler.getIceServers();

      this.connection.processSdp = sdp => {
        if (this.bandwidth) {
          if (
            this.bandwidth &&
            this.bandwidth != NaN &&
            this.bandwidth != "NaN" &&
            typeof this.bandwidth == "number"
          ) {
            sdp = setBandwidth(sdp, this.bandwidth);
            sdp = CodecsHandler.setVideoBitrates(sdp, {
              min: this.bandwidth,
              max: this.bandwidth
            });
          }
        }

        if (!!this.codecs && this.codecs !== "default") {
          sdp = CodecsHandler.preferCodec(sdp, this.codecs);
        }
        return sdp;
      };

      // www.rtcmultiexternalThis.connection.org/docs/sdpConstraints/
      this.connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
      };

      this.connection.onstream = this.connection.onstreamended = event => {
        try {
          event.mediaElement.pause();
          delete event.mediaElement;
        } catch (e) {}
      };

      // www.RTCMultiConnection.org/docs/dontCaptureUserMedia/
      this.connection.dontCaptureUserMedia = true;

      // www.RTCMultiConnection.org/docs/attachStreams/
      this.connection.attachStreams.push(stream);

      if (
        !isVideo &&
        this.connection.attachStreams[0].getVideoTracks().length > 0
      ) {
        this.connection.attachStreams[0].removeTrack(
          this.connection.attachStreams[0].getVideoTracks()[0]
        );
      }

      // console.log("connectionHere", externalThis.connection.attachStreams[0].getAudioTracks());

      var text = "-";
      // TODO: convert to setInterval
      const looper = () => {
        if (!this.connection) {
          this.setViewerCount(0);
          return;
        }

        if (this.connection.isInitiator) {
          this.setViewerCount(0);
          return;
        }

        text += " -";
        if (text.length > 6) {
          text = "-";
        }

        this.setViewerCount(text);
        setTimeout(looper, 500);
      };
      looper();

      // www.RTCMultiConnection.org/docs/open/
      this.connection.socketCustomEvent = this.connection.sessionid;

      const roomOpenCallback = (isRoomOpened, roomid, error) => {
        if (error) {
          alert(error);
        }

        // any key-values set here should be reset in setDefaults.js
        this.$emit("sessionId", this.connection.sessionid);

        // chrome.browserAction.enable();
        this.setViewerCount(0);

        if (this.room_url_box === true) {
          let resultingURL = "https://2n.fm/" + this.connection.sessionid;

          // resultingURL = 'http://localhost:9001/?s=' + externalThis.connection.sessionid;

          if (this.room_password && this.room_password.length) {
            resultingURL += "&p=" + this.room_password;
          }

          if (this.bandwidth) {
            resultingURL += "&bandwidth=" + this.bandwidth;
          }
          if (!!this.codecs && this.codecs !== "default") {
            resultingURL += "&codecs=" + this.codecs;
          }

          // TODO: previous chrome.windows code that showed URL went here
        }

        this.connection.socket.on(
          this.connection.socketCustomEvent,
          message => {
            if (message.receivedYourScreen) {
              this.setViewerCount(
                this.connection.isInitiator
                  ? this.connection.getAllParticipants().length
                  : 0
              );
            }
          }
        );
      };

      this.connection.onSocketDisconnect = event => {
        // alert('externalThis.connection to the server is closed.');
        if (this.connection.getAllParticipants().length > 0) return;

        this.setDefaults();

        // chrome.runtime.reload();
      };

      this.connection.onSocketError = event => {
        alert("Unable to connect to the server. Please try again.");

        setTimeout(() => {
          this.setDefaults();
          // chrome.runtime.reload();
        }, 1000);
      };

      this.connection.onopen = event => {
        //
      };

      this.connection.onmessage = event => {
        if (event.data.newChatMessage) {
          // this.runtimePort.postMessage({
          //   messageFromContentScript1234: true,
          //   newChatMessage: event.data.newChatMessage
          // });

          this.connection.send({
            receivedChatMessage: true,
            checkmark_id: event.data.checkmark_id
          });
        }

        // if (event.data.receivedChatMessage) {
        //   this.runtimePort.postMessage({
        //     messageFromContentScript1234: true,
        //     receivedChatMessage: true,
        //     checkmark_id: event.data.checkmark_id
        //   });
        // }
      };

      this.connection.open(this.connection.sessionid, roomOpenCallback);

      var oldLength = 0;
      this.connection.onleave = this.connection.onPeerStateChanged = () => {
        var participantsCount = this.connection.getAllParticipants().length;
        if (oldLength != participantsCount) {
          // sendTabTitle();
        }
        this.setViewerCount(
          this.connection.isInitiator ? participantsCount : 0
        );
      };
    },
    setViewerCount(count) {
      this.$emit("viewerCount", count);
    },
    setDefaults() {
      if (this.connection) {
        // TODO: this is getting into StreamCapturer teritory, not sure how to move/refactor/highlight this
        // (this effectively ends StreamCapturer and any getDisplayMedia side-effects)
        this.connection.attachStreams.forEach(stream => {
          try {
            stream.getTracks().forEach(track => {
              try {
                track.stop();
              } catch (e) {}
            });
          } catch (e) {}
        });

        try {
          this.connection.close();
        } catch (e) {}

        try {
          this.connection.closeSocket();
        } catch (e) {}

        this.connection = null;
      }

      // chrome.browserAction.setIcon({
      //     path: 'images/icon-inactive_128.png'
      // });

      // if (popup_id) {
      //     try {
      //         chrome.windows.remove(popup_id);
      //     } catch (e) {}

      //     popup_id = null;
      // }

      // chrome.browserAction.setTitle({
      //     title: '2N Streamer'
      // });

      this.setViewerCount(0);
    }
  },
  mounted() {
    // TODO: should probably deregister the event listener on e.g. `unmounted`
    window.addEventListener(
      "offline",
      () => {
        if (!this.connection || !this.connection.attachStreams.length) return;

        this.setDefaults();
      },
      false
    );

    window.addEventListener(
      "online",
      () => {
        if (!this.connection) return;

        this.setDefaults();
      },
      false
    );
  }
};

function setBandwidth(sdp, value) {
  sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, "");
  sdp = sdp.replace(
    /a=mid:video\r\n/g,
    "a=mid:video\r\nb=AS:" + value + "\r\n"
  );
  return sdp;
}
</script>
