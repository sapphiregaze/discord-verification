
# install dependencies 
sudo apt install -y npm
npm ci 


cd src
sed "s/WorkingDirectory=/WorkingDirectory=$PWD/g" discord-verification.service | sed "s/ExecStart=/ExecStart=node $PWD\/index.js/g" - | sudo tee /etc/systemd/system/discord-verification.service 


if [ ! -f config.json ]
then
   read BOT_TOKEN
   sed "s/YOUR-TOKEN-HERE/$BOT_TOKEN/g" sample.json | tee config.json
   sudo systemctl start discord-verification
else
   echo "Found config file!"
   echo "Run 'sudo systemctl start discord-verification' after adding configuration file."   
fi


sudo systemctl enable discord-verification




