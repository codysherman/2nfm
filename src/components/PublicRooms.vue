<template lang="pug">
    p hello world!
</template>
<script>
// import adapter from 'webrtc-adapter';

import RTCMultiConnection from 'rtcmulticonnection';
// import { getStats } from '@/utils/background/helpers/getStats';
// import { CodecsHandler } from '@/utils/background/helpers/CodecsHandler';
// import { IceServersHandler } from '@/utils/background/helpers/IceServersHandler';

export default {
  mounted() {
    this.params = getParams();

    // http://www.rtcmulticonnection.org/docs/constructor/
    this.connection = new RTCMultiConnection('');
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
    console.log(this.connection)
  },
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
this.connection.publicRoomIdentifier = 'desktopCapture'
this.connection.socket.emit('get-public-rooms',
this.connection.publicRoomIdentifier,
(listOfRooms) => {
    console.log(listOfRooms)
    listOfRooms.forEach((room) => {
        console.error(room);
    });
    });