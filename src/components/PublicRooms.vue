<style scoped lang="sass">
.public-room
  display: block
  width: 100%
  margin: 0 auto 10px
  padding: 5px 7px
  border-radius: 5px
  font-size: 18px
  color: $text-color

  &:hover,
  &:active,
  &:focus
    text-decoration: none
    color: $black
    background-color: $gray-lighter

.owner-svg
  svg
    width: 20px
    height: auto
    margin: 10px
    fill: $primary-color

.owner
  margin-bottom: 2px

.viewers
  margin-left: 10px
  border: 1px solid $gray-dark
  padding: 2px 5px
  border-radius: 100px
  min-width: 40px
  color: $gray-dark

  svg
    width: auto
    height: 13px
    margin-right: 2px
    fill: $gray-dark
</style>

<template lang="pug">
div
  h1.text-center.my-30 Public Rooms
  router-link.public-room(
    v-for="room in sortListOfRooms"
    :key="room.owner"
    :to="room.owner"
  )
    .frow.row-between.nowrap
      .frow.row-start
        .owner-svg.shrink-0
          VideoSvg(v-if="room.session.video && !room.session.audio")
          AudioSvg(v-if="room.session.audio && !room.session.video")
          VideoAndAudioSvg(v-if="room.session.audio && room.session.video")
        .owner {{room.owner}}
      .viewers.shrink-0
        .frow.row-center.nowrap
          PersonSvg.shrink-0
          .viewer-count {{room.extra.receiverViewerCount + 1}}
  .frow
    div(v-if="!listOfRooms.length") No public rooms open
</template>

<script>
import { IceServersHandler } from '@/utils/background/helpers/IceServersHandler';
import PersonSvg from '@/assets/svgs/person.svg';
import VideoSvg from '@/assets/svgs/video.svg';
import AudioSvg from '@/assets/svgs/audio.svg';
import VideoAndAudioSvg from '@/assets/svgs/video-and-audio.svg';

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
  name: 'PublicRooms',
  components: {
    PersonSvg,
    VideoSvg,
    AudioSvg,
    VideoAndAudioSvg,
  },
  props: {
    publicRoomCount: {
      type: Number,
      default: 0,
    },
  },
  STATE, // export so Receiver.vue can compare values for `state` event/emitter
  data() {
    return {
      params: {},
      connection: null,
      presenceCheckWait: 15000,
      roomName: 'streamer',
      listOfRooms: [],
    };
  },
  computed: {
    sortListOfRooms: function () {
      let newList = this.listOfRooms;
      return newList.sort((a, b) => {
        return b.extra.receiverViewerCount - a.extra.receiverViewerCount;
      });
    },
  },
  watch: {
    presenceCheckWait(newValue) {
      this.$emit('presence-check-wait', newValue);
    },
    listOfRooms(numOfRooms) {
      this.$emit('update:public-room-count', numOfRooms.length);
    },
  },
  mounted() {
    this.params = getParams();

    // http://www.rtcmulticonnection.org/docs/constructor/
    this.connection = new RTCMultiConnection(this.roomName);
    this.connection.socketURL = 'https://api.2n.fm:9001/';
    this.connection.autoCloseEntireSession = false;

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

    this.connection.candidates = {
      stun: true,
      turn: true,
    };
    this.connection.iceTransportPolicy = 'relay';

    this.connection.getExternalIceServers = false;
    this.connection.iceServers = IceServersHandler.getIceServers();

    this.connection.onstream = (e) => {
      this.$emit('stream', e.stream);
    };

    if (this.roomName) {
      this.checkPresence();
    }
  },
  methods: {
    checkPresence() {
      this.connection.checkPresence(
        this.roomName,
        // Keeping these parameters here for documentation
        // eslint-disable-next-line no-unused-vars
        (isRoomExist, roomid, extra) => {
          if (isRoomExist === false) {
            // if (this.presenceCheckWait < 60000) {
            //   this.presenceCheckWait = this.presenceCheckWait * 2;
            // }

            // FIXME: ensure presenceCheckWait watcher is triggered before sending state update
            // (or, this could be solved by making the infobarMessage a computed in Receiver)
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
      this.connection.publicRoomIdentifier = 'desktopCapture';
      this.connection.socket.emit(
        'get-public-rooms',
        this.connection.publicRoomIdentifier,
        (listOfRooms) => {
          this.listOfRooms = listOfRooms;
        },
      );
    },
  },
};

function getParams() {
  let DEFAULTS;
  let tempParams;
  (tempParams = {}), (DEFAULTS = { bandwidth: 8192 });

  return Object.assign({}, DEFAULTS, tempParams);
}
</script>