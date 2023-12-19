# Discord Member Verification

![image of an discord verification web portal](/src/resources/verification.png "verification modal example")

- Full stack application implemented with **Next.js** and **Discord.js** to automate discord member verification process and improves workflow by 90%.
- Leveraged the internal **SMTP** server to better queue verification emails during the delivery process, leading to an increase in speed of about 30%.
- Utilized **SQLite3** database for simple yet efficient user data storage/querying and **Docker** to containerize the application for ease of deployment.

## **Setup**

### **Prerequisite**

[Docker](https://www.docker.com/) Version 20.10.25 or above

### **Google Cloud Platform**

Create a new project in [Google Cloud Platform](https://console.cloud.google.com/getting-started). 

Then, enable Google Sheets API in `APIs & Services`. Then navigate to `IAM & Admin > Service Accounts` and create a new service account. 

After the service account is created, proceed to `Manage Keys` for that account and create a new key. 

Rename the file as `credentials.json` and move the file to the root of this repository. Make sure to share the Google Sheets with the service account created as **Editor**.

### **Discord Developer Portal**

Create a new application in [Discord Developer Portal](https://discord.com/developers/applications), then navigate to `Bot` and enable `Server Members Intent` **AND** `Message Content Intent` under `Privileged Gateway Intents`. 

Finally, click on `Reset Token` and copy the token as `token` into the `.env` file mentioned in the General Configuration below.   

Add the following permission when inviting the bot to the server:

- Manage Roles
- Manage Channels
- Read Messages/View Channels
- Send Messages
- Send TTS Messages
- Manage Messages
- Embed Links
- Read Message History

**Make sure the bot's default role is above the target role permissions for the bot to manage the target role!!**

### **General Configuration**

Clone this repository to local machine using 

```
git clone https://github.com/SapphireGaze/discord-verification.git
cd discord-verification/
```

and change directory into the repository.

Create a `.env` file (check `.env.example` stored at root of the repository for format), and a `domains.json` file at the root of the repository, following the below JSON format for the domains of whitelisted emails:

```
{
    "allowedDomains": [
        "domain1.com",
        "domain2.com",
        ...
    ]
}
```

After creating and setting up the above files, open the `transporter.json` file stored at the root of the repository and modify the configuration for preferred SMTP server.

### **Optional Configuration**

Change into `templates` directory 

```
cd /src/backend/templates/
```

and create `agreement.txt` (store server user agreement) and create `welcome.txt` (store message to send to user on join) if custimization of agreement and welcome messages is needed. 

## Installation

Once all the above configuration is finished, change directory back to the root of the repository and run the below command to start the bot!

**Note: `.env`, `credentials.json`, `domains.json`, and `transporter.json` are required setup before running `install.sh`.**

```
sh install.sh
```

Type "**!verify**" in the channel corresponding to the configured channel id to show the initial modal!

The Discord Verification Web Portal will be viewable on port 3000 of localhost or 127.0.0.1!!