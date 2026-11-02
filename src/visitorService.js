import { createVisitor } from '../models/visitorModel.js';

export const registerVisitor = async (firstName) => {
  if (!firstName || typeof firstName !== 'string') {
    throw new Error('Le prénom est obligatoire.');
  }

  const cleanedName = firstName.trim();

  if (cleanedName.length < 2 || cleanedName.length > 50) {
    throw new Error('Le prénom doit contenir entre 2 et 50 caractères.');
  }

  const newVisitor = await createVisitor(cleanedName);
  return newVisitor;
};