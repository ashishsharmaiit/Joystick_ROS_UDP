const socket = new WebSocket('ws://34.218.222.3:9000');
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const peerConnection = new RTCPeerConnection(configuration);


  // Add a Data Channel
  const dataChannel = peerConnection.createDataChannel('dataChannel');


socket.addEventListener('open', () => {
  console.log('Connected to server');

  peerConnection.createOffer()
    .then(offer => peerConnection.setLocalDescription(offer))
    .then(() => {
      // Send SDP offer to the server
      const offerMessage = JSON.stringify({ type: 'offer', offer: peerConnection.localDescription });
      socket.send(offerMessage);
      console.log('offer sent', offerMessage);

    })
    .catch(error => {
        console.error('Error during offer creation or local description:', error);
    });

  peerConnection.onicecandidateerror = event => {
        console.error('Error gathering ICE candidate:', event.error);
  };
      
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      // Send local ICE candidate to the server
      console.log ('candidate generated', event.candidate);
      socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
    }
  };

  socket.addEventListener('message', event => {
    console.log('Message from server:', event.data);

    // Parse the message as JSON
    const parsedMessage = JSON.parse(event.data);

    // Check the message type and handle accordingly
    if (parsedMessage.type === 'candidate') {
      // Handle remote ICE candidate
      const candidate = new RTCIceCandidate(parsedMessage.candidate);
      peerConnection.addIceCandidate(candidate);
    } else if (parsedMessage.type === 'answer') {
      // Handle SDP answer
      const answer = new RTCSessionDescription(parsedMessage.answer);
      peerConnection.setRemoteDescription(answer);
      
    }
  });

  // Connection closed
  socket.addEventListener('close', () => {
    console.log('Disconnected from server');
  });

  dataChannel.onopen = event => {
    console.log('Data channel opened');
    dataChannel.send('Hello, World!'); // Send "hello world" when the channel is opened
  };

  dataChannel.onmessage = event => {
    console.log('Received message:', event.data);
  };

  peerConnection.ondatachannel = event => {
    console.log('Data channel received:', event.channel);
    const dataChannel = event.channel;
  
    dataChannel.onopen = event => {
      console.log('Data channel opened');
      dataChannel.send('Hello, World!'); // Send "hello world" when the channel is opened
      console.log('Hello World Sent');
    };

    dataChannel.onmessage = event => {
      console.log('Received message:', event.data);
    };
  };
});

peerConnection.oniceconnectionstatechange = function(event) {
    console.log('ICE connection state change: ', peerConnection.iceConnectionState);
    if (peerConnection.iceConnectionState === 'connected' || peerConnection.iceConnectionState === 'completed') {
      console.log('WebRTC connection established with the exchanged SDP offer and ICE candidates');
    }
  };
  