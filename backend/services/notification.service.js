import twilio from 'twilio';
import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

let twilioClient;
if (config.twilio.accountSid && config.twilio.authToken) {
  twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);
}

let transporter;
if (config.email.user && config.email.pass) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email.user,
      pass: config.email.pass
    }
  });
}

/**
 * Sends a WhatsApp notification with the generated token
 * @param {string} phone 
 * @param {Object} tokenDoc 
 */
export async function sendWhatsAppNotification(phone, tokenDoc) {
  if (!twilioClient || !config.twilio.whatsappNumber) {
    console.warn('Twilio not configured. Skipping WhatsApp notification.');
    return;
  }

  let formattedPhone = phone;
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = `+91${formattedPhone}`;
  }

  const message = `Hello ${tokenDoc.user.name},\n\nYour purchase was successful.\n\nToken: *${tokenDoc.tokenId}*\n\nKeep this token safe for verification.\n\nThree13 Fitness`;

  try {
    await twilioClient.messages.create({
      body: message,
      from: config.twilio.whatsappNumber,
      to: `whatsapp:${formattedPhone}`
    });
    console.log(`WhatsApp message sent to ${formattedPhone}`);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}

/**
 * Sends an email notification with the generated token
 * @param {string} email 
 * @param {Object} tokenDoc 
 */
export async function sendEmailNotification(email, tokenDoc) {
  if (!transporter) {
    console.warn('Nodemailer not configured. Skipping email notification.');
    return;
  }

  const mailOptions = {
    from: config.email.user,
    to: email,
    subject: `Your Three13 Fitness Purchase Token: ${tokenDoc.tokenId}`,
    html: `
      <h2>Purchase Successful</h2>
      <p>Hello ${tokenDoc.user.name},</p>
      <p>Your purchase for <strong>${tokenDoc.itemName}</strong> was successful.</p>
      <p>Here is your unique verification token:</p>
      <h3 style="background: #f4f4f4; padding: 10px; display: inline-block;">${tokenDoc.tokenId}</h3>
      <p>Please keep this token safe.</p>
      <br/>
      <p>Thank you,<br/>Three13 Fitness</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

/**
 * Triggers both WhatsApp and Email notifications
 */
export async function sendPurchaseNotifications(tokenDoc) {
  const promises = [];
  if (tokenDoc.user.phone) {
    promises.push(sendWhatsAppNotification(tokenDoc.user.phone, tokenDoc));
  }
  if (tokenDoc.user.email) {
    promises.push(sendEmailNotification(tokenDoc.user.email, tokenDoc));
  }
  
  await Promise.allSettled(promises);
}
