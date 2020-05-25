// IceServersHandler.js

const TURN_USERNAME =
  'paB_VapMS4rh7KG1WxSX5sAoEAzPCBei0AwjO-PLRjIGrYBCsFZ_9WF-XlAvTnIBAAAAAF2FRx5jb2R5c2hlcm1hbg==';
const TURN_CREDENTIAL = '282dd8fc-dbef-11e9-87d1-12339b8f6738';

export const IceServersHandler = (function() {
  function getIceServers(withTurn = true) {
    var iceServers = [{
      urls: [ 'stun:ws-turn1.xirsys.com' ],
    }];

    if (withTurn) iceServers.push({
      username: TURN_USERNAME,
      credential: TURN_CREDENTIAL,
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
