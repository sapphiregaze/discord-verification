const fs = require('fs');
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    Events,
    GatewayIntentBits,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
} = require('discord.js');

const email = require('./email.js');
const sheets = require('./sheets.js');
const util = require('./logger.js');

const { token, channelId, roleId, allowedDomains, organization } = require('../config.json');

// create client for discord application
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// send welcome message and instructions when new user joins guild
client.on(Events.GuildMemberAdd, async (member) => {
    const welcome = fs.readFileSync('./templates/welcome.txt').toString();

    const WelcomeEmbed = new EmbedBuilder()
        .setColor(0xCFC2E9)
        .setTitle(`Welcome to ${organization}`)
        .setURL('https://github.com/SapphireGaze/discord-verification')
        .setAuthor({
            name: `${organization}`, 
            iconURL: 'https://logodix.com/logo/557580.png', 
        })
        .setDescription(welcome);

    util.logger.info(`${member.user.username} has joined the guild!`);
    await member.send({
        content: `Hello ${member.user.username}, welcome to ${organization}!`,
        embeds: [WelcomeEmbed],
    });
});

// create a new map object to store user id as key and generated code as value
let generatedCode = new Map();

// create initial message and embed
client.on(Events.MessageCreate, async (message) => {
    // return if message isn't 'verify' or isn't in intended channel
    if (message.channel.id != channelId || message.content != 'verify') return;

    // embed initial description content, change to whatever
    const agreement = fs.readFileSync('./templates/agreement.txt').toString();

    // build initial button
    const InitialButton = new ActionRowBuilder();
    InitialButton.addComponents(
        new ButtonBuilder()
            .setCustomId('initial-button')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Active Member Verification'),
    );
    
    // build initial embed
    const InitialEmbed = new EmbedBuilder()
        .setColor(0xCFC2E9)
        .setTitle('Active Member Verification')
        .setURL('https://github.com/SapphireGaze/discord-verification')
        .setAuthor({
            name: `${organization}`, 
            iconURL: 'https://logodix.com/logo/557580.png', 
        })
        .setDescription(agreement);
    
    // reply with embed and button
    await message.reply({
        embeds: [InitialEmbed],
        components: [InitialButton],
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
            // build initial modal
            const InitialModal = new ModalBuilder()
                .setCustomId('initial-modal')
                .setTitle('Active Member Verification')
                .addComponents([
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('email-input')
                            .setLabel('University Email')
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder('E.g. adalovelace@universitydomain.edu')
                            .setRequired(true),
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('signature-input')
                            .setLabel('Signature')
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder('E.g. Ada Lovelace')
                            .setRequired(true),
                    ),
                ]);

            await interaction.showModal(InitialModal);
        }

        // check id of button interaction to see if it's email verification button
        if (interaction.customId === 'email-verification-button') {
            // return if user id is not a key in generatedCode map
            if (!generatedCode.has(interaction.user.id)){
                util.logger.warn(`${interaction.user.username} user data not stored in runtime.`);
                await interaction.reply({
                    content: 'Something went wrong, please restart from the beginning.', 
                    ephemeral: true,
                });
                return;
            }

            // build email verification modal
            const EmailModal = new ModalBuilder()
                .setCustomId('email-verification-modal')
                .setTitle('Email Verification')
                .addComponents([
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('code-input')
                            .setLabel('Email Verification Code')
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder('E.g. 123456')
                            .setRequired(true),
                    ),
                ]);

            await interaction.showModal(EmailModal);
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

            // parse domain from user email input
            const emailUsername = emailInput.split('@')[0];
            const domain = emailInput.split('@')[1];

            const userEmail = emailUsername + '@' + domain;

            // set of acceptable domains
            const AcceptedDomains = new Set(allowedDomains);

            // return if user email isn't from an acceptable domain
            if (!AcceptedDomains.has(domain)) {
                util.logger.info(`${interaction.user.username} has entered an invalid email: ${userEmail}.`);
                await interaction.followUp({
                    content: 'Please resubmit the form with your university email.', 
                    ephemeral: true,
                });
                return;
            }

            // build email verification button
            const EmailButton = new ActionRowBuilder();
            EmailButton.addComponents(
                new ButtonBuilder()
                    .setCustomId('email-verification-button')
                    .setStyle(ButtonStyle.Success)
                    .setLabel('Enter Email Verification Code'),
            );
            
            // build email verification info embed
            const EmailEmbed = new EmbedBuilder()
                .setColor(0xCFC2E9)
                .setTitle('Email Verification')
                .setURL('https://github.com/SapphireGaze/discord-verification')
                .setAuthor({
                    name: `${organization}`, 
                    iconURL: 'https://logodix.com/logo/557580.png', 
                })
                .setDescription('You will receive an email with a code shortly. ' +
                    'Please enter the code below to confirm your information is correct.')
                .addFields(
                    { name: 'Email', value: `${userEmail}` },
                    { name: 'Signature', value: `${signatureInput}` },
                );
            
            // send email to user input email, append user id as key and generated code sent through email as value
            try {
                generatedCode.set(interaction.user.id, await email.verifyEmail(userEmail));
            } catch (error) {
                console.log(error);
                util.logger.error(`${interaction.user.username} user request to SMTP server failed with email: ${userEmail}.`);

                await interaction.followUp({
                    content: 'Verification email failed to send, please contact a discord moderator to resolve this issue.',
                    ephemeral: true,
                });
                return;
            }
            
            // append info to google sheets if email sent successfully
            try {
                await sheets.write(interaction.user.username, userEmail, signatureInput);
            } catch (error) {
                console.log(error);
                util.logger.error(`Failed to write ${interaction.user.username} user data to Google Sheets.`);
            }
            
            await interaction.followUp({
                embeds: [EmailEmbed],
                components: [EmailButton], 
                ephemeral: true,
            });
        }

        // check if the modal submit is from email verification modal
        if (interaction.customId === 'email-verification-modal') {
            const codeInput = interaction.fields.getTextInputValue('code-input').trim();

            // get value of generated code corresponding to user id and compare value with user input code
            // if correct, assign role and delete user entry
            if (generatedCode.get(interaction.user.id) == codeInput) {
                interaction.member.roles.add(roleId);
                await interaction.member.send('You have completed Active Member Verification and unlocked channels. ' +
                'Please keep this DM as receipt.');

                // delete user entry from map
                generatedCode.delete(interaction.user.id);

                util.logger.info(`${interaction.member.user.username} is now an Active Member.`);
                await interaction.followUp({
                    content: 'You have completed Active Member Verification and unlocked channels!', 
                    ephemeral: true,
                });
                return;
            }

            util.logger.info(`${interaction.member.user.username} has entered incorrect verification code.`);
            await interaction.followUp({
                content: 'Your verification code is incorrect, please try again!', 
                ephemeral: true,
            });
        }
    }
});

client.on(Events.ClientReady, () => {
    console.log(`Currently logged in as ${client.user.tag}.\n`);
    util.logger.info(`Application logged in as ${client.user.tag}.`);
});

client.login(token);