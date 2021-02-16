<template lang="pug">
</template>

<script>
import { Codecs } from '@/utils/enums/Codecs';
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
      default: 'vp8',
    },
    roomPassword: {
      type: String,
      default: '',
    },
    roomId: {
      type: String,
      default: '',
    },
    privacy: {
      type: String,
      default: 'private',
    },
    enableVideo: {
      type: Boolean,
      default: false,
    },
    enableAudio: {
      type: Boolean,
      default: false,
    },
    streamDescription: {
      type: String,
      default: '',
    },
    isP2POnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { connection: null };
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
  methods: {
    shareStreamUsingRTCMultiConnection(stream) {
      // www.RTCMultiConnection.org/docs/
      this.connection = new RTCMultiConnection();
      this.connection.autoCreateMediaElement = false;

      this.connection.socketURL = 'https://api.2n.fm:9001/';
      this.connection.autoCloseEntireSession = true;
      // this must match the viewer page
      if (this.privacy === 'public') {
        this.connection.publicRoomIdentifier = 'desktopCapture';
      }

      this.connection.socketMessageEvent = 'desktopCapture';

      this.connection.password = null;
      if (this.roomPassword && this.roomPassword.length) {
        this.connection.password = this.roomPassword;
      }

      this.connection.enableLogs = false;
      this.connection.session = {
        audio: this.enableAudio,
        video: this.enableVideo,
        data: true,
        oneway: true,
      };

      this.connection.candidates = {
        stun: true,
        turn: !this.isP2POnly,
      };
      this.connection.iceTransportPolicy = 'all';

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

      this.connection.extra.isP2POnly = this.isP2POnly;
      this.connection.iceServers = IceServersHandler.getIceServers(!this.isP2POnly);

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

        if (this.enableAudio && !this.enableVideo) {
          sdp = CodecsHandler.preferCodec(sdp, Codecs.h264);
        } else {
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
        } catch (e) {
          console.error(e);
        }
      };

      this.connection.onUserIdAlreadyTaken = (useridAlreadyTaken) => {
        this.$emit('id-taken', useridAlreadyTaken);
      };

      // www.RTCMultiConnection.org/docs/dontCaptureUserMedia/
      this.connection.dontCaptureUserMedia = true;

      // www.RTCMultiConnection.org/docs/attachStreams/
      this.connection.attachStreams.push(stream);

      if (stream.containsVideo) {
        this.connection.extra.containsVideo = stream.containsVideo;
        // this.connection.updateExtraData();
      }

      if (stream.containsAudio) {
        this.connection.extra.containsAudio = stream.containsAudio;
        // this.connection.updateExtraData();
      }

      if (stream.containsMic) {
        this.connection.extra.containsMic = stream.containsMic;
        // this.connection.updateExtraData();
      }

      var text = '-';
      const looper = setInterval(() => {
        if (!this.connection) {
          this.setViewerCount(0);
          clearInterval(looper);
          return;
        }

        if (this.connection.isInitiator) {
          this.setViewerCount(0);
          clearInterval(looper);
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
        this.$emit('session-id', this.connection.sessionid);

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
      this.connection.onleave = (event) => {
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

      this.connection.extra.roomDescription = this.streamDescription;

    },
    setViewerCount(count) {
      this.$emit('viewer-count', count);
      if (this.connection) {
        this.connection.extra.receiverViewerCount = count;
        this.connection.updateExtraData();
      }
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
              } catch (e) {
                console.error(e);
              }
            });
          } catch (e) {
            console.error(e);
          }
        });

        try {
          this.connection.closeSocket();
        } catch (e) {
          console.error(e);
        }
        this.connection = null;
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