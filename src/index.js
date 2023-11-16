const { Client, Events, GatewayIntentBits } = require('discord.js');

const builder = require('./builder.js');
const email = require('./email.js');
const sheets = require('./sheets.js');
const logger = require('./logger.js');
const util = require('./util.js');

const { token, channelId, roleId, allowedDomains, organization } = require('../config.json');

// create client with intents for discord application
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// set of acceptable domains
const AcceptedDomains = new Set(allowedDomains);

/*
create a map of users with user id as key and an object as value, object shown below

const user = {
    email: string,
    signature: string,
    verification: {
        code: long,
        attempts: int,
        time: string,
    },
};
*/
let users = new Map();

// performs when client is ready
client.on(Events.ClientReady, () => {
    console.log(`Currently logged in as ${client.user.tag}.\n`);
    logger.logger.info(`Application logged in as ${client.user.tag}.`);
});

// send welcome message and instructions when new user joins guild
client.on(Events.GuildMemberAdd, async (member) => {
    logger.logger.info(`${member.user.username} has joined the guild!`);
    await member.send({
        content: `Hello ${member.user.username}, welcome to ${organization}!`,
        embeds: [builder.WelcomeEmbed],
    });
});

// create initial message and embed
client.on(Events.MessageCreate, async (message) => {
    // return if message isn't 'verify' or isn't in intended channel
    if (message.channel.id != channelId || message.content != 'verify') return;
    
    // reply with embed and button
    await message.reply({
        embeds: [builder.InitialEmbed],
        components: [builder.InitialButton],
    });
});

// called on every interaction
client.on(Events.InteractionCreate, async (interaction) => {
    // return if interaction user already have role
    if (interaction.member.roles.cache.some(role => role.id === roleId)) {
        await interaction.reply({
            content: 'You have already completed Active Member Verification!', 
            ephemeral: true,
        });
        return;
    }

    // check if interation is a button click
    if (interaction.isButton()) {
        // check id of button interaction to see if it's initial button
        if (interaction.customId === 'initial-button') {
            await interaction.showModal(builder.InitialModal);
        }

        // check id of button interaction to see if it's email verification button
        if (interaction.customId === 'email-verification-button') {
            if (users.get(interaction.user.id).verification.code == null){
                console.log(users.get(interaction.user.id));
                logger.logger.warn(`${interaction.user.username} user verification code not stored in runtime.`);
                await interaction.reply({
                    content: 'Something went wrong, please retry from the beginning.', 
                    ephemeral: true,
                });
                return;
            }

            await interaction.showModal(builder.EmailModal);
        }
    }

    // check if interaction type is modal submit
    if (interaction.isModalSubmit()) {
        // defer reply to avoid interaction token time out
        await interaction.deferReply({ ephemeral: true });

        // check if the modal submit is from initial modal
        if (interaction.customId === 'initial-modal') {
            // obtain input from modal fields
            const emailInput = interaction.fields.getTextInputValue('email-input').trim();
            const signatureInput = interaction.fields.getTextInputValue('signature-input').trim();

            // validate email with regex
            const validateEmail = (email) => {
                return String(email)
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    );
            };

            if (!validateEmail(emailInput)) {
                logger.logger.info(`${interaction.user.username} has entered an invalid email: ${emailInput}.`);
                await interaction.followUp({
                    content: 'Invalid email format, please try again.',
                    ephemeral: true,
                });
                return;
            }

            // parse domain from user email input
            const validatedEmail = validateEmail(emailInput)[0];
            const domain = validatedEmail.split('@')[1];

            // return if user email isn't from an acceptable domain
            if (!AcceptedDomains.has(domain)) {
                logger.logger.info(`${interaction.user.username} has entered an email with invalid domain: ${validatedEmail}.`);
                await interaction.followUp({
                    content: 'Please resubmit the form with your university email.', 
                    ephemeral: true,
                });
                return;
            }
            
            // send email to user input email, append user id as key and generated code sent through email as value
            try {
                users.set(interaction.user.id, {
                    email: validatedEmail,
                    signature: signatureInput,
                    verification: { 
                        code: await email.verifyEmail(validatedEmail),
                        attempts: 1,
                        time: null,
                    }
                });
                console.log(users.get(interaction.user.id));
            } catch (error) {
                console.log(error);
                logger.logger.error(`${interaction.user.username} user request to SMTP server failed with email: ${validatedEmail}.`);

                await interaction.followUp({
                    content: 'Verification email failed to send, please contact a discord moderator to resolve this issue.',
                    ephemeral: true,
                });
                return;
            }

            builder.EmailEmbed.addFields(
                { name: 'Email', value: `${validatedEmail}` },
                { name: 'Signature', value: `${signatureInput}` },
            );
            
            await interaction.followUp({
                embeds: [builder.EmailEmbed],
                components: [builder.EmailButton], 
                ephemeral: true,
            });
        }

        // check if the modal submit is from email verification modal
        if (interaction.customId === 'email-verification-modal') {
            const codeInput = interaction.fields.getTextInputValue('code-input').trim();

            // get value of generated code corresponding to user id and compare value with user input code
            if (users.get(interaction.user.id).verification.code == codeInput) {
               // asign role if user verification code is correct
                interaction.member.roles.add(roleId);

                // append info to google sheets if email sent successfully
                try {
                    await sheets.write(interaction.user.username, users.get(interaction.user.id).email, users.get(interaction.user.id).signature);
                } catch (error) {
                    console.log(error);
                    logger.logger.error(`Failed to write ${interaction.user.username} user data to Google Sheets.`);
                }

                await interaction.member.send('You have completed Active Member Verification and unlocked channels. ' +
                'Please keep this DM as receipt.');

                const userData = users.get(interaction.user.id);
                users.set(interaction.user.id, { ...userData, verification: { code: null, attempts: 1, time: new Date().toLocaleString() } });

                logger.logger.info(`${interaction.member.user.username} is now an Active Member.`);
                await interaction.followUp({
                    content: 'You have completed Active Member Verification and unlocked channels!', 
                    ephemeral: true,
                });
                return;
            }

            // check if there are 3 or more current failed attempts
            if (users.get(interaction.user.id).verification.attempts >= 3) {
                const userData = users.get(interaction.user.id);
                users.set(interaction.user.id, { ...userData, verification: { ...userData.verification, code: null, attempts: 1 } });

                logger.logger.info(`${interaction.user.username} has entered incorrect code 3 times.`);
                await interaction.followUp({
                    content: 'You have entered the incorrect code too many times. Please retry from the beginning.', 
                    ephemeral: true,
                });
                return;
            }
            
            const userData = users.get(interaction.user.id);
            users.set(interaction.user.id, { 
                ...userData,
                verification: { 
                    ...userData.verification,
                    attempts: userData.verification.attempts + 1,
                },
            });

            logger.logger.info(`${interaction.member.user.username} has entered incorrect verification code.`);
            await interaction.followUp({
                content: 'Your verification code is incorrect, please try again!', 
                ephemeral: true,
            });
        }
    }
});

client.login(token);