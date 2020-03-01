<template lang="pug">
  
</template>

<script>
// NOTE: needs to be imported for back-compat, but not referenced
// eslint-disable-next-line no-unused-vars
import adapter from 'webrtc-adapter';

import RTCMultiConnection from 'rtcmulticonnection';

import { CodecsHandler } from '../utils/background/helpers/CodecsHandler';
import { IceServersHandler } from '../utils/background/helpers/IceServersHandler';

export default {
  name: 'StreamerConnection',
  props: {
    bandwidth: {
      type: Number,
      default: 8192,
    },
    codecs: {
      type: String,
      default: 'default',
    },
    roomPassword: {
      type: String,
      default: '',
    },
    roomId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      connection: null,
    };
  },
  mounted() {
    window.addEventListener('offline', this.setOffline, false);
    window.addEventListener('online', this.setOnline, false);
  },
  beforeDestroy() {
    window.removeEventListener('offline', this.setOffline, false);
    window.removeEventListener('online', this.setOnline, false);

    this.connection = null;
    delete this.connection;
  },
  beforeDestroy() {
    this.connection = null;
  },
  methods: {
    shareStreamUsingRTCMultiConnection(stream, isVideo = false) {
      // www.RTCMultiConnection.org/docs/
      this.connection = new RTCMultiConnection();
      this.connection.socketURL = 'https://api.2n.fm:9001/';
      this.connection.autoCloseEntireSession = true;

      // this must match the viewer page
      this.connection.socketMessageEvent = 'desktopCapture';

      this.connection.password = null;
      if (this.roomPassword && this.roomPassword.length) {
        this.connection.password = this.roomPassword;
      }

      this.connection.enableLogs = false;
      this.connection.session = {
        audio: true,
        video: true,
        data: true,
        oneway: true,
      };

      this.connection.candidates = {
        stun: true,
        turn: true,
      };
      this.connection.iceTransportPolicy = 'relay';

      this.connection.iceProtocols = {
        tcp: true,
        udp: true,
      };

      this.connection.optionalArgument = {
        optional: [],
        mandatory: {},
      };

      this.connection.channel = this.connection.sessionid = this.connection.userid;

      if (this.roomId && this.roomId.length) {
        this.connection.channel = this.connection.sessionid = this.connection.userid = this.roomId;
      }

      this.connection.autoReDialOnFailure = true;
      this.connection.getExternalIceServers = false;

      this.connection.iceServers = IceServersHandler.getIceServers();

      this.connection.processSdp = (sdp) => {
        if (this.bandwidth) {
          if (
            this.bandwidth &&
            !isNaN(this.bandwidth) &&
            this.bandwidth != 'NaN' &&
            typeof this.bandwidth == 'number'
          ) {
            sdp = setBandwidth(sdp, this.bandwidth);
            sdp = CodecsHandler.setVideoBitrates(sdp, {
              min: this.bandwidth,
              max: this.bandwidth,
            });
          }
        }

        if (!!this.codecs && this.codecs !== 'default') {
          sdp = CodecsHandler.preferCodec(sdp, this.codecs);
        }
        return sdp;
      };

      // www.rtcmultiexternalThis.connection.org/docs/sdpConstraints/
      this.connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false,
      };

      this.connection.onstream = this.connection.onstreamended = (event) => {
        try {
          event.mediaElement.pause();
          delete event.mediaElement;
        } catch (e) {}
      };

      this.connection.onUserIdAlreadyTaken = (useridAlreadyTaken) => {
        this.$emit('idTaken', useridAlreadyTaken);
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
          this.connection.attachStreams[0].getVideoTracks()[0],
        );
      }

      // console.log("connectionHere", externalThis.connection.attachStreams[0].getAudioTracks());

      var text = '-';
      const looper = setInterval(() => {
        if (!this.connection) {
          this.setViewerCount(0);
          clearInterval(looper);
          return;
        }

        if (this.connection.isInitiator) {
          this.setViewerCount(0);
          clearInterval(looper)
          return;
        }

        text += ' -';
        if (text.length > 6) {
          text = '-';
        }

        this.setViewerCount(text);
      }, 500);
      

      // www.RTCMultiConnection.org/docs/open/
      this.connection.socketCustomEvent = this.connection.sessionid;

      const roomOpenCallback = (isRoomOpened, roomid, error) => {
        if (error) {
          alert(error);
        }

        // any key-values set here should be reset in setDefaults.js
        this.$emit('sessionId', this.connection.sessionid);

        this.setViewerCount(0);

        this.connection.socket.on(
          this.connection.socketCustomEvent,
          (message) => {
            if (message.receivedYourScreen) {
              this.setViewerCount(
                this.connection.isInitiator
                  ? this.connection.getAllParticipants().length
                  : 0,
              );
            }
          },
        );
      };

      this.connection.onSocketDisconnect = () => {
        // alert('externalThis.connection to the server is closed.');
        if (this.connection.getAllParticipants().length > 0) return;

        this.setDefaults();
      };

      this.connection.onSocketError = () => {
        alert('Unable to connect to the server. Please try again.');

        setTimeout(() => {
          this.setDefaults();
        }, 1000);
      };

      // this.connection.onopen = (event) => {
      //   //
      // };

      this.connection.onmessage = (event) => {
        if (event.data.newChatMessage) {
          // this.runtimePort.postMessage({
          //   messageFromContentScript1234: true,
          //   newChatMessage: event.data.newChatMessage
          // });

          this.connection.send({
            receivedChatMessage: true,
            checkmark_id: event.data.checkmark_id,
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
      this.connection.onleave = (event) =>{
        const participants = this.connection.getAllParticipants();
        let count = participants.length;
        if (participants.includes(event.userid)) {
          count--;
        }
        this.setViewerCount(count);
      };

      this.connection.onPeerStateChanged = () => {
        const participantsCount = this.connection.getAllParticipants().length;
        if (oldLength != participantsCount) {
          // sendTabTitle();
        }
        this.setViewerCount(
          this.connection.isInitiator ? participantsCount : 0,
        );
      };
    },
    setViewerCount(count) {
      this.$emit('viewerCount', count);
      this.connection.extra.receiverViewerCount = count;
      this.connection.updateExtraData();
    },
    setOffline() {
      if (!this.connection || !this.connection.attachStreams.length) return;
      this.setDefaults();
    },
    setOnline() {
      if (!this.connection) return;
      this.setDefaults();
    },
    setDefaults() {     
      if (this.connection) {
        this.connection.attachStreams.forEach((stream) => {
          try {
            stream.getTracks().forEach((track) => {
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

      }

      this.setViewerCount(0);
    },
  },
};

function setBandwidth(sdp, value) {
  sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, '');
  sdp = sdp.replace(
    /a=mid:video\r\n/g,
    'a=mid:video\r\nb=AS:' + value + '\r\n',
  );
  return sdp;
}
</script>
