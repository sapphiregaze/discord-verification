const fs = require('fs');
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
} = require('discord.js');

const { organization } = require('../config.json');

// get welcome message
const welcome = fs.readFileSync('./templates/welcome.txt').toString();

// build welcome embed sent through DMs
const WelcomeEmbed = new EmbedBuilder()
    .setColor(0xCFC2E9)
    .setTitle(`Welcome to ${organization}`)
    .setURL('https://github.com/SapphireGaze/discord-verification')
    .setAuthor({
        name: `${organization}`, 
        iconURL: 'https://logodix.com/logo/557580.png', 
    })
    .setDescription(welcome);

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
        'Please enter the code below to confirm your information is correct.');

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

module.exports = { 
    WelcomeEmbed, 
    InitialButton, 
    InitialEmbed, 
    InitialModal, 
    EmailButton, 
    EmailEmbed, 
    EmailModal,
};