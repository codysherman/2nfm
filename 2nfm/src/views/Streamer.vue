<style scoped lang="scss">
body {
  padding-top: 20px;
}

.card {
  background-color: #ffffff;
  padding: 15px;
  text-align: center;
}

#logo {
  margin: 0 auto;
  width: 228px;
  height: auto;
  fill: #4f4f51;
}

#live-indicator {
  margin: 15px auto 0;
  width: 228px;
  color: #eaeaea;
  border-radius: 20px;
  border: 6px solid #eaeaea;
  font-weight: bold;
  font-size: 91px;
  text-align: center;
}

#live-indicator.live {
  color: red;
  border-color: red;
  animation: pulse 3s infinite alternate;
}

/* XS */
@media (max-width: 767px) {
  #logo {
    margin: 0 auto;
    width: 114px;
  }

  #live-indicator {
    width: 114px;
    border-radius: 10px;
    border: 3px solid #eaeaea;
    font-size: 45px;
    margin-bottom: 30px;
  }
}

#room-id-label {
  font-size: 40px;
  color: #4f4f51;
}

#room-id-label input {
  font-size: 40px;
  border-width: 4px;
}

/* XS */
@media (max-width: 767px) {
  #room-id-label {
    font-size: 30px;
  }

  #room-id-label input {
    font-size: 30px;
    border-width: 2px;
  }
}

#options {
  border: 2px solid #eaeaea;
  border-radius: 10px;
  padding: 40px;
  margin: 40px 0;
  position: relative;
}

#options .label {
  position: absolute;
  top: -9px;
  left: 30px;
  background-color: #fff;
  padding: 0 8px;
  width: auto;
}

.settings-item {
  margin-bottom: 40px;
}

.settings-item label {
  margin-bottom: 0;
}

#start {
  border: 2px solid #eaeaea;
  border-radius: 10px;
  padding: 40px;
  margin: 40px 0;
  position: relative;
}

#start .label {
  position: absolute;
  top: -9px;
  left: 30px;
  background-color: #fff;
  padding: 0 8px;
  width: auto;
}

.stream-button {
  cursor: pointer;
  transition: color 0.3s;
}

.stream-button:hover {
  color: #000;
}

.stream-button svg {
  width: auto;
  height: 40px;
  margin-bottom: 10px;
}

.stream-button svg path {
  fill: #4f4f51;
  transition: fill 0.3s;
}

.stream-button:hover svg path {
  fill: #000;
}

#public-link {
  display: block;
  font-size: 40px;
  color: #4f4f51;
  margin: 0 auto;
  text-align: center;
}

/* XS */
@media (max-width: 767px) {
  #public-link {
    font-size: 30px;
  }
}

.viewer-count {
  margin: 5px auto 60px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

#stop-sharing {
  margin: 0 auto;
  font-size: 40px;
  padding: 20px;
  background: none;
  border: 3px solid #4f4f51;
  color: #4f4f51;
  border-radius: 10px;
}
</style>

<template>
  <div class="frow centered">
    <div class="col-md-1-2">
      <svg
        id="logo"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 61.9 34.3"
        width="61.9"
        height="34.3"
        isolation="isolate"
      >
        <defs>
          <clipPath><rect width="61.9" height="34.3" /></clipPath>
        </defs>
        <g clip-path="url(#_clipPath_tcUaJZ4siK7ZJPj4ATDJEfxLNlNwtkyj)">
          <path
            d="M30.5 26.7L30.5 0C33.5 0.4 36.4 1.4 39 3.2 41 4.5 43.2 6.7 45.7 9.7L45.7 9.6C46.5 10.6 47.4 11.7 48.3 13 49.7 15.1 50.7 16.5 51.3 17.1 51.9 17.8 52.6 18.7 53.5 19.6L53.5 0 61.9 0 61.9 34.3C58.8 34 56 32.9 53.3 31.1 51.4 29.8 49.1 27.7 46.7 24.7L46.7 24.7C45.8 23.7 45 22.6 44.1 21.3 42.6 19.2 41.6 17.9 41.1 17.2 40.5 16.5 39.7 15.7 38.8 14.7L38.8 34.3 30.5 34.3 30.5 34.3 0 34.3C0.3 31.6 1.4 29 3.1 26.5 4.8 24.1 8.1 21.2 12.9 17.9 15.8 15.9 17.7 14.3 18.5 13.3 19.3 12.2 19.7 11.2 19.7 10.3 19.7 9.3 19.3 8.4 18.5 7.7 17.7 6.9 16.7 6.6 15.4 6.6 14.2 6.6 13.1 7 12.3 7.7 11.5 8.5 11.1 9 10.8 10.9L0.7 10.9C1.1 8.3 1.8 6.2 2.9 4.8 3.9 3.3 5.4 2.2 7.3 1.4 9.2 0.6 11.8 0.2 15.2 0.2 18.7 0.2 21.4 0.6 23.3 1.3 25.3 2.1 26.8 3.2 27.9 4.8 29 6.3 29.6 8 29.6 10 29.6 12 29 14 27.7 15.8 26.4 17.7 24.1 19.7 20.7 22 18.7 23.3 17.4 24.2 16.7 24.7 16 25.2 15.2 25.9 14.3 26.7L30.5 26.7Z"
            fill-rule="evenodd"
          />
        </g>
      </svg>
      <div id="live-indicator" :class="{ live: isSharingOn }">LIVE</div>
    </div>
    <div class="col-md-1-2">
      <section id="setup-section" v-if="!isSharingOn">
        <label id="room-id-label" class="row-start">
          <span class="shrink-0">2n.fm/?s=</span>
          <input type="text" id="room-id" placeholder="Random" :value="roomName" @change="setRoomName"/>
        </label>
        <section id="options">
          <div class="label">Options</div>
          <div class="frow row-start gutters">
            <div class="col-xs-1-2">
              <div class="settings-item">
                <label>
                  Resolution
                  <select id="resolutions">
                    <option value="fit-screen" selected>Fit Screen</option>
                    <option value="4K">4K (2160p)</option>
                    <option value="1080p">Full-HD (1080p)</option>
                    <option value="720p">HD (720p)</option>
                    <option value="480p">SD (480p)</option>
                    <option value="360p">SD (360p)</option>
                  </select>
                </label>
              </div>
            </div>

            <div class="col-xs-1-2">
              <div class="settings-item">
                <label>
                  Codec
                  <select id="codecs">
                    <option value="default" selected>Default (VP8)</option>
                    <option value="vp8">VP8</option>
                    <option value="vp9">VP9</option>
                    <option value="h264">H264</option>
                  </select>
                </label>
              </div>
            </div>

            <div class="col-xs-1-2">
              <div class="settings-item mb-0">
                <label>
                  Bandwidth
                  <input
                    type="text"
                    id="bandwidth"
                    value=""
                    placeholder="Optional: 8192, 1048, 512, etc."
                  />
                </label>
              </div>
            </div>

            <div class="col-xs-1-2">
              <div class="settings-item mb-0">
                <label>
                  Room Password
                  <input
                    type="password"
                    id="room_password"
                    value=""
                    placeholder="Optional"
                  />
                </label>
              </div>
            </div>

            <!-- NOTE: Keep this for now as example of checkbox -->
            <!-- <div class="col-xs-1-2">
              <div class="settings-item">
                <label>
                  Show URL Share Popup
                  <input
                    type="checkbox"
                    id="room_url_box"
                    class="mt-10"
                    checked
                  />
                </label>
              </div>
            </div> -->
          </div>
        </section>

        <section id="stream-section">
          <div id="start">
            <div class="label">Start</div>

            <div class="frow gutters">
              <div class="col-xs-1-2">
                <div id="video-button" class="stream-button" @click="startVideoStream">
                  <div class="frow column-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      version="1.1"
                    >
                      <g
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <path
                          d="M1 18L1 21 4 21C4 19.3 2.7 18 1 18L1 18ZM1 14L1 16C3.8 16 6 18.2 6 21L8 21C8 17.1 4.9 14 1 14L1 14ZM1 10L1 12C6 12 10 16 10 21L12 21C12 14.9 7.1 10 1 10L1 10ZM21 3L3 3C1.9 3 1 3.9 1 5L1 8 3 8 3 5 21 5 21 19 14 19 14 21 21 21C22.1 21 23 20.1 23 19L23 5C23 3.9 22.1 3 21 3L21 3Z"
                        />
                        <rect x="0" y="0" width="24" height="24" />
                        <g transform="translate(-208.000000, -106.000000)">
                          <g transform="translate(0.000000, 114.000000)" />
                        </g>
                      </g>
                    </svg>
                    Video
                  </div>
                </div>
              </div>
              <div class="col-xs-1-2">
                <div id="audio-button" class="stream-button" @click="startAudioStream">
                  <div class="frow column-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M2 6h3.828c-1.335 2.905-1.335 9.096 0 12h-3.828c-1.311-1.108-2-3.551-2-5.995 0-2.45.692-4.9 2-6.005zm22 6.005c.005 8.031-3.145 12.864-6.121 11.864-.774-.26-9.567-5.579-9.567-5.579-1.993-2.22-1.993-10.288 0-12.508 0 0 9.161-5.476 9.548-5.633 2.691-1.086 6.136 3.82 6.14 11.856zm-3.383-7.693c-1.053-2.264-3.002-2.226-4.034.002-.588 1.271-.993 3.165-1.21 4.797h.527c1.587 0 2.873 1.287 2.873 2.875s-1.286 2.875-2.873 2.875h-.515c.217 1.603.616 3.538 1.206 4.89.988 2.271 3.062 2.232 4.033-.002 1.946-4.477 1.772-11.609-.007-15.437z"
                      />
                    </svg>
                    Audio Only
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
      <section id="stop-section" v-if="isSharingOn">
        <router-link id="public-link" to="{query: { s: sessionId, p: room_password }}`}" target="_blank">
          {{`2n.fm/?s=${window.localStorage.getItem("sessionId")}`}}
        </router-link>
        <div class="viewer-count">
          <span id="viewer-count-number"></span> Viewers
        </div>
        <button type="button" id="stop-sharing" @click="stopStream">
          End Sharing
        </button>
        <!-- <div id="enable-chat"">
            <img src="../images/chat.png">
            Open Chat Box
          </div> -->
      </section>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
window.io = io;
import adapter from "webrtc-adapter";
import RTCMultiConnection from "rtcmulticonnection";

// import * as globals from "@/utils/background/globals.js";
import { setDefaults } from "@/utils/background/setDefaults.js";
import { captureDesktop } from "@/utils/background/captureDesktop.js";

export default {
  name: "Streamer",
  data() {
    return {
      stream: null,
      isSharingOn: window.localStorage.getItem("isSharingOn") === "true", // window.localStorage.getItem("isSharingOn")
      sessionId: null, // window.localStorage.getItem("sessionId")
      roomName: window.localStorage.getItem('room_id') || '',
      desktop_id: null,
      constraints: null,
      room_password: '',
      room_id: '',
      codecs: 'default',
      bandwidth: null,
      enableTabCaptureAPI: null,
      enableVideo: null,
      enableAudio: null,
      streaming_method: 'RTCMultiConnection',
      room_url_box: true,
    }
  },
  methods: {
    startVideoStream() {
      setDefaults(this);
      const streamFlags = {
        enableTabCaptureAPI: 'false',
        isSharingOn: 'true',
        enableVideo: 'true',
        enableAudio: 'true',
      };
      Object.keys(streamFlags).forEach(function(key) {
        window.localStorage.setItem(key, streamFlags[key]);
      });
      captureDesktop(this);
    },
    startAudioStream() {
      setDefaults(this);
      const streamFlags = {
        enableTabCaptureAPI: 'false',
        isSharingOn: 'true',
        enableVideo: 'false',
        enableAudio: 'true',
      };
      Object.keys(streamFlags).forEach(function(key) {
        window.localStorage.setItem(key, streamFlags[key]);
      });
      captureDesktop(this);
    },
    stopStream() {
      window.localStorage.setItem("isSharingOn", false);
      captureDesktop(this);
      // runtimePort.postMessage({
      //   messageFromContentScript1234: true,
      //   stopSharing: true,
      // });
    },
    setRoomName(event) {
      window.localStorage.setItem("room_id", event.target.value);
    },
  },
  mounted() {
    // document.getElementById('enable-chat').onclick = function() {
    //   var popup_width = 312;
    //   var popup_height = 400;

    //   runtimePort.postMessage({
    //     messageFromContentScript1234: true,
    //     openChat: true
    //   });

    //   window.open('chat.html','Chat','width='+popup_width+',height='+popup_height+',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=0,top='+(screen.height - popup_height)+',left=' + (screen.width - popup_width - 30));
    //   window.close();
    // };
  }
};
</script>
