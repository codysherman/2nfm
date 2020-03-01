<style scoped lang="sass">
@keyframes open-chat
  0%
    height: 0px
    width: 0px
  100%
    width: 340px
    height: 100%

// @keyframes close-chat
//   0%
//     height: 100%
//     width: 340px
//   100%
//     width: 0px
//     height: 0px


.chat-container
  color: #000
  position: fixed
  bottom: 0
  border: 0
  left: 0
  max-height: 500px
  width: 340px
  background-color: #e8e8e8
  margin:15px
  box-shadow: 1px 5px 4px #a1a1a1
  border-radius: 3px
  animation: 300ms open-chat
  // animation: 300ms ease-out close-chat
  
  .chat-transcript-container
    width: 100%
    overflow-y: scroll
    margin-bottom: 9px
    padding: 7px

  .chat-message-field-container
    width: 100%
    padding: 10px
    background-color: #cacaca
    border-radius: 0px 0px 3px 3px
    
    textarea
      &::placeholder
        color: #4F4F51

  #send-message
    margin-left: 10px
    svg
      width: 18px
      height: auto
      fill: #fff

  .set-username
    margin-bottom: 2px
    padding: 14px
    width: 100%
    p
      font-size: 12px
    input
      margin: 0 9px
      height: 31px
      font-size: 14px
  
  #set-username-button
    font-size: 14px
    border: 1px solid #4f4f51
    background: #ffffff
    border-radius: 5px
    box-shadow: 0 0 0 1px gray
    padding: 4px 8px
    text-decoration: none
    transition: all 10ms
    svg
      width: 18px
      height: auto
      fill: #4f4f51

  #set-username-button:hover
    box-shadow: 0 0 0 1px black
    background: #fefefe
    color: #00ab66

  #my
    .username
      font-size:11px
      padding-left: 12px
      color: #989898
    .chat-bubble
      background-color: #fff

  #their
    .username
      font-size:11px
      padding-left: 12px
      color: #989898
    .chat-bubble
      background-color: #cacaca

  .chat-bubble
    border: 2px solid #cacaca
    border-radius: 30px
    padding: 0 18px
    margin-bottom: 2px
    font-size: 12px

.room-launcher
  position: fixed
  z-index: 10
  bottom: 10px
  border: 0
  left: 10px
  svg
    width: 45px
    height: auto
  
.x-icon
  svg
    position: absolute
    z-index: 10
    top: -15px
    border: 0
    left: 323px
    width: 32px
    height: auto
    fill: #4f4f51
    border: 2px solid #4f4f51
    padding: 6px
    border-radius: 26px
    background-color: #fff

.centerDat
  text-align: center
  color: #00ab66
  animation-fill-mode: forwards

.mySentMsgs
  text-align: right

.adartest
  background: #ffffff
  padding: 10px
  border-radius: 5px

.changeUserName
  font-size: 11px
  color: #aaaaaa
  display:inline-block

.theme-dark
  font-size: 11px
  color: #696969
  --color-primary: #17ed90
  --color-secondary: #243133
  --color-accent: #12cdea
  --font-color: #ffffff

.theme-light
  font-size: 11px
  color: #bababa
  --color-primary: #0060df
  --color-secondary: #fbfbfe
  --color-accent: #fd6f53
  --font-color: #000000

.adartopmarg

</style>

<template lang="pug">
  div
    .chat-container.height-100(v-if="chatVisible")
      .x-icon(v-if="chatVisible" @click="chatVisible = false" )
        XSvg
      .frow.column-start.nowrap.height-100
        .set-username.overflow-hidden
          .frow.row-center.nowrap(v-if="editingName")
            p.shrink-0 Chatting as:
            input(type="text" placeholder="Set Username" v-model="setNameString")
            button#set-username-button.button-link(@click='setMyUsername')
              Checkmark
          h4.centerDat.animate-slide-down-up(v-if="editingName === false") {{ myUserName }} has entered the room!
          .frow.row-between.adartopmarg
            a.changeUserName(v-if="!editingName" @click='changeUserName') Change Username
            a.theme-dark(@click='setTheme("themeDark")') Dark Theme
            a.theme-light(@click='setTheme("themeLight")') Light Theme
        .chat-transcript-container.grow-1.height-100
          .frow.direction-column-reverse.height-100.justify-start
            .frow.row-end
              p.adartest(v-if="mySentMessages.length > 0")
                template(v-for="msg in mySentMessages")
                  .mySentMsgs(v-if="msg.length > 0") {{ msg }}
              #my.chat-bubble-parent
                .username 
                  | {{ myUserName }} 
              //-   .chat-bubble 
              //-     p {{ mySentMessages }}
            //- .frow.row-start
            //-   #their.chat-bubble-parent
            //-     .username
            //-       | dizbar
            //-     .chat-bubble
            //-       p {{ theirSentMessage }}
        .chat-message-field-container.shrink-0
          .frow.row-start.nowrap
            textarea#chat-message-field(type="text" placeholder="Enter Chat Message" 
            v-model="messageString")
            button#send-message(@click='greet')
              SendArrow
    .room-launcher(v-if="!chatVisible" @click="chatVisible = true" )
      ChatBubble
      


</template>

<script>
import ChatBubble from '@/assets/svgs/chat-bubble.svg';
import XSvg from '@/assets/svgs/x.svg';
import SendArrow from '@/assets/svgs/right-arrow-corner.svg';
import Checkmark from '@/assets/svgs/checkmark.svg';


export default {
  name: 'ChatRoom',
  components: {
    ChatBubble,
    XSvg,
    SendArrow,
    Checkmark,
  },

  data() {
    return {
      chatVisible: true,
      messageString: '',
      mySentMessages: [],

      editingName: true,

      setNameString: '',
      myUserName: 'Me',
    };
  },

  methods: {
    greet: function () {
      this.mySentMessages.push(this.messageString)
      this.messageString = ''
    },

    setMyUsername: function() {
      if(this.setNameString.length > 0){
        this.myUserName = this.setNameString
        this.editingName = false
        this.setNameString = ''
      }
    },

    changeUserName: function() {
      this.editingName = true
      this.setNameString = ''
    },

    setTheme(themeName) {
      localStorage.setItem('theme', themeName);
      alert(themeName)
    },

    toggleTheme() {
      if(localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light')
        console.log('Theme changed to light.')
      } 
      else {
        setTheme('theme-dark')
        console.log('Theme changed to dark.')
      }
    },
  },
};

</script>