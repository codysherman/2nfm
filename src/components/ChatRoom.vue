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
  
  .chat-transcript-container
    width: 100%
    overflow-y: scroll
    margin-bottom: 9px
    padding: 7px

  .chat-message-field-container
    width: 97%
  
  #send-message
    margin-left: 10px

  #my
    background-color: #fff
  #their
    background-color: #cacaca
  
  .chat-bubble
    background-color: red
    border: 2px solid black
    border-radius: 30px
    padding: 0 18px
    font-size: 12px

.room-launcher
  position: fixed
  z-index: 10
  bottom: 0
  border: 0
  left: 0

  svg
    width: 45px
    height: auto

</style>

<template lang="pug">
  .ChatRoom
    .room-launcher
      ChatBubble
    .chat-container.height-100
      .frow.column-start.nowrap.height-100
        .chat-transcript-container.grow-1.height-100
          .frow.direction-column-reverse
            .frow.row-end
              #my.chat-bubble
                p My sample text
            .frow.row-start
              #their.chat-bubble
                p Their sample text
        .chat-message-field-container.shrink-0
          .frow.row-start.nowrap
            textarea#chat-message-field(type="text" placeholder="Enter Chat Message")
            button#send-message(type="submit")
              | Send
      


</template>

<script>
import ChatBubble from '@/assets/svgs/chat-bubble.svg';

export default {
  name: 'ChatRoom',
  components: {
    ChatBubble,
  },
};
</script>
