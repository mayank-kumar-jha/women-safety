import { Router } from 'express';
import { addContact, deleteContact, listContacts } from '../controllers/contactController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);
router.get('/', listContacts);
router.post('/', addContact);
router.delete('/:contactId', deleteContact);

export default router;
