const fs = require('fs');
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    Events,
    GatewayIntentBits,
    InteractionType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
} = require('discord.js');

const email = require('./email.js');

const { token, channelId, roleId, allowedDomains } = require('../config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// create a new map object to store user id as key and generated code as value
let generatedCode = new Map();

// create initial message and embed
client.on(Events.MessageCreate, (message) => {
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
            name: 'Member Verification Bot', 
            iconURL: 'https://logodix.com/logo/557580.png', 
        })
        .setDescription(agreement);
    
    // reply with embed and button
    message.reply({
        embeds: [InitialEmbed],
        components: [InitialButton],
    });
});

// called on every interaction
client.on(Events.InteractionCreate, async (interaction) => {
    // return if interaction user already have role
    if (interaction.member.roles.cache.some(role => role.id === roleId)) {
        interaction.reply({
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
            
            // return if user id is not a key in generatedCode map
            if (!generatedCode.has(interaction.user.id)){
                interaction.reply({
                    content: 'Something went wrong, please try again from the beginning.', 
                    ephemeral: true,
                });
                return;
            }

            await interaction.showModal(EmailModal);
        }
    }

    // check if interaction type is modal submit
    if (interaction.type === InteractionType.ModalSubmit) {
        // check if the modal submit is from initial modal
        if (interaction.customId === 'initial-modal') {
            // obtain input from modal fields
            const emailInput = interaction.fields.getTextInputValue('email-input').trim();
            const signatureInput = interaction.fields.getTextInputValue('signature-input').trim();

            // parse domain from user email input
            const domain = emailInput.split('@')[1];

            // set of acceptable domains
            const AcceptedDomains = new Set(allowedDomains);

            // return if user email isn't from an acceptable domain
            if (!AcceptedDomains.has(domain)) {
                interaction.reply({
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
                    name: 'Member Verification Bot', 
                    iconURL: 'https://logodix.com/logo/557580.png', 
                })
                .setDescription('You will receive an email with a code shortly. ' +
                    'Please enter the code below to confirm your information is correct.')
                .addFields(
                    { name: 'Email', value: `${emailInput}` },
                    { name: 'Signature', value: `${signatureInput}` },
                )
            
            // send email to user input email, append user id as key and generated code sent through email as value
            generatedCode.set(interaction.user.id, await email.verifyEmail(emailInput).catch(console.error));
            
            interaction.reply({
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
                console.log(`${interaction.member.user.username} is now an Active Member.\n`);

                // delete user entry from map
                generatedCode.delete(interaction.user.id);

                interaction.reply({
                    content: 'You have completed Active Member Verification and unlocked channels!', 
                    ephemeral: true,
                });
                return;
            }

            interaction.reply({
                content: 'Your verification code is incorrect, please try again!', 
                ephemeral: true,
            });
        }
    }
});

client.on(Events.ClientReady, () => {
    console.log(`Currently logged in as ${client.user.tag}!\n`);
});

client.login(token);