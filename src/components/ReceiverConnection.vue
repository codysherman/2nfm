<template lang="pug">
</template>

<script>
import io from 'socket.io-client';
// TODO: Remove need to do this
window.io = io;
import adapter from 'webrtc-adapter';

import RTCMultiConnection from 'rtcmulticonnection';
import { getStats } from '@/utils/background/helpers/getStats.js';
import { CodecsHandler } from '@/utils/background/helpers/CodecsHandler.js';
import { IceServersHandler } from '@/utils/background/helpers/IceServersHandler.js';

/**
 * @event state { value: Connection.STATE, name?: string, reason?: string } the current state of the connection:
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
  GENERIC: 'GENERIC', // when RTCMultiConnection.onstatechanged sends a value we don't explicitly interpret
};

export default {
  name: 'ReceiverConnection',
  STATE, // export so Receiver.vue can compare values for `state` event/emitter
  props: {
    roomName: String,
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
      this.$emit('presenceCheckWait', newValue);
    },
  },
  mounted() {
    this.params = getParams();

    // http://www.rtcmulticonnection.org/docs/constructor/
    this.connection = new RTCMultiConnection(this.roomName);
    this.connection.socketURL = 'https://api.2n.fm:9001/';
    this.connection.autoCloseEntireSession = true;

    // this must match the extension page
    this.connection.socketMessageEvent = 'desktopCapture';

    this.connection.enableLogs = true;
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

    this.connection.getExternalIceServers = false;
    this.connection.iceServers = IceServersHandler.getIceServers();

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
          bandwidth != NaN &&
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

    this.connection.optionalArgument = {
      optional: [],
      mandatory: {},
    };

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

    this.connection.onstreamid = (event) => {
      this.$emit('state', { value: STATE.PEER_WILL_SEND });
    };

    this.connection.onstream = (e) => {
      this.$emit('stream', e.stream);
    };

    // if user left
    this.connection.onleave = this.connection.onstreamended = this.connection.onSessionClosed = (e) => {
      if (e.userid !== this.roomName) return;

      // TODO: possibly split into SOCKET_WILL_CLOSE so we can update infoBarMessage before closing connection
      this.connection.close();
      this.connection.closeSocket();
      this.connection.userid = this.connection.token();

      this.$emit('state', { value: STATE.SOCKET_CLOSED });
    };

    // TODO: refactor so synchronous `prompt`'s (or better alternative) is done from the Receiver.vue
    this.connection.onJoinWithPassword = (remoteUserId) => {
      if (!this.params.p) {
        this.params.p = prompt(
          remoteUserId + ' is password protected. Please enter the pasword:',
        );
      }

      this.connection.password = this.params.p;
      this.connection.join(remoteUserId);
    };

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

    this.connection.onSocketDisconnect = (event) => {
      if (this.connection.getAllParticipants().length > 0) return;

      this.$emit('state', { value: STATE.SOCKET_DISCONNECT });
    };

    this.connection.onSocketError = (_) => {
      this.$emit('state', { value: STATE.SOCKET_ERROR });
    };

    this.connection.onopen = (event) => {
      //
    };

    this.connection.socketCustomEvent = this.roomName;

    console.log('[Connection mounted]: roomName check:', this.roomName);
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
  methods: {
    checkPresence() {
      this.connection.checkPresence(
        this.roomName,
        (isRoomExist, roomid, extra) => {
          if (isRoomExist === false) {
            if (this.presenceCheckWait < 60000) {
              this.presenceCheckWait = this.presenceCheckWait * 2;
            }

            // FIXME: ensure presenceCheckWait watcher is triggered before sending state update
            // (maybe, this could also be solved by just making the infobarMessage a computed in Receiver.vue)
            setTimeout(
              () => this.$emit('state', { value: STATE.NOT_HOSTED }),
              0,
            );

            setTimeout(() => this.checkPresence(), this.presenceCheckWait);
            return;
          }

          this.$emit('state', { value: STATE.JOINING });

          this.connection.password = null;
          if (this.params.p) {
            this.connection.password = this.params.p;
          }

          this.connection.join(this.roomName);
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

function d(s) {
  return decodeURIComponent(s.replace(/\+/g, ' '));
}

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
