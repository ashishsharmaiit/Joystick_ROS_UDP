import rospy
import asyncio
import json
from aiortc import RTCDataChannel, RTCSessionDescription, RTCPeerConnection, RTCIceCandidate
import websockets
from functools import partial

async def on_channel_message(message):
    print('Received message on data channel:', message)



async def on_message(ws, message, pc):
    print('Received message:', message)

    # Parse the received message as JSON
    data = json.loads(message)

    # Check if the received message is an SDP offer
    if data.get('type') == 'offer' and data.get('offer'):
        # Set the remote description (SDP offer)
        offer = RTCSessionDescription(sdp=data['offer']['sdp'], type='offer')
        await pc.setRemoteDescription(offer)

        # Create an SDP answer
        answer = await pc.createAnswer()

        # Set the local description (SDP answer)
        await pc.setLocalDescription(answer)

        # Send the SDP answer back to the WebSocket server
        sdp_answer = {"type": "answer", "answer": {"type": "answer", "sdp": pc.localDescription.sdp}}
        print("sdp answer I am sending is",sdp_answer)
        await ws.send(json.dumps(sdp_answer))

    # Check if the received message is an ICE candidate
    elif data.get('type') == 'candidate' and data.get('candidate'):
        candidate = RTCIceCandidate(
            component=data['candidate']['sdpMLineIndex'], # For aiortc this should be the m-line index
            foundation=data['candidate']['foundation'],
            ip=data['candidate']['ip'],
            port=data['candidate']['port'],
            priority=data['candidate']['priority'],
            protocol=data['candidate']['protocol'],
            relatedAddress=None, # These are not available in the aiortc implementation as of September 2021
            relatedPort=None, # These are not available in the aiortc implementation as of September 2021
            tcpType=None, # This is only applicable for TCP candidates
            type=data['candidate']['type'],
        )
        await pc.addIceCandidate(candidate)

def on_open(ws):
    print('WebSocket connected')

async def main():
    rospy.init_node('websocket_client')
    rospy.loginfo('WebSocket client node initialized')

    rospy.sleep(1)

    # Create a new RTCPeerConnection
    pc = RTCPeerConnection()

    # Create a data channel and add it to the connection
    data_channel = pc.createDataChannel('dataChannel')
    data_channel.on("message", on_channel_message)


    # Function to handle local ICE candidates
    @pc.on("icecandidate")
    async def on_icecandidate(candidate):
        print('candidate generated', candidate)
        if candidate:
            candidate_dict = candidate.__dict__
            candidate_dict.pop('sdpMid') # Remove the sdpMid attribute because aiortc doesn't use it as of September 2021
            await ws.send(json.dumps({"type": "candidate", "candidate": candidate_dict}))

    uri = 'ws://34.218.222.3:9000/'
    async with websockets.connect(uri) as ws:
        on_open_ws = partial(on_open, ws=ws)  # Create a partial function with ws argument
        on_open_ws()

        while True:
            message = await ws.recv()
            await on_message(ws, message, pc)  # Pass ws and pc as arguments to on_message

        # Close the RTCPeerConnection
        await pc.close()

if __name__ == '__main__':
    asyncio.run(main())
