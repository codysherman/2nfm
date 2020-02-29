// IceServersHandler.js

export const IceServersHandler = (function() {
  function getIceServers() {
    let iceServers = [
      {
        url: 'stun:global.stun.twilio.com:3478?transport=udp',
        urls: 'stun:global.stun.twilio.com:3478?transport=udp',
      },
      {
        url: 'turn:global.turn.twilio.com:3478?transport=udp',
        username:
          '635df392f184a3c38b1e1f275ec5c1004d9b8fa5aa32f81a45c904e830535070',
        urls: 'turn:global.turn.twilio.com:3478?transport=udp',
        credential: 'M4Ax2yC8TNlrKTmWrm2pFO08WGmDCKGy5HkAyv22seQ=',
      },
      {
        url: 'turn:global.turn.twilio.com:3478?transport=tcp',
        username:
          '635df392f184a3c38b1e1f275ec5c1004d9b8fa5aa32f81a45c904e830535070',
        urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
        credential: 'M4Ax2yC8TNlrKTmWrm2pFO08WGmDCKGy5HkAyv22seQ=',
      },
      {
        url: 'turn:global.turn.twilio.com:443?transport=tcp',
        username:
          '635df392f184a3c38b1e1f275ec5c1004d9b8fa5aa32f81a45c904e830535070',
        urls: 'turn:global.turn.twilio.com:443?transport=tcp',
        credential: 'M4Ax2yC8TNlrKTmWrm2pFO08WGmDCKGy5HkAyv22seQ=',
      },
    ];
    return iceServers;
  }

  return {
    getIceServers: getIceServers,
  };
})();
