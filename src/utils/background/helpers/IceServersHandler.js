// IceServersHandler.js

export const IceServersHandler = (function() {
  function getIceServers(connection) {
    var iceServers = [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun.l.google.com:19302?transport=udp"
        ]
      }
    ];

    return iceServers;
  }

  return {
    getIceServers: getIceServers
  };
})();
