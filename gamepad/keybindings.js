var connectOnEnter = function(){

    window.onkeyup = function(e){
        if(e.keyCode == 13){
            
            console.log(e.target.value)
            
            socket.emit('connectGamepad', e.target.value)

        }
    }
}