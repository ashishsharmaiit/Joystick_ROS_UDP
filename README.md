# Joystick_ROS_UDP

This repo sends gamepad/joystick data fom Browser to ROS via TCP connection via a server.

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


2. Type the command node iceoffer.js to run the server file. The file should be already saved in the server. No need to copy it.

4. Change the server IP address in both the sender and receiver files as per the new IP from EC2. IP refreshes every time server is switched on, if it was off earlier. If it continued to run, then IP address shouldn't have changed.

5. Save both the sender files in the same folder in desktop. Open the sender html file in chrome. Open Inspect/Console to check the logs.

6. Copy the receiver python file in your catkin workspace, and then catkin_make. Install the dependencies, if not already installed. You might need to install dependencies like aiortc. Run roscore in one terminal. Run the python file using python3 receivegamepadudp.py in another terminal.
