# Discord Member Verification

### Automate discord verification process using nodemailer/SMTP server to verify email, assign role with Discord.js, and store member information using Google Sheets API.

## **Setup**

### **Prerequisite**

Node.js v18.13.0 or above

### **Automatic Configuration** (May not work)

Run the below command from the root directory:

```
sh install.sh
```

### **Manual Configuration**

Clone this repository to local machine using 

```
git clone https://github.com/SapphireGaze/discord-verification.git
cd discord-verification/
```

and change directory into the cloned repository.
Install the required dependencies by running 

```
npm ci 
```

from the current repository.
Then, create a new file at the root of the repository named `config.json` (check `sample.json` format), and the content of the file should follow the below JSON format:

```
{
   "token": "YOUR-TOKEN-HERE",
   "channelId": "YOUR-CHANNEL-ID",
   "roleId": "YOUR-ROLE-ID",
   "spreadsheetId": "YOUR-SPREADSHEET-ID",
   "allowedDomains": [
       "YOUR-DOMAIN-1",
       "YOUR-DOMAIN-2",
       ...
   ],
   "senderEmail": "\"YOUR-ORGANIZATION NAME\" <no-reply@YOUR-DOMAIN>",
   "organization": "YOUR-ORGANIZATION NAME"
}
```

After the configuration, save the file and change into `src` directory with the below command:

```
cd src/
```

and open `email.js`, change the nodemailer transporter to the designated SMTP server with the correct port and protocols.
Then, change into `templates` directory 

```
cd templates/
```

and create `agreement.txt` (store your server user agreement) and create `welcome.txt` (store message to send to user on join). 
Then you can save the files, and run the following command to start the bot! 

``` 
cd ../
node index.js
```

Type "verify" in the channel corresponding to the configured channel id to show the initial modal!!

### **Google Cloud Platform**

Create a new project in [Google Cloud Platform](https://console.cloud.google.com/getting-started). Then, enable Google Sheets API in `APIs & Services`. Then navigate to `IAM & Admin > Service Accounts` and create a new service account. After the service account is created, proceed to `Manage Keys` for that account and create a new key. Rename the file as `credentials.json` and move the file to the root of this repository. Make sure to share the Google Sheets with the service account created as **Editor**.

### **Discord Developer Portal**

Create a new application in [Discord Developer Portal](https://discord.com/developers/applications), then navigate to `Bot` and enable `Server Members Intent` **AND** `Message Content Intent` under `Privileged Gateway Intents`. Finally, click on `Reset Token` and copy the token as `token` into the `config.json` file previously created.   
Add the following permission when inviting the bot to the server:
- Manage Roles
- Manage Channels
- Read Messages/View Channels
- Send Messages
- Send TTS Messages
- Manage Messages
- Embed Links
- Read Message History

Make sure the bot's default role is above the target role permissions you want the bot to edit!!