// IceServersHandler.js

export const IceServersHandler = (function() {
  function getIceServers() {
    var iceServers = [{
      urls: [ 'stun:ws-turn1.xirsys.com' ],
    }, {
      username: 'paB_VapMS4rh7KG1WxSX5sAoEAzPCBei0AwjO-PLRjIGrYBCsFZ_9WF-XlAvTnIBAAAAAF2FRx5jb2R5c2hlcm1hbg==',
      credential: '282dd8fc-dbef-11e9-87d1-12339b8f6738',
      urls: [
        'turn:ws-turn1.xirsys.com:80?transport=udp',
        'turn:ws-turn1.xirsys.com:3478?transport=udp',
        'turn:ws-turn1.xirsys.com:80?transport=tcp',
        'turn:ws-turn1.xirsys.com:3478?transport=tcp',
        'turns:ws-turn1.xirsys.com:443?transport=tcp',
        'turns:ws-turn1.xirsys.com:5349?transport=tcp',
      ],
    }];

    return iceServers;
  }

  return {
    getIceServers: getIceServers,
  };
})();
