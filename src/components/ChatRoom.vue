<style scoped lang="sass">
@keyframes octocat-wave
  0%,
  100%
    transform: rotate(0)
  20%,
  60%
    transform: rotate(-25deg)
  40%,
  80%
    transform: rotate(10deg)

.chat-container
  color: #000
  position: fixed
  bottom: 0
  border: 0
  left: 0
  max-height: 500px
  width: 340px
  background-color: #e3e3e3
  margin:15px
  padding: 10px
  box-shadow: 1px 5px 4px #a1a1a1
  border-radius: 3px
  
  .chat-transcript-container
    width: 100%
    overflow-y: scroll
    margin-bottom: 9px
    padding: 7px

  .chat-message-field-container
    width: 97%
  
  #send-message
    margin-left: 10px

  .set-username
    margin-bottom: 7px
    p
      font-size: 12px
    input
      margin: 0 9px
      height: 31px
      font-size: 14px
  
  #set-username-button
    font-size: 14px

  #my
    .username
      font-size:9px
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
    border: 2px solid black
    border-radius: 30px
    padding: 0 18px
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
              | Set
        .chat-transcript-container.grow-1.height-100
          .frow.direction-column-reverse
            .frow.row-end
              #my.chat-bubble-parent
                .username
                  | smallthrob
                .chat-bubble 
                  p My sample text
            .frow.row-start
              #their.chat-bubble-parent
                .username
                  | dizbar
                .chat-bubble
                  p Their sample text
        .chat-message-field-container.shrink-0
          .frow.row-start.nowrap
            textarea#chat-message-field(type="text" placeholder="Enter Chat Message")
            button#send-message(type="submit")
              | Send
    .room-launcher(v-if="!chatVisible" @click="chatVisible = true" )
      ChatBubble
      


</template>

<script>
import ChatBubble from '@/assets/svgs/chat-bubble.svg';
import XSvg from '@/assets/svgs/x.svg';


export default {
  name: 'ChatRoom',
  components: {
    ChatBubble,
    XSvg,
  },

  data() {
    return {
      chatVisible: true,
    };
  },
};

</script>
