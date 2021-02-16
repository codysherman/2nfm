<template lang="pug">
</template>

<script>
import { getStats } from '@/utils/background/helpers/getStats';
import { CodecsHandler } from '@/utils/background/helpers/CodecsHandler';
import { IceServersHandler } from '@/utils/background/helpers/IceServersHandler';

/**
 * @event state { value: Connection.STATE, name?: string, reason?: string }
 *   the current state of the connection:
 *     - props other than `value` (name, reason) only sent on GENERIC
 * @event presenceCheckWait number how many seconds until the the room is checked again
 * @event stream RTCMultiConnection.?.Stream the stream that can be hooked up to an HTML element
 * @event stats (typeof U in getStats(T, (U) => undefined, V)) results of getStats function
 */
const STATE = {
  NOT_HOSTED: 'NOT_HOSTED',
  JOINING: 'JOINING',
  UNAUTHORIZED: 'UNAUTHORIZED',
  UNAVAILABLE: 'UNAVAILABLE',
  PEER_WILL_SEND: 'PEER_WILL_SEND',
  SOCKET_CLOSED: 'SOCKET_CLOSED',
  SOCKET_DISCONNECT: 'SOCKET_DISCONNECT',
  SOCKET_ERROR: 'SOCKET_ERROR',
  HAVE_OFFER: 'HAVE_OFFER',
  HANDSHAKE_COMPLETE: 'HANDSHAKE_COMPLETE',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  // when RTCMultiConnection.onstatechanged sends a value we don't explicitly interpret
  GENERIC: 'GENERIC',
};

export default {
  name: 'ReceiverConnection',
  STATE, // export so Receiver.vue can compare values for `state` event/emitter
  props: {
    roomName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      params: {},
      connection: null,
      presenceCheckWait: 3750,
    };
  },
  watch: {
    presenceCheckWait(newValue) {
      this.$emit('presence-check-wait', newValue);
    },
  },
  async mounted() {
    const { isP2POnly } = await this.fetchConnectionInfo();
    this.connect(isP2POnly);
  },
  methods: {
    createConnection() {
      // http://www.rtcmulticonnection.org/docs/constructor/
      const connection = new RTCMultiConnection(this.roomName);
      connection.autoCreateMediaElement = false;
      connection.socketURL = 'https://api.2n.fm:9001/';
      connection.autoCloseEntireSession = true;

      // this must match the extension page
      connection.socketMessageEvent = 'desktopCapture';

      connection.enableLogs = true;
      connection.optionalArgument = {
        optional: [],
        mandatory: {},
      };

      return connection;
    },
    async fetchConnectionInfo() {
      return new Promise((resolve, reject) => {
        console.log('[ReceiverConnection fetchConnectionInfo]', 'starting / promise called');
        const connection = this.createConnection();
        this.params = getParams();

        connection.session = {
          audio: false,
          video: false,
          data: true,
          oneway: true,
        };

        connection.sdpConstraints.mandatory = {
          OfferToReceiveAudio: false,
          OfferToReceiveVideo: false,
        };

        connection.onstream = (e) => {
          console.log('hello world');
          const connectionInfo = e.extra;
          connection.close();
          resolve(connectionInfo);
        };

        // TODO: this should be a more extensive check
        connection.onSocketError = reject;

        connection.onleave = (e) => {
          if (e.userid !== this.roomName) return;

          connection.close();
          connection.closeSocket();
          connection.userid = connection.token();
        };

        connection.onstreamended = connection.onSessionClosed = connection.onleave;

        this.checkPresence(connection);
      });
    },
    connect(isP2POnly) {
      console.log('[ReceiverConnection connect]', 'starting');
      this.connection = this.createConnection();
      this.params = getParams();

      this.connection.session = {
        audio: true,
        video: true,
        data: true,
        oneway: true,
      };

      // www.rtcmulticonnection.org/docs/sdpConstraints/
      this.connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
      };

      this.connection.processSdp = (sdp) => {
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
            !isNaN(bandwidth) &&
            bandwidth != 'NaN' &&
            typeof bandwidth == 'number'
          ) {
            sdp = setBandwidth(sdp, bandwidth);
            sdp = CodecsHandler.setVideoBitrates(sdp, {
              min: bandwidth,
              max: bandwidth,
            });
          }
        }

        if (!!codecs && codecs !== 'default') {
          sdp = CodecsHandler.preferCodec(sdp, codecs);
        }
        return sdp;
      };

      this.connection.candidates = {
        stun: true,
        turn: !isP2POnly,
      };
      this.connection.iceTransportPolicy = 'all';

      this.connection.getExternalIceServers = false;
      this.connection.iceServers = IceServersHandler.getIceServers(!isP2POnly);

      this.connection.onstatechange = (state) => {
        if (state.name == 'request-rejected' && this.params.p) {
          this.$emit('state', { value: STATE.UNAUTHORIZED });
        } else if (state.name === 'room-not-available') {
          this.$emit('state', { value: STATE.UNAVAILABLE });
        } else {
          const { name, reason } = state;
          this.$emit('state', { value: STATE.GENERIC, name, reason });
        }
      };

      this.connection.onstreamid = () => {
        this.$emit('state', { value: STATE.PEER_WILL_SEND });
      };

      this.connection.onstream = (e) => {
        if (e.extra.containsVideo) {
          e.stream.containsVideo = e.extra.containsVideo;
        }
        if (e.extra.containsAudio) {
          e.stream.containsAudio = e.extra.containsAudio;
        }
        if (e.extra.containsMic) {
          e.stream.containsMic = e.extra.containsMic;
        }
        if (e.extra.roomDescription) {
          e.stream.roomDescription = e.extra.roomDescription;
        }
        this.$emit('stream', e.stream);
      };
      this.connection.onExtraDataUpdated = (e) => {
        this.$emit('receiver-viewer-count', e.extra.receiverViewerCount);
      };

      // if user left
      this.connection.onleave = (e) => {
        if (e.userid !== this.roomName) return;

        // TODO: maybe split into SOCKET_WILL_CLOSE so we can update infoBarMessage before closing
        this.connection.close();
        this.connection.closeSocket();
        this.connection.userid = this.connection.token();

        this.$emit('state', { value: STATE.SOCKET_CLOSED });
      };

      // TODO: refactor so synchronous `prompt`'s (or better alternative) is done from the Receiver
      this.connection.onJoinWithPassword = (remoteUserId) => {
        if (!this.params.p) {
          this.params.p = prompt(
            remoteUserId + ' is password protected. Please enter the pasword:',
          );
        }

        this.connection.password = this.params.p;
        this.connection.join(remoteUserId);
      };
      this.connection.onstreamended = this.connection.onSessionClosed = this.connection.onleave;

      this.connection.onInvalidPassword = (remoteUserId, oldPassword) => {
        var password = prompt(
          remoteUserId +
            ' is password protected. Your entered wrong password (' +
            oldPassword +
            '). Please enter valid pasword:',
        );
        this.connection.password = password;
        this.connection.join(remoteUserId);
      };

      this.connection.onPasswordMaxTriesOver = (remoteUserId) => {
        alert(
          remoteUserId +
            ' is password protected. Your max password tries exceeded the limit.',
        );
      };

      this.connection.onSocketDisconnect = () => {
        if (this.connection.getAllParticipants().length > 0) return;

        this.$emit('state', { value: STATE.SOCKET_DISCONNECT });
      };

      this.connection.onSocketError = () => {
        this.$emit('state', { value: STATE.SOCKET_ERROR });
      };

      this.connection.onopen = () => {
        //
      };

      this.connection.socketCustomEvent = this.roomName;

      // console.log('[Connection mounted]: roomName check:', this.roomName);
      if (this.roomName) {
        this.checkPresence();
      }

      var dontDuplicate = {};
      this.connection.onPeerStateChanged = (event) => {
        if (!this.connection.getRemoteStreams(this.roomName).length) {
          if (event.signalingState === 'have-remote-offer') {
            this.$emit('state', { value: STATE.HAVE_OFFER });
          } else if (
            event.iceGatheringState === 'complete' &&
            event.iceConnectionState === 'connected'
          ) {
            this.$emit('state', { value: STATE.HANDSHAKE_COMPLETE });
          }
        }

        if (
          event.iceConnectionState === 'connected' &&
          event.signalingState === 'stable'
        ) {
          if (dontDuplicate[event.userid]) return;
          dontDuplicate[event.userid] = true;

          this.$emit('state', { value: STATE.CONNECTED });
          getStats(
            this.connection.peers[event.userid].peer,
            (stats) => {
              this.onGettingWebRTCStats(stats, event.userid);
            },
            1000,
          );
        } else if (event.iceConnectionState === 'disconnected') {
          this.$emit('state', { value: STATE.DISCONNECTED });
        }
      };
    },
    checkPresence(connection = null) {
      (connection || this.connection).checkPresence(
        this.roomName,
        // Keeping these parameters here for documentation
        // eslint-disable-next-line no-unused-vars
        (isRoomExist, roomid, extra) => {
          if (isRoomExist === false) {
            if (this.presenceCheckWait < 60000) {
              this.presenceCheckWait = this.presenceCheckWait * 2;
            }

            // FIXME: ensure presenceCheckWait watcher is triggered before sending state update
            // (or, this could be solved by making the infobarMessage a computed in Receiver)
            setTimeout(
              () => this.$emit('state', { value: STATE.NOT_HOSTED }),
              0,
            );

            setTimeout(() => this.checkPresence(connection), this.presenceCheckWait);
            return;
          }

          this.$emit('state', { value: STATE.JOINING });

          (connection || this.connection).password = null;
          if (this.params.p) {
            (connection || this.connection).password = this.params.p;
          }

          (connection || this.connection).join(this.roomName);
        },
      );
    },

    onGettingWebRTCStats(stats, userid) {
      if (!this.connection.peers[userid]) {
        stats.nomore();
        return;
      }
      this.$emit('stats', stats);
    },
  },
};

function setBandwidth(sdp) {
  sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, '');
  sdp = sdp.replace(/a=mid:video\r\n/g, 'a=mid:video\r\nb=AS:10000\r\n');
  return sdp;
}

function getParams() {
  let r;
  let DEFAULTS;
  let tempParams;
  (tempParams = {}),
  (r = /([^&=]+)=?([^&]*)/g),
  (DEFAULTS = { bandwidth: 8192 });

  function d(s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  }

  var match,
    search = window.location.search;
  while ((match = r.exec(search.substring(1))))
    tempParams[d(match[1])] = d(match[2]);

  return Object.assign({}, DEFAULTS, tempParams);
}
</script>