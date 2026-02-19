import { TrustedContact } from '../models/TrustedContact.js';

export const listContacts = async (req, res) => {
  const contacts = await TrustedContact.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json(contacts);
};

export const addContact = async (req, res) => {
  const contact = await TrustedContact.create({ ...req.body, userId: req.user.userId });
  res.status(201).json(contact);
};

export const deleteContact = async (req, res) => {
  await TrustedContact.findOneAndDelete({ _id: req.params.contactId, userId: req.user.userId });
  res.status(204).send();
};
