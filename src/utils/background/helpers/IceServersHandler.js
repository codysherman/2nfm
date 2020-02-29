// IceServersHandler.js

export const IceServersHandler = (function() {
  function getIceServers() {
    var iceServers = [{
      urls: [ 'stun:u3.xirsys.com' ],
    }, {
      username: 'nCvfkcJAvprAwLpirxzuRpaS2HjkOQ0wGHKJP0M'
        + 'jjyVdA3OI1XdHjcICAykCM6eHAAAAAF5Z2k5wYXJhZGlnbXBvc3Q=',
      credential: '850b28c6-5aa3-11ea-98ab-f67d6f96bf8e',
      urls: [
        'turn:u3.xirsys.com:80?transport=udp',
        'turn:u3.xirsys.com:3478?transport=udp',
        'turn:u3.xirsys.com:80?transport=tcp',
        'turn:u3.xirsys.com:3478?transport=tcp',
        'turns:u3.xirsys.com:443?transport=tcp',
        'turns:u3.xirsys.com:5349?transport=tcp',
      ],
    }];

    return iceServers;
  }

  return {
    getIceServers: getIceServers,
  };
})();
