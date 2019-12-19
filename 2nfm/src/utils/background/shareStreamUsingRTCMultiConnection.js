import * as globals from './globals';
import { setDefaults } from './setDefaults';
import { setViewerCount } from './common';
import { CodecsHandler } from './helpers/CodecsHandler';
import { IceServersHandler } from './helpers/IceServersHandler';

export function shareStreamUsingRTCMultiConnection(stream) {
  // www.RTCMultiConnection.org/docs/
  globals.connection = new RTCMultiConnection();
  globals.connection.socketURL = "https://api.2n.fm:9001/";
  globals.connection.autoCloseEntireSession = true;

  // this must match the viewer page
  globals.connection.socketMessageEvent = "desktopCapture";

  globals.connection.password = null;
  if (globals.room_password && globals.room_password.length) {
    globals.connection.password = globals.room_password;
  }

  globals.connection.enableLogs = false;
  globals.connection.session = {
    audio: true,
    video: true,
    data: true,
    oneway: true
  };

  globals.connection.candidates = {
    stun: true,
    turn: true
  };

  globals.connection.iceProtocols = {
    tcp: true,
    udp: true
  };

  globals.connection.optionalArgument = {
    optional: [],
    mandatory: {}
  };

  globals.connection.channel = globals.connection.sessionid = globals.connection.userid;

  if (globals.room_id && globals.room_id.length) {
    globals.connection.channel = globals.connection.sessionid = globals.connection.userid = globals.room_id;
  }

  globals.connection.autoReDialOnFailure = true;
  globals.connection.getExternalIceServers = false;

  globals.connection.iceServers = IceServersHandler.getIceServers();

  function setBandwidth(sdp, value) {
    sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, "");
    sdp = sdp.replace(
      /a=mid:video\r\n/g,
      "a=mid:video\r\nb=AS:" + value + "\r\n"
    );
    return sdp;
  }

  globals.connection.processSdp = function(sdp) {
    if (globals.bandwidth) {
      try {
        globals.bandwidth = parseInt(globals.bandwidth);
      } catch (e) {
        globals.bandwidth = null;
      }

      if (
        globals.bandwidth &&
        globals.bandwidth != NaN &&
        globals.bandwidth != "NaN" &&
        typeof globals.bandwidth == "number"
      ) {
        sdp = setBandwidth(sdp, globals.bandwidth);
        sdp = BandwidthHandler.setVideoBitrates(sdp, {
          min: globals.bandwidth,
          max: globals.bandwidth
        });
      }
    }

    if (!!globals.codecs && globals.codecs !== "default") {
      sdp = CodecsHandler.preferCodec(sdp, globals.codecs);
    }
    return sdp;
  };

  // www.rtcmultiglobals.connection.org/docs/sdpConstraints/
  globals.connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
  };

  globals.connection.onstream = globals.connection.onstreamended = function(event) {
    try {
      event.mediaElement.pause();
      delete event.mediaElement;
    } catch (e) {}
  };

  // www.RTCMultiConnection.org/docs/dontCaptureUserMedia/
  globals.connection.dontCaptureUserMedia = true;

  // www.RTCMultiConnection.org/docs/attachStreams/
  globals.connection.attachStreams.push(stream);

  if (!globals.enableVideo && globals.connection.attachStreams[0].getVideoTracks().length > 0) {
    globals.connection.attachStreams[0].removeTrack(
      globals.connection.attachStreams[0].getVideoTracks()[0]
    );
  }

  // console.log("connectionHere", globals.connection.attachStreams[0].getAudioTracks());

  var text = "-";
  (function looper() {
    if (!globals.connection) {
      setViewerCount(0);
      return;
    }

    if (globals.connection.isInitiator) {
      setViewerCount(0);
      return;
    }

    text += " -";
    if (text.length > 6) {
      text = "-";
    }

    setViewerCount(text);
    setTimeout(looper, 500);
  })();

  // www.RTCMultiConnection.org/docs/open/
  globals.connection.socketCustomEvent = globals.connection.sessionid;

  function roomOpenCallback(isRoomOpened, roomid, error) {
    if (error) {
      alert(error);
    }

    // any key-values set here should be reset in setDefaults.js
    window.localStorage.setItem("sessionId", globals.connection.sessionid);

    // chrome.browserAction.enable();
    setViewerCount(0);

    if (room_url_box === true) {
      var resultingURL = "https://2n.fm/?s=" + globals.connection.sessionid;

      // resultingURL = 'http://localhost:9001/?s=' + globals.connection.sessionid;

      if (globals.room_password && globals.room_password.length) {
        resultingURL += "&p=" + globals.room_password;
      }

      if (globals.bandwidth) {
        resultingURL += "&bandwidth=" + globals.bandwidth;
      }
      if (!!globals.codecs && globals.codecs !== "default") {
        resultingURL += "&codecs=" + globals.codecs;
      }

      var popup_width = 600;
      var popup_height = 300;

      // chrome.windows.create(
      //   {
      //     url:
      //       "data:text/html,<title>Unique Room URL</title><h1 style='text-align:center'>Copy following URL:</h1><input id='link' type='text' value='" +
      //       resultingURL +
      //       "' style='text-align:center;width:100%;font-size:1.2em;'><p style='text-align:center'>Share this link with anyone you would like to share your cast with.</p><script type='text/javascript'>document.getElementById('link').focus();document.getElementById('link').setSelectionRange(0, 9999)</script>",
      //     type: "popup",
      //     width: popup_width,
      //     height: popup_height,
      //     top: parseInt(screen.height / 2 - popup_height / 2),
      //     left: parseInt(screen.width / 2 - popup_width / 2),
      //     focused: true,
      //   },
      //   function(win) {
      //     popup_id = win.id;
      //   }
      // );
    }

    globals.connection.socket.on(globals.connection.socketCustomEvent, function(message) {
      if (message.receivedYourScreen) {
        setViewerCount(
          globals.connection.isInitiator ? globals.connection.getAllParticipants().length : 0
        );
      }
    });

    // TODO: this is not defined anywhere
    init();
  }

  globals.connection.onSocketDisconnect = function(event) {
    // alert('globals.connection to the server is closed.');
    if (globals.connection.getAllParticipants().length > 0) return;

    setDefaults();

    // chrome.runtime.reload();
    // TODO: this is not defined anywhere
    init();
  };

  globals.connection.onSocketError = function(event) {
    alert("Unable to connect to the server. Please try again.");

    setTimeout(function() {
      setDefaults();
      // chrome.runtime.reload();

      // TODO: this is not defined anywhere
      init();
    }, 1000);
  };

  globals.connection.onopen = function(event) {
    //
  };

  globals.connection.onmessage = function(event) {
    if (event.data.newChatMessage) {
      globals.runtimePort.postMessage({
        messageFromContentScript1234: true,
        newChatMessage: event.data.newChatMessage
      });

      globals.connection.send({
        receivedChatMessage: true,
        checkmark_id: event.data.checkmark_id
      });
    }

    if (event.data.receivedChatMessage) {
      globals.runtimePort.postMessage({
        messageFromContentScript1234: true,
        receivedChatMessage: true,
        checkmark_id: event.data.checkmark_id
      });
    }
  };

  globals.connection.open(globals.connection.sessionid, roomOpenCallback);

  var oldLength = 0;
  globals.connection.onleave = globals.connection.onPeerStateChanged = function() {
    var participantsCount = globals.connection.getAllParticipants().length;
    if (oldLength != participantsCount) {
      // sendTabTitle();
    }
    setViewerCount(globals.connection.isInitiator ? participantsCount : 0);
  };
}
