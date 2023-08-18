# Discord Member Verification

### Automate discord verification process using nodemailer/SMTP server to verify email, assign role with Discord.js, and store member information using Google Sheets API.

## **Setup**

### **Prerequisite**

Node.js v18.13.0 or above

### **General Configuration**

Clone this repository to local machine using 

```
git clone https://github.com/SapphireGaze/discord-verification
cd discord-verification
```

and change directory into the cloned repository.
Intsall the required dependencies by running 

```
npm ci 
```

from the current repository.
Then, create a new file at the root of the repository named `config.json`, and the content of the file should follow the below format:

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

After the configuration, change into `src` directory

```
cd src/
```

and open `email.js`, change the nodemailer transporter to your desired SMTP server with the correct port.
Then you can save the file, and run the following command to start the bot! 

``` 
node index.js
```

Type "verify" in the channel corresponding to your specified channel id to show the modal!!

### **Google Cloud Platform**

Create a new project in [Google Cloud Platform](https://console.cloud.google.com/getting-started). Then, enable Google Sheets API in `APIs & Services`. Then navigate to `IAM & Admin > Service Accounts` and create a new service account. After the service account is created, proceed to `Manage Keys` for that account and create a new key. Rename the file as `credentials.json` and move the file to the root of this repository. Make sure to share the Google Sheets with the service account created as **Editor**.

### **Discord Developer Portal**

Create a new application in [Discord Developer Portal](https://discord.com/developers/applications), then navigate to `Bot` and enable `Server Members Intent` **AND** `Message Content Intent` under `Privileged Gateway Intents`. Finally, click on `Reset Token` and copy the token as `token` into the `config.json` file previously created.                                                                                                                 