# build dockerfile into docker image
sudo docker build . -t service/discord-verification

# write pwd into service file and store file in systemd
sed "s@WorkingDirectory=@WorkingDirectory=$PWD@g" ../discord-verification.service | sudo tee /etc/systemd/system/discord-verification.service 

# enable service
sudo systemctl enable discord-verification

# check if service and docker container functions
sudo systemctl status discord-verification
sudo docker ps -a