import { setDefaults } from './setDefaults';
import { setViewerCount } from './common';
import { CodecsHandler } from './helpers/CodecsHandler';
import { IceServersHandler } from './helpers/IceServersHandler';
import io from 'socket.io-client';
import RTCMultiConnection from "rtcmulticonnection";

export function shareStreamUsingRTCMultiConnection(stream, externalThis) {
  // www.RTCMultiConnection.org/docs/
  externalThis.connection = new RTCMultiConnection();
  externalThis.connection.socketURL = "https://api.2n.fm:9001/";
  externalThis.connection.autoCloseEntireSession = true;

  // this must match the viewer page
  externalThis.connection.socketMessageEvent = "desktopCapture";

  externalThis.connection.password = null;
  if (externalThis.room_password && externalThis.room_password.length) {
    externalThis.connection.password = externalThis.room_password;
  }

  externalThis.connection.enableLogs = false;
  externalThis.connection.session = {
    audio: true,
    video: true,
    data: true,
    oneway: true
  };

  externalThis.connection.candidates = {
    stun: true,
    turn: true
  };

  externalThis.connection.iceProtocols = {
    tcp: true,
    udp: true
  };

  externalThis.connection.optionalArgument = {
    optional: [],
    mandatory: {}
  };

  externalThis.connection.channel = externalThis.connection.sessionid = externalThis.connection.userid;

  if (externalThis.room_id && externalThis.room_id.length) {
    externalThis.connection.channel = externalThis.connection.sessionid = externalThis.connection.userid = externalThis.room_id;
  }

  externalThis.connection.autoReDialOnFailure = true;
  externalThis.connection.getExternalIceServers = false;

  externalThis.connection.iceServers = IceServersHandler.getIceServers();

  function setBandwidth(sdp, value) {
    sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, "");
    sdp = sdp.replace(
      /a=mid:video\r\n/g,
      "a=mid:video\r\nb=AS:" + value + "\r\n"
    );
    return sdp;
  }

  externalThis.connection.processSdp = function(sdp) {
    if (externalThis.bandwidth) {
      try {
        externalThis.bandwidth = parseInt(externalThis.bandwidth);
      } catch (e) {
        externalThis.bandwidth = null;
      }

      if (
        externalThis.bandwidth &&
        externalThis.bandwidth != NaN &&
        externalThis.bandwidth != "NaN" &&
        typeof externalThis.bandwidth == "number"
      ) {
        sdp = setBandwidth(sdp, externalThis.bandwidth);
        sdp = BandwidthHandler.setVideoBitrates(sdp, {
          min: externalThis.bandwidth,
          max: externalThis.bandwidth
        });
      }
    }

    if (!!externalThis.codecs && externalThis.codecs !== "default") {
      sdp = CodecsHandler.preferCodec(sdp, externalThis.codecs);
    }
    return sdp;
  };

  // www.rtcmultiexternalThis.connection.org/docs/sdpConstraints/
  externalThis.connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
  };

  externalThis.connection.onstream = externalThis.connection.onstreamended = function(event) {
    try {
      event.mediaElement.pause();
      delete event.mediaElement;
    } catch (e) {}
  };

  // www.RTCMultiConnection.org/docs/dontCaptureUserMedia/
  externalThis.connection.dontCaptureUserMedia = true;

  // www.RTCMultiConnection.org/docs/attachStreams/
  externalThis.connection.attachStreams.push(stream);

  if (!externalThis.enableVideo && externalThis.connection.attachStreams[0].getVideoTracks().length > 0) {
    externalThis.connection.attachStreams[0].removeTrack(
      externalThis.connection.attachStreams[0].getVideoTracks()[0]
    );
  }

  // console.log("connectionHere", externalThis.connection.attachStreams[0].getAudioTracks());

  var text = "-";
  (function looper() {
    if (!externalThis.connection) {
      setViewerCount(0);
      return;
    }

    if (externalThis.connection.isInitiator) {
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
  externalThis.connection.socketCustomEvent = externalThis.connection.sessionid;

  function roomOpenCallback(isRoomOpened, roomid, error) {
    if (error) {
      alert(error);
    }

    // any key-values set here should be reset in setDefaults.js
    window.localStorage.setItem("sessionId", externalThis.connection.sessionid);

    // chrome.browserAction.enable();
    setViewerCount(0);

    if (room_url_box === true) {
      var resultingURL = "https://2n.fm/?s=" + externalThis.connection.sessionid;

      // resultingURL = 'http://localhost:9001/?s=' + externalThis.connection.sessionid;

      if (externalThis.room_password && externalThis.room_password.length) {
        resultingURL += "&p=" + externalThis.room_password;
      }

      if (externalThis.bandwidth) {
        resultingURL += "&bandwidth=" + externalThis.bandwidth;
      }
      if (!!externalThis.codecs && externalThis.codecs !== "default") {
        resultingURL += "&codecs=" + externalThis.codecs;
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

    externalThis.connection.socket.on(externalThis.connection.socketCustomEvent, function(message) {
      if (message.receivedYourScreen) {
        setViewerCount(
          externalThis.connection.isInitiator ? externalThis.connection.getAllParticipants().length : 0
        );
      }
    });
  }

  externalThis.connection.onSocketDisconnect = function(event) {
    // alert('externalThis.connection to the server is closed.');
    if (externalThis.connection.getAllParticipants().length > 0) return;

    setDefaults();

    // chrome.runtime.reload();
  };

  externalThis.connection.onSocketError = function(event) {
    alert("Unable to connect to the server. Please try again.");

    setTimeout(function() {
      setDefaults();
      // chrome.runtime.reload();
    }, 1000);
  };

  externalThis.connection.onopen = function(event) {
    //
  };

  externalThis.connection.onmessage = function(event) {
    if (event.data.newChatMessage) {
      externalThis.runtimePort.postMessage({
        messageFromContentScript1234: true,
        newChatMessage: event.data.newChatMessage
      });

      externalThis.connection.send({
        receivedChatMessage: true,
        checkmark_id: event.data.checkmark_id
      });
    }

    if (event.data.receivedChatMessage) {
      externalThis.runtimePort.postMessage({
        messageFromContentScript1234: true,
        receivedChatMessage: true,
        checkmark_id: event.data.checkmark_id
      });
    }
  };

  externalThis.connection.open(externalThis.connection.sessionid, roomOpenCallback);

  var oldLength = 0;
  externalThis.connection.onleave = externalThis.connection.onPeerStateChanged = function() {
    var participantsCount = externalThis.connection.getAllParticipants().length;
    if (oldLength != participantsCount) {
      // sendTabTitle();
    }
    setViewerCount(externalThis.connection.isInitiator ? participantsCount : 0);
  };
}
