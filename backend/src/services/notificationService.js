import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { env } from '../config/env.js';

const twilioClient = env.twilio.accountSid && env.twilio.authToken
  ? twilio(env.twilio.accountSid, env.twilio.authToken)
  : null;

const smtpTransport = env.smtp.host && env.smtp.user
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      auth: { user: env.smtp.user, pass: env.smtp.pass }
    })
  : null;

export const sendSms = async (to, message) => {
  if (!twilioClient || !to) return;
  await twilioClient.messages.create({ body: message, from: env.twilio.fromNumber, to });
};

export const sendEmail = async (to, subject, message) => {
  if (!smtpTransport || !to) return;
  await smtpTransport.sendMail({ from: env.smtp.user, to, subject, text: message });
};
