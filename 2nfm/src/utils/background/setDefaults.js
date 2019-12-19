import { setViewerCount } from './common';

// TODO: rename me
export function setDefaults(externalThis) {
  if (externalThis.connection) {
    externalThis.connection.attachStreams.forEach(function(stream) {
      try {
        stream.getTracks().forEach(function(track) {
          try {
            track.stop();
          } catch (e) {}
        });
      } catch (e) {}
    });

    try {
      externalThis.connection.close();
    } catch (e) {}

    try {
      externalThis.connection.closeSocket();
    } catch (e) {}

    externalThis.connection = null;
  }

  // chrome.browserAction.setIcon({
  //     path: 'images/icon-inactive_128.png'
  // });

  // if (popup_id) {
  //     try {
  //         chrome.windows.remove(popup_id);
  //     } catch (e) {}

  //     popup_id = null;
  // }

  // chrome.browserAction.setTitle({
  //     title: '2N Streamer'
  // });

  setViewerCount("0");

  // chrome.runtime.reload();
}
