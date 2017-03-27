window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription

var communications = {

    getRTC: function(isHost){

        let servers = {
            // 'ice-servers': [
            //     {url:'stun.l.google.com:19302'}
            // ]
        }
        let config = {
            'optional': [
                { 'RtpDataChannels': true }
            ]
        }
        let sdpConstraints = {
            'mandatory': {
                'OfferToReceiveAudio': false,
                'OfferToReceiveVideo': false
            }
        }

        let rtc = new RTCPeerConnection(servers, config)

        rtc.dataChannel = rtc.createDataChannel('datachannel', {reliable: true})

        rtc.dataChannel.onmessage = event => { console.log('dc msg: ', event.data)}
        rtc.dataChannel.onopen = event => { console.log('dc opened') }
        rtc.dataChannel.onclose = event => { console.log('dc closed') }
        rtc.dataChannel.onerror = event => { console.log('dc error!')}

        rtc.onicecandidate = onIceCandidate

        if(isHost){

            rtc.createOffer(sdp => {
                
                rtc.setLocalDescription(sdp)

                console.log('sdp set!')
                console.log(sdp)

                    socket.emit('offer', sdp)
                
            }, dunnoFailure, sdpConstraints)
        }
        
        return rtc
// - - - - - - - - - - - - - - - - - - -

        // function makeOffer(sdp){
            
        //     rtc.setLocalDescription(sdp, dunnoSuccess, dunnoFailure)

        //     console.log('sdp: ', sdp.sdp)
        //     console.log('type: ', sdp.type)
        // }

        function onIceCandidate(candidate){
            console.log('new candidate {')
            console.log(candidate)
            console.log('new candidate }')
        }

        function dunnoSuccess(data){
            console.log('something succeeded!')
            console.log(data)
        }
        function dunnoFailure(data){
            console.log('something broke :(')
            console.log(data)
        }
    }
}