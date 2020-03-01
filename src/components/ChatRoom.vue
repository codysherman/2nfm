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
    margin-bottom: 7px
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
    padding: 3px 7px
    svg
      width: 18px
      height: auto
      fill: #4f4f51

  #my
    .username
      font-size:10px
      padding-left: 15px
      color: #989898
    .chat-bubble
      background-color: #fff

  #their
    .username
      font-size:9px
      padding-left: 15px
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
</style>

<template lang="pug">
  div
    .chat-container.height-100(v-if="chatVisible")
      .x-icon(v-if="chatVisible" @click="chatVisible = false" )
        XSvg
      .frow.column-start.nowrap.height-100
        .set-username
          .frow.row-center.nowrap
            p.shrink-0 Chatting as:
            input(type="text" placeholder="Set Username")
            button#set-username-button.button-link(type="submit")
              Checkmark
        .chat-transcript-container.grow-1.height-100
          .frow.direction-column-reverse.height-100.justify-start
            .frow.row-end
              #my.chat-bubble-parent
                .username
                  | smallthrob
                .chat-bubble 
                  p My sample text
                .chat-bubble 
                  p And then there's even more text here.
            .frow.row-start
              #their.chat-bubble-parent
                .username
                  | dizbar
                .chat-bubble
                  p Their sample text
        .chat-message-field-container.shrink-0
          .frow.row-start.nowrap
            textarea#chat-message-field(type="text" placeholder="Enter Chat Message")
            //- button#send-message(type="submit")
            //-   | Send
            button#send-message(type="submit")
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
    };
  },
};

</script>
