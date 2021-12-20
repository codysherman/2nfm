(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["streamer"],{"1a2c":function(t,e){t.exports={functional:!0,render(t,e){const{_c:n,_v:i,data:o,children:s=[]}=e,{class:a,staticClass:r,style:c,staticStyle:l,attrs:d={},...u}=o;return n("svg",{class:[a,r],style:[c,l],attrs:Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},d),...u},s.concat([n("path",{attrs:{d:"M18 6V0H0v18h6v6h18V6h-6zM6 16H2V2h14v4H6v10zm16 6H8V8h14v14z"}})]))}}},2532:function(t,e,n){"use strict";var i=n("23e7"),o=n("5a34"),s=n("1d80"),a=n("577e"),r=n("ab13");i({target:"String",proto:!0,forced:!r("includes")},{includes:function(t){return!!~a(s(this)).indexOf(a(o(t)),arguments.length>1?arguments[1]:void 0)}})},"5a34":function(t,e,n){var i=n("44e7");t.exports=function(t){if(i(t))throw TypeError("The method doesn't accept regular expressions");return t}},"6a01":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("DesktopCapturer",{ref:"capturer",attrs:{enableVideo:t.enableVideo,enableAudio:t.enableAudio,enableMic:t.enableMic,resolution:t.resolution},on:{"is-sharing":t.onIsSharing,"got-stream":t.onGotStream,"set-defaults":t.onSetDefaults}}),n("StreamerConnection",{ref:"connection",attrs:{bandwidth:t.bandwidth,codecs:t.codecs,roomId:t.room_id,roomPassword:t.room_password,privacy:t.privacy,enableVideo:t.enableVideo,enableAudio:t.enableAudio,isP2POnly:t.isP2POnly},on:{"session-id":t.onSessionId,"viewer-count":t.onViewerCount,"id-taken":t.onIdTaken}}),n("div",{staticClass:"frow row-center width-100"},[n("div",{staticClass:"col-md-1-2"},[n("router-link",{staticClass:"logo",attrs:{to:"/"}},[n("LogoSvg")],1),n("div",{staticClass:"live-indicator",class:{live:t.isSharingOn&&t.sessionId}},[t._v("LIVE")])],1),n("div",{staticClass:"col-md-1-2"},[t.isSharingOn&&t.sessionId?t._e():n("div",[t.room_id&&t.room_id===t.useridAlreadyTaken?n("div",{staticClass:"id-taken text-center"},[t._v("Room name already taken: "),n("strong",[t._v(t._s(t.useridAlreadyTaken))])]):t._e(),n("label",{staticClass:"room-id-label row-start"},[n("span",{staticClass:"shrink-0"},[t._v("2n.fm/")]),n("input",{directives:[{name:"model",rawName:"v-model",value:t.room_id,expression:"room_id"}],attrs:{type:"text",placeholder:"Random"},domProps:{value:t.room_id},on:{change:t.setRoomName,blur:t.setRoomName,input:function(e){e.target.composing||(t.room_id=e.target.value)}}})]),n("section",{staticClass:"options"},[n("div",{staticClass:"section-label"},[t._v("Options")]),n("div",{staticClass:"section-label right-item",on:{click:function(e){t.showAdvancedOptions=!t.showAdvancedOptions}}},[t.showAdvancedOptions?t._e():n("div",{staticClass:"gear"},[n("div",{staticClass:"frow nowrap"},[n("GearSvg"),n("sup",[t._v("!")])],1)]),t.showAdvancedOptions?n("div",{staticClass:"x-icon"},[n("div",{staticClass:"frow centered"},[n("XSvg")],1)]):t._e()]),n("div",{directives:[{name:"show",rawName:"v-show",value:t.showAdvancedOptions,expression:"showAdvancedOptions"}],staticClass:"advanced"},[n("div",{staticClass:"frow centered"},[n("label",{staticClass:"row-center mb-0"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.isP2POnly,expression:"isP2POnly"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.isP2POnly)?t._i(t.isP2POnly,null)>-1:t.isP2POnly},on:{change:function(e){var n=t.isP2POnly,i=e.target,o=!!i.checked;if(Array.isArray(n)){var s=null,a=t._i(n,s);i.checked?a<0&&(t.isP2POnly=n.concat([s])):a>-1&&(t.isP2POnly=n.slice(0,a).concat(n.slice(a+1)))}else t.isP2POnly=o}}}),t._v("Force peer-to-peer (P2P) connections")])])]),n("div",{staticClass:"frow gutters"},[n("div",{staticClass:"col-xs-1-2"},[n("div",{staticClass:"settings-item"},[n("label",[t._v("Resolution"),n("select",{directives:[{name:"model",rawName:"v-model",value:t.resolution,expression:"resolution"}],attrs:{id:"resolutions"},on:{change:function(e){var n=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.resolution=e.target.multiple?n:n[0]}}},[n("option",{domProps:{value:t.Resolutions.FitScreen}},[t._v("Fit Screen")]),n("option",{domProps:{value:t.Resolutions.Fit4K}},[t._v("4K (2160p)")]),n("option",{domProps:{value:t.Resolutions.Fit2K}},[t._v("2K (1440p)")]),n("option",{domProps:{value:t.Resolutions.Fit1080p}},[t._v("Full-HD (1080p)")]),n("option",{domProps:{value:t.Resolutions.Fit720p}},[t._v("HD (720p)")]),n("option",{domProps:{value:t.Resolutions.Fit480p}},[t._v("SD (480p)")]),n("option",{domProps:{value:t.Resolutions.Fit360p}},[t._v("LD (360p)")]),n("option",{domProps:{value:t.Resolutions.Fit240p}},[t._v("N64 (240p)")]),n("option",{domProps:{value:t.Resolutions.Fit144p}},[t._v("2LO (144p)")])])])])]),n("div",{staticClass:"col-xs-1-2"},[n("label",{staticClass:"row-start"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.privacy,expression:"privacy"}],attrs:{type:"radio",value:"private"},domProps:{checked:t._q(t.privacy,"private")},on:{change:function(e){t.privacy="private"}}}),t._v("Private Room")]),n("label",{staticClass:"row-start mb-0"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.privacy,expression:"privacy"}],attrs:{type:"radio",value:"public"},domProps:{checked:t._q(t.privacy,"public")},on:{change:function(e){t.privacy="public"}}}),t._v("Public Room")])]),n("div",{staticClass:"col-xs-1-2"},[n("label",{staticClass:"row-start"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.enableMic,expression:"enableMic"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.enableMic)?t._i(t.enableMic,null)>-1:t.enableMic},on:{change:function(e){var n=t.enableMic,i=e.target,o=!!i.checked;if(Array.isArray(n)){var s=null,a=t._i(n,s);i.checked?a<0&&(t.enableMic=n.concat([s])):a>-1&&(t.enableMic=n.slice(0,a).concat(n.slice(a+1)))}else t.enableMic=o}}}),t._v("Enable Microphone")])]),n("div",{staticClass:"col-xs-1-2"},[n("label",{staticClass:"row-start mb-10"},[t._v("Codec"),n("select",{directives:[{name:"model",rawName:"v-model",value:t.codecs,expression:"codecs"}],staticClass:"ml-5",on:{change:function(e){var n=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.codecs=e.target.multiple?n:n[0]}}},[n("option",{domProps:{value:t.Codecs.vp9}},[t._v("VP9 (Quality)")]),n("option",{domProps:{value:t.Codecs.vp8}},[t._v("VP8 (Performance)")]),n("option",{attrs:{disabled:!t.isP2POnly},domProps:{value:t.Codecs.h264}},[t._v("H.264 (P2P Only)")])])]),n("div",{staticClass:"label text-center m-0"},[t.codecs===t.Codecs.vp9?n("span",[t._v("Best quality, least data")]):t._e(),t.codecs===t.Codecs.vp8?n("span",[t._v("Good quality, more FPS")]):t._e(),t.codecs===t.Codecs.h264?n("span",[t._v("Easy on old devices, bandwidth heavy")]):t._e()])])])]),n("section",[n("div",{staticClass:"section-label"},[t._v("Start")]),n("div",{staticClass:"frow gutters"},[n("div",{staticClass:"col-xs-1-3"},[n("div",{staticClass:"stream-button",on:{click:function(e){return t.startStream(!0,!1)}}},[n("div",{staticClass:"frow column-center"},[n("VideoSvg"),t._v("Video Only"),n("div",{staticClass:"and-mic",class:{"opacity-100":t.enableMic}},[t._v("& Mic")])],1)])]),n("div",{staticClass:"col-xs-1-3"},[n("div",{staticClass:"stream-button",on:{click:function(e){return t.startStream(!0,!0)}}},[n("div",{staticClass:"frow column-center"},[n("VideoAndAudioSvg"),t._v("Video + Audio"),n("div",{staticClass:"and-mic",class:{"opacity-100":t.enableMic}},[t._v("& Mic")])],1)])]),n("div",{staticClass:"col-xs-1-3"},[n("div",{staticClass:"stream-button",on:{click:function(e){return t.startStream(!1,!0)}}},[n("div",{staticClass:"frow column-center"},[n("AudioSvg"),t._v("Audio Only"),n("div",{staticClass:"and-mic",class:{"opacity-100":t.enableMic}},[t._v("& Mic")])],1)])])])])]),t.isSharingOn&&t.sessionId?n("StopSection",{attrs:{sessionId:t.sessionId,viewerCount:t.viewerCount,stream:t.stream,privacy:t.privacy},on:{"mute-mic-toggle":t.muteMic,"stop-stream":t.stopStream}}):t._e()],1)])],1)},o=[],s=(n("99af"),n("caad"),n("ac1f"),n("5319"),n("498a"),n("fb6a"),{FitScreen:"FitScreen",Fit4K:"Fit4K",Fit2K:"Fit2K",Fit1080p:"Fit1080p",Fit720p:"Fit720p",Fit480p:"Fit480p",Fit360p:"Fit360p",Fit240p:"Fit240p",Fit144p:"Fit144p"}),a=function t(e){switch(e){case s.Fit4K:return{width:3840,height:2160};case s.Fit2K:return{width:2560,height:1440};case s.Fit1080p:return{width:1920,height:1080};case s.Fit720p:return{width:1280,height:720};case s.Fit480p:return{width:720,height:480};case s.Fit360p:return{width:640,height:360};case s.Fit240p:return{width:426,height:240};case s.Fit144p:return{width:256,height:144};case s.FitScreen:default:return(window||{}).screen||t(s.Fit720p)}},r={vp8:"vp8",vp9:"vp9",h264:"h264"},c=n("8923"),l=n.n(c),d=n("111a"),u=n.n(d),h=n("e277"),v=n.n(h),p=n("2821"),m=n.n(p),f=n("25ca"),w=n.n(f),g=n("881e"),b=n.n(g),y=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{staticClass:"frow row-center"},[n("router-link",{staticClass:"public-link",attrs:{to:t.sessionId,target:"_blank"}},[t._v(t._s("2n.fm/"+t.sessionId))]),n("div",{staticClass:"copy-button",on:{click:function(e){return t.copyUrl()}}},[n("CopySvg")],1)],1),t.copyNotification?n("div",{staticClass:"copy-notification animate-fade-in"},[t._v("Copied")]):t._e(),n("div",{staticClass:"viewer-count mt-20"},[t._v(t._s(t.viewerCount)+" "+t._s(1===t.viewerCount?"Viewer":"Viewers"))]),n("div",{staticClass:"frow mt-5 mb-30"},[n("div",{staticClass:"public-indicator",class:{public:"public"===t.privacy}},[t._v(t._s(t.privacy))])]),t.showPreview?n("Player",{staticClass:"mb-20",attrs:{stream:t.stream,receiverViewerCount:t.viewerCount,disableAutoplay:!0}}):t._e(),t.stream.containsMic?n("label",{staticClass:"row-start"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.muteMic,expression:"muteMic"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.muteMic)?t._i(t.muteMic,null)>-1:t.muteMic},on:{change:[function(e){var n=t.muteMic,i=e.target,o=!!i.checked;if(Array.isArray(n)){var s=null,a=t._i(n,s);i.checked?a<0&&(t.muteMic=n.concat([s])):a>-1&&(t.muteMic=n.slice(0,a).concat(n.slice(a+1)))}else t.muteMic=o},t.toggleMicMute]}}),t._v("Mute Mic")]):t._e(),n("div",{staticClass:"streamer-control-buttons"},[n("div",{staticClass:"frow row-between"},[n("button",{staticClass:"col-xs-2-5",attrs:{type:"button"},on:{click:t.stopStream}},[t._v("End Sharing")]),n("button",{staticClass:"col-xs-2-5",attrs:{type:"button"},on:{click:function(e){t.showPreview=!t.showPreview}}},[t._v(t._s(t.showPreview?"Hide Preview":"Show Preview"))])])]),t._m(0)],1)},C=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"frow width-100 mt-20"},[n("a",{staticClass:"text-underline",attrs:{href:"https://caniuse.com/#search=getDisplayMedia",rel:"noopener",target:"_blank"}},[t._v("OS and Browser Limitations")])])}],_=(n("a9e3"),n("1a2c")),S=n.n(_),P=n("8137"),k={name:"StopSection",components:{CopySvg:S.a,Player:P["a"]},props:{stream:{type:MediaStream,default:null},sessionId:{type:String,default:null},viewerCount:{type:Number,default:0},privacy:{type:String,default:"private"}},data:function(){return{copyNotification:!1,showPreview:!1,muteMic:!1}},methods:{toggleMicMute:function(){this.$emit("mute-mic-toggle",this.muteMic)},copyUrl:function(){var t=this,e=document.createElement("input");e.setAttribute("value","https://2n.fm/".concat(this.sessionId)),document.body.appendChild(e),e.select();var n=document.execCommand("copy");n?(this.copyNotification=!0,setTimeout((function(){t.copyNotification=!1}),5e3)):console.error("Copy failed"),document.body.removeChild(e)},stopStream:function(){this.$emit("stop-stream")}}},A=k,M=(n("9e3f"),n("2877")),x=Object(M["a"])(A,y,C,!1,null,"88b652c0",null),O=x.exports,V=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div")},F=[],I=n("1da1"),E=(n("96cf"),n("159b"),{name:"DesktopCapturer",props:{enableVideo:Boolean,enableAudio:Boolean,enableMic:Boolean,resolution:{type:String,default:s.FitScreen}},data:function(){return{isSharing:!1,stream:null}},watch:{isSharing:function(t){this.$emit("is-sharing",t)}},beforeDestroy:function(){this.stopStream()},methods:{setDefaults:function(){this.$emit("set-defaults"),this.isSharing=!1},startStream:function(){this.setDefaults(),this.isSharing=!0,this.captureDesktop()},stopStream:function(){this.isSharing=!1,this.stream.getTracks().forEach((function(t){try{t.stop()}catch(e){console.error(e)}})),this.stream=null,this.setDefaults()},captureDesktop:function(){var t=this,e="";e=this.enableVideo?a(this.resolution):a("Fit144p");var n={video:{width:{ideal:e.width},height:{ideal:e.height}}};this.enableAudio&&(n.audio={autoGainControl:!1,echoCancellation:!1,noiseSuppression:!1});var i=function(){var t=Object(I["a"])(regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,navigator.mediaDevices.getUserMedia({audio:!0,video:!1});case 3:e=t.sent,t.next=10;break;case 6:t.prev=6,t.t0=t["catch"](0),console.error("Error getting microphone",t.t0),alert("Your browser denied microphone access");case 10:return t.abrupt("return",e);case 11:case"end":return t.stop()}}),t,null,[[0,6]])})));return function(){return t.apply(this,arguments)}}(),o=function(){var e=Object(I["a"])(regeneratorRuntime.mark((function e(){var i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,navigator.mediaDevices.getDisplayMedia(n);case 3:i=e.sent,e.next=9;break;case 6:e.prev=6,e.t0=e["catch"](0),t.setDefaults();case 9:return e.abrupt("return",i);case 10:case"end":return e.stop()}}),e,null,[[0,6]])})));return function(){return e.apply(this,arguments)}}(),s=function(){var e=Object(I["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(n=null,!0!==t.enableMic){e.next=5;break}return e.next=4,i();case 4:n=e.sent;case 5:if(!0!==t.enableMic||n){e.next=7;break}return e.abrupt("return");case 7:return e.next=9,o();case 9:if(t.stream=e.sent,!t.enableAudio||0!==t.stream.getAudioTracks().length){e.next=14;break}return alert('Make sure to check the "Share audio" box in Google Chrome or Microsoft Edge'),t.stopStream(),e.abrupt("return");case 14:t.stream.getAudioTracks().length>0&&(t.stream.containsAudio=!0),!t.enableVideo&&t.stream.getVideoTracks().length>0&&t.stream.removeTrack(t.stream.getVideoTracks()[0]),t.stream.getVideoTracks().length>0&&(t.stream.containsVideo=!0),n&&(t.stream.addTrack(n.getAudioTracks()[0]),t.stream.containsMic=!0),t.gotStream();case 19:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();s()},gotStream:function(){var t=this;this.stream?(this.stream.addEventListener("inactive",(function(){t.setDefaults()})),this.addStreamStopListener((function(){t.setDefaults()})),this.$emit("got-stream",this.stream)):this.setDefaults()},addStreamStopListener:function(t){var e="ended";"oninactive"in this.stream&&(e="inactive"),this.stream.addEventListener(e,(function(){t(),t=function(){}}),!1),this.stream.getAudioTracks().forEach((function(n){n.addEventListener(e,(function(){t(),t=function(){}}),!1)})),this.stream.getVideoTracks().forEach((function(n){n.addEventListener(e,(function(){t(),t=function(){}}),!1)}))}}}),D=E,T=Object(M["a"])(D,V,F,!1,null,null,null),R=T.exports,L=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div")},N=[],$=(n("2532"),n("3da5")),B=n("e854"),K={name:"StreamerConnection",props:{bandwidth:{type:Number,default:8192},codecs:{type:String,default:"vp8"},roomPassword:{type:String,default:""},roomId:{type:String,default:""},privacy:{type:String,default:"private"},enableVideo:{type:Boolean,default:!1},enableAudio:{type:Boolean,default:!1},isP2POnly:{type:Boolean,default:!1}},data:function(){return{connection:null}},mounted:function(){window.addEventListener("offline",this.setOffline,!1),window.addEventListener("online",this.setOnline,!1)},beforeDestroy:function(){window.removeEventListener("offline",this.setOffline,!1),window.removeEventListener("online",this.setOnline,!1),this.connection=null,delete this.connection},methods:{shareStreamUsingRTCMultiConnection:function(t){var e=this;this.connection=new RTCMultiConnection,this.connection.autoCreateMediaElement=!1,this.connection.socketURL="https://api.2n.fm:9001/",this.connection.autoCloseEntireSession=!0,"public"===this.privacy&&(this.connection.publicRoomIdentifier="desktopCapture"),this.connection.socketMessageEvent="desktopCapture",this.connection.password=null,this.roomPassword&&this.roomPassword.length&&(this.connection.password=this.roomPassword),this.connection.enableLogs=!1,this.connection.session={audio:this.enableAudio,video:this.enableVideo,data:!0,oneway:!0},this.connection.candidates={stun:!0,turn:!this.isP2POnly},this.connection.iceTransportPolicy="all",this.connection.iceProtocols={tcp:!0,udp:!0},this.connection.optionalArgument={optional:[],mandatory:{}},this.connection.channel=this.connection.sessionid=this.connection.userid,this.roomId&&this.roomId.length&&(this.connection.channel=this.connection.sessionid=this.connection.userid=this.roomId),this.connection.autoReDialOnFailure=!0,this.connection.getExternalIceServers=!1,this.connection.extra.isP2POnly=this.isP2POnly,this.connection.iceServers=B["a"].getIceServers(!this.isP2POnly),this.connection.processSdp=function(t){return e.bandwidth&&e.bandwidth&&!isNaN(e.bandwidth)&&"NaN"!=e.bandwidth&&"number"==typeof e.bandwidth&&(t=j(t,e.bandwidth),t=$["a"].setVideoBitrates(t,{min:e.bandwidth,max:e.bandwidth})),t=e.enableAudio&&!e.enableVideo?$["a"].preferCodec(t,r.h264):$["a"].preferCodec(t,e.codecs),t},this.connection.sdpConstraints.mandatory={OfferToReceiveAudio:!1,OfferToReceiveVideo:!1},this.connection.onstream=this.connection.onstreamended=function(t){try{t.mediaElement.pause(),delete t.mediaElement}catch(e){console.error(e)}},this.connection.onUserIdAlreadyTaken=function(t){e.$emit("id-taken",t)},this.connection.dontCaptureUserMedia=!0,this.connection.attachStreams.push(t),t.containsVideo&&(this.connection.extra.containsVideo=t.containsVideo),t.containsAudio&&(this.connection.extra.containsAudio=t.containsAudio),t.containsMic&&(this.connection.extra.containsMic=t.containsMic);var n="-",i=setInterval((function(){return e.connection?e.connection.isInitiator?(e.setViewerCount(0),void clearInterval(i)):(n+=" -",n.length>6&&(n="-"),void e.setViewerCount(n)):(e.setViewerCount(0),void clearInterval(i))}),500);this.connection.socketCustomEvent=this.connection.sessionid;var o=function(t,n,i){i&&alert(i),e.$emit("session-id",e.connection.sessionid),e.setViewerCount(0),e.connection.socket.on(e.connection.socketCustomEvent,(function(t){t.receivedYourScreen&&e.setViewerCount(e.connection.isInitiator?e.connection.getAllParticipants().length:0)}))};this.connection.onSocketDisconnect=function(){e.connection.getAllParticipants().length>0||e.setDefaults()},this.connection.onSocketError=function(){alert("Unable to connect to the server. Please try again."),setTimeout((function(){e.setDefaults()}),1e3)},this.connection.onmessage=function(t){t.data.newChatMessage&&e.connection.send({receivedChatMessage:!0,checkmark_id:t.data.checkmark_id})},this.connection.open(this.connection.sessionid,o);this.connection.onleave=function(t){var n=e.connection.getAllParticipants(),i=n.length;n.includes(t.userid)&&i--,e.setViewerCount(i)},this.connection.onPeerStateChanged=function(){var t=e.connection.getAllParticipants().length;e.setViewerCount(e.connection.isInitiator?t:0)}},setViewerCount:function(t){this.$emit("viewer-count",t),this.connection&&(this.connection.extra.receiverViewerCount=t,this.connection.updateExtraData())},setOffline:function(){this.connection&&this.connection.attachStreams.length&&this.setDefaults()},setOnline:function(){this.connection&&this.setDefaults()},setDefaults:function(){if(this.connection){this.connection.attachStreams.forEach((function(t){try{t.getTracks().forEach((function(t){try{t.stop()}catch(e){console.error(e)}}))}catch(e){console.error(e)}}));try{this.connection.closeSocket()}catch(t){console.error(t)}this.connection=null}this.setViewerCount(0)}}};function j(t,e){return t=t.replace(/b=AS([^\r\n]+\r\n)/g,""),t=t.replace(/a=mid:video\r\n/g,"a=mid:video\r\nb=AS:"+e+"\r\n"),t}var U=K,H=Object(M["a"])(U,L,N,!1,null,null,null),G=H.exports,z={name:"Streamer",metaInfo:function(){return{title:"2N.fm ".concat(this.isSharingOn&&this.sessionId?"(".concat(this.viewerCount,") · ").concat(this.room_id):"")}},components:{LogoSvg:l.a,VideoSvg:u.a,AudioSvg:v.a,VideoAndAudioSvg:m.a,XSvg:w.a,GearSvg:b.a,StopSection:O,DesktopCapturer:R,StreamerConnection:G},data:function(){return{isSharingOn:!1,sessionId:null,stream:null,desktop_id:null,constraints:null,room_password:"",room_id:window.localStorage.getItem("room_id")||"",resolution:s.FitScreen,codecs:r.vp8,bandwidth:null,enableVideo:!1,enableAudio:!1,streaming_method:"RTCMultiConnection",viewerCount:0,privacy:"private",useridAlreadyTaken:"",enableMic:!1,showAdvancedOptions:!1,isP2POnly:!1}},computed:{Resolutions:function(){return s},Codecs:function(){return r}},watch:{isP2POnly:function(t){t||this.codecs!=r.h264||(this.codecs=r.vp8)}},mounted:function(){},methods:{startStream:function(t,e){var n=this;if(this.enableVideo=t,this.enableAudio=e,this.$refs.connection.connection&&this.$refs.connection.connection.attachStreams[0])this.onSetDefaults();else{this.room_id="",window.localStorage.getItem("room_id")&&(this.room_id=window.localStorage.getItem("room_id"));var i=["streamer"];i.includes(this.room_id)?this.useridAlreadyTaken=this.room_id:this.$nextTick((function(){n.$refs.capturer.startStream()}))}},stopStream:function(){this.$refs.capturer.stopStream(),this.stream=null},setRoomName:function(){this.room_id=this.room_id.trim().replace(/\s+/g,"-").replace(/[^a-zA-Z0-9-_]/g,"").toLowerCase(),window.localStorage.setItem("room_id",this.room_id)},setBandwidth:function(t){try{this.bandwidth=parseInt(t)}catch(e){this.bandwidth=null}},onGotStream:function(t){this.stream=t,this.stream.enableVideo=this.enableVideo,this.stream.enableAudio=this.enableAudio,this.$refs.connection.shareStreamUsingRTCMultiConnection(this.stream)},onSessionId:function(t){this.useridAlreadyTaken="",this.sessionId=t},onSetDefaults:function(){this.$refs.connection.setDefaults()},onIdTaken:function(t){this.useridAlreadyTaken=t,this.stopStream()},onIsSharing:function(t){this.isSharingOn=t,this.isSharingOn||(this.sessionId=null)},onViewerCount:function(t){this.viewerCount=t},muteMic:function(t){this.stream.getAudioTracks().slice(-1)[0].enabled=!t}}},q=z,J=(n("eb98"),Object(M["a"])(q,i,o,!1,null,"7bfcb7ef",null));e["default"]=J.exports},8717:function(t,e,n){},"881e":function(t,e){t.exports={functional:!0,render(t,e){const{_c:n,_v:i,data:o,children:s=[]}=e,{class:a,staticClass:r,style:c,staticStyle:l,attrs:d={},...u}=o;return n("svg",{class:[a,r],style:[c,l],attrs:Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},d),...u},s.concat([n("path",{attrs:{d:"M24 13.616v-3.232l-2.869-1.02a9.445 9.445 0 00-.811-1.955l1.308-2.751-2.285-2.285-2.751 1.307a9.468 9.468 0 00-1.955-.811L13.616 0h-3.232L9.363 2.869a9.413 9.413 0 00-1.955.811L4.657 2.372 2.372 4.657 3.68 7.409a9.39 9.39 0 00-.811 1.955L0 10.384v3.232l2.869 1.02a9.39 9.39 0 00.811 1.955l-1.308 2.751 2.285 2.286 2.751-1.308a9.468 9.468 0 001.955.811L10.384 24h3.232l1.021-2.869a9.445 9.445 0 001.955-.811l2.751 1.308 2.285-2.286-1.308-2.751a9.445 9.445 0 00.811-1.955L24 13.616zM12 16a4 4 0 110-8 4 4 0 010 8z"}})]))}}},"9e3f":function(t,e,n){"use strict";n("8717")},ab02:function(t,e,n){},ab13:function(t,e,n){var i=n("b622"),o=i("match");t.exports=function(t){var e=/./;try{"/./"[t](e)}catch(n){try{return e[o]=!1,"/./"[t](e)}catch(i){}}return!1}},caad:function(t,e,n){"use strict";var i=n("23e7"),o=n("4d64").includes,s=n("44d2");i({target:"Array",proto:!0},{includes:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}}),s("includes")},eb98:function(t,e,n){"use strict";n("ab02")}}]);
//# sourceMappingURL=streamer.ebf24bf2.js.map