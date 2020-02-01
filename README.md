# 2N.fm is in progress

To start a stream visit: https://2n.fm/streamer

Visit https://2N.fm/{{room-name-here}} to view someone else's tab.

## Project setup
```
yarn
```

### Compiles and hot-reloads for development
```
yarn start
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

<!-- # Disclaimer

No more maintaining this extension; as of 2019. So please use at your own risk.

* https://www.webrtc-experiment.com/disclaimer/

----

## How to view screen?

Try any of the below URL. Replace `your_room_id` with real room-id:

```
https://www.webrtc-experiment.com/screen/?s=your_room_id
```

## Developer Notes

1. Chrome extension can share your screen, tab, any application's window, camera, microphone and speakers.
2. Clicking extension icon will generate a unique random room URL. You can share that URL with multiple users and all of them can view your screen.
3. [RTCMultiConnection](https://github.com/muaz-khan/RTCMultiConnection) is a WebRTC library that is used for peer-to-peer WebRTC streaming.
4. PubNub is used as a signaling method for handshake. However you can use [any WebRTC signaing option](https://github.com/muaz-khan/WebRTC-Experiment/blob/master/Signaling.md).
5. You can replace or include your own STUN+TURN servers in the [IceServersHandler.js](https://github.com/muaz-khan/Chrome-Extensions/blob/master/desktopCapture-p2p/IceServersHandler.js) file.
6. VP8 is currently default video codecs. However VP9 is recommended. You can always change codecs using options page.
7. [getStats](https://github.com/muaz-khan/getStats) is a WebRTC library that is used for bandwidth & codecs detection. This library is optional. You can always remove it.

## Before publishing it for your own business

> This step is optional. You can keep using `webrtc-experiment.com` URL as a screen viewer.

Open [desktop-capturing.js](https://github.com/muaz-khan/Chrome-Extensions/blob/master/desktopCapture-p2p/desktop-capturing.js) and find following line:

```javascript
var resultingURL = 'https://www.webrtc-experiment.com/screen/?s=' + connection.sessionid;
```

Replace above line with your own server/website:

```javascript
var resultingURL = 'https://yourWebSite.com/index.html?s=' + connection.sessionid;
```

You can find `index.html` here:

* [desktopCapture-p2p/index.html](https://github.com/muaz-khan/Chrome-Extensions/blob/master/desktopCapture-p2p/index.html)

## For more information

For additional information, click [this link](https://github.com/muaz-khan/WebRTC-Experiment/blob/7cd04a81b30cdca2db159eb746e2714307640767/Chrome-Extensions/desktopCapture/README.md).

## It is Open-Sourced!

* https://github.com/muaz-khan/Chrome-Extensions/tree/master/desktopCapture-p2p

## License

[Chrome-Extensions](https://github.com/muaz-khan/Chrome-Extensions) are released under [MIT license](https://github.com/muaz-khan/Chrome-Extensions/blob/master/LICENSE) . Copyright (c) [Muaz Khan](https://MuazKhan.com). -->
