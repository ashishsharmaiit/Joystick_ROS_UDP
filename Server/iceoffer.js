const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 9000 });

// Store the connected clients
const clients = new Set();

// Event listener for WebSocket connections
wss.on('connection', ws => {
  console.log('Client connected');

  // Add the client to the set of connected clients
  clients.add(ws);

  // Event listener for messages from clients
  ws.on('message', message => {
    console.log('Message from client:', message);

    // Parse the message as JSON
    const parsedMessage = JSON.parse(message);

    // Handle different message types
    if (parsedMessage.type === 'offer') {
      const offer = parsedMessage.offer;
      console.log('Received SDP offer:', offer);

      // Send the acceptance message back to the client
      reply(JSON.stringify({ type: 'acceptance' }), ws);
      relay(message, ws);
    } else if (parsedMessage.type === 'answer') {
      const answer = parsedMessage.answer;
      console.log('Received SDP answer:', answer);

      // Send the acceptance message back to the client
      reply(JSON.stringify({ type: 'answer acceptance' }), ws);
      relay(JSON.stringify({type:'answer',answer:answer}), ws);
      console.log('Answer I am sending is:', JSON.stringify({type:'answer',offer:answer}));

    } else if (parsedMessage.type === 'candidate') {
      const candidate = parsedMessage.candidate;
      console.log('Received ICE Candidate:', candidate);

      // Send the acceptance message back to the client
      reply(JSON.stringify({ type: 'candidate acceptance' }), ws);
      relay(JSON.stringify(candidate), ws);
    }
  });

  // Event listener for client disconnections
  ws.on('close', () => {
    console.log('Client disconnected');

    // Remove the client from the set of connected clients
    clients.delete(ws);
  });
});

// Function to broadcast a message to all clients except the sender
function reply(message, sender) {
  clients.forEach(client => {
    if (client === sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function relay(message, sender) {
  clients.forEach(client => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
