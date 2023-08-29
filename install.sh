# install dependencies 

sudo apt update -y  || {
   echo "Failed to run 'apt update', aborting bot install "
   exit 1; 
}

sudo apt install -y nodejs npm || {
   echo "Failed to run 'apt install nodejs npm', aborting bot install "
   exit 1; 
}

npm install || {
   echo "Failed to run 'npm install', aborting bot install "
   exit 1; 
}

npm ci || {
   echo "Failed to run 'npm ci', aborting bot install "
   exit 1; 
}

sudo n stable || {
   echo "Failed to run 'sudo n stable', aborting bot install "
   exit 1; 
}

# replace `which node` with /usr/local/bin/node if sudo n stable runs
cd src
sed "s@WorkingDirectory=@WorkingDirectory=$PWD@g" ../discord-verification.service | sed "s@ExecStart=@ExecStart=`which node` $PWD\/index.js@g" | sudo tee /etc/systemd/system/discord-verification.service 

if [ ! -f ../config.json ]
then
   read BOT_TOKEN
   sed "s/YOUR-TOKEN-HERE/$BOT_TOKEN/g" ../sample.json | tee ../config.json
else
   echo "Found config file!"   
fi

if [ ! -f ../credentials.json ]
then
   echo "Sheet credentials found!"
else
   echo "Sheet credentials NOT found! Please add credentials.json to root of project."
fi

echo "Run 'sudo systemctl start discord-verification' after adding configuration file."   

sudo systemctl enable discord-verification