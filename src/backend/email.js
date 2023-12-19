const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const util = require('./logger.js');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// create transporter for nodemailer
const transporterConfig = require('../../transporter.json');
const transporter = nodemailer.createTransport(transporterConfig);

// generate 6 digits random code
function generateCode() {
    return Math.floor(Math.random() * (999999 - 100000) + 100000);
}

// replace default 000000 code in html page with random generated code
function modifyHTML(code) {
    // get verification email html content and load content 
    let html = fs.readFileSync(path.join(__dirname, 'templates', 'verification.html')).toString();
    const $ = require('cheerio').load(html);

    const replaceRegex = /000000/;

    const getTextNodes = (elem) => elem.type === 'text'?[]:
        elem.contents().toArray()
        .filter(el => el !== undefined)
        .reduce((acc, el) =>
            acc.concat(...el.type === 'text' ? [el] : getTextNodes($(el))), []);

    getTextNodes($('html'))
        .filter(node => $.html(node).match(replaceRegex))
        .map(node => $(node).replaceWith($.html(node).replace(replaceRegex, `${code}`)));

    html = $.html();

    return html;
}

// send email to passed in parameter address with modified verification html and return generated code
module.exports.verifyEmail = async function (receiverEmail) {
    const code = generateCode();
    const html = modifyHTML(code);

    const info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: receiverEmail,
        subject: 'Discord Member Verification Code',
        html: html,
    });
    util.logger.info(`Email sent to ${receiverEmail}: ${info.messageId} with the verification code ${code}.`);

    return code;
}