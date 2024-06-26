# Joystick_ROS_UDP

**Most of the steps are similar to the TCP code here https://github.com/ashishsharmaiit/Joystick_ROS_TCP.git though there might be filename changes. Highlighting** changes in **bold** in the narrative below.

This repo sends gamepad/joystick data fom Browser to ROS via **UDP** connection via a server.

Steps to use this code:

1. Run the server file from the EC2 server with the steps below:

a. Go to EC2 console from web browser, and ensure that the 'robotics' name server is running. If it is not running, run it using 'instance state'. After using, please switch off to save the cost.

b. Once it is running, go to terminal and go the folder where robotics.pem file is saved.

c. type this command from that folder - chmod 400 robotics.pem

d. Go to the EC2 instance and copy the Public DNS server address. It will read like ec2-34-218-222-3.us-west-2.compute.amazonaws.com, and will change with the Public IP address.

e. Then type this command -> ssh -i robotics.pem ubuntu@<replace with public ip address> e.g. ssh -i robotics.pem ubuntu@ec2-34-218-222-3.us-west-2.compute.amazonaws.com -> please note that "ubuntu" in this command will need to be replaced with corresponding value for windows or mac. You might want to google that if you are not using ubuntu.

f. press "yes" in terminal if asked.

g. now you should be have ssh into the EC2 server.

h. Go to signaling-server folder


2. Type the command **node iceoffer.js** to run the server file. The file should be already saved in the server. No need to copy it.

4. Change the server IP address in both the sender and receiver files as per the new IP from EC2. IP refreshes every time server is switched on, if it was off earlier. If it continued to run, then IP address shouldn't have changed.

6. Copy the receiver python file in your catkin workspace, and then catkin_make. Install the dependencies, if not already installed. You might need to install dependencies like aiortc. Run roscore in one terminal. Run the python file using **python3 receivegamepadudp.py** in another terminal. **Wait for 2 seconds for it to give these 2 logs -
[INFO] [1689998161.080578]: WebSocket client node initialized
WebSocket connected
Now, you can move to the next step. Please Note that you should open the python and wait till you get websocket connected before you open the html. It might make a difference for UDP if you don't do this. If you opened python later, just refresh the html once you get websocket connected message in python.**

5. Save both the sender files in the same folder in desktop. Open the sender html file in chrome. Open Inspect/Console to check the logs. 

7. **Give it a few seconds for the browser to establish the connection before trying out gamepad. You will see in browser console that the connection is established and data channel is opened with hello world message sent from browser and receieved in python. Then you can move the joystick**
