import { registerVisitor } from '../services/visitorService.js';

export const createVisitorController = async (req, res) => {
  try {
    const { firstName } = req.body;
    const visitor = await registerVisitor(firstName);

    return res.status(201).json({
      message: 'Visiteur enregistré avec succès',
      data: visitor,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Erreur lors de la création du visiteur.',
    });
  }
};