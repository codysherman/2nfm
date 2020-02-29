<template lang="pug">
  
</template>
<script>
export default {
    
}
</script>
this.connection.publicRoomIdentifier = 'desktopCapture'
this.connection.socket.emit('get-public-rooms',
this.connection.publicRoomIdentifier,
(listOfRooms) => {
    console.log(listOfRooms)
    listOfRooms.forEach((room) => {
        console.error(room);
    });
    });