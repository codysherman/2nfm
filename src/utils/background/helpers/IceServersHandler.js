// IceServersHandler.js

export const IceServersHandler = (function() {
  function getIceServers(withTurn = true) {
    var iceServers = [{
      urls: [ 'stun:ws-turn1.xirsys.com' ],
    }];

    if (withTurn) iceServers.push({
      username: process.env.VUE_APP_TURN_USERNAME,
      credential: process.env.VUE_APP_TURN_CREDENTIAL,
      urls: [
        'turn:ws-turn1.xirsys.com:80?transport=udp',
        'turn:ws-turn1.xirsys.com:3478?transport=udp',
        'turn:ws-turn1.xirsys.com:80?transport=tcp',
        'turn:ws-turn1.xirsys.com:3478?transport=tcp',
        'turns:ws-turn1.xirsys.com:443?transport=tcp',
        'turns:ws-turn1.xirsys.com:5349?transport=tcp',
      ],
    });

    return iceServers;
  }

  return {
    getIceServers: getIceServers,
  };
})();
