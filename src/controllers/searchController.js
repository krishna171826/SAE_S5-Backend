import { processSearch } from '../services/searchService.js';

export async function handleSearch(req, res) {
  try {
    const { address, radius, visitorId, indoor_outdoor, category, free_only } = req.body;

    if (!address) {
      return res.status(400).json({ 
        success: false, 
        error: "L'adresse est obligatoire pour lancer une recherche." 
      });
    }

    if (
      radius === undefined ||
      radius === null ||
      String(radius).trim() === "" ||
      !Number.isFinite(Number(radius)) ||
      Number(radius) <= 0
    ) {
    return res.status(400).json({
      success: false,
      error: "Veuillez saisir un rayon valide."
    });
  }

    const preferences = {
      category: category || null,
      indoor_outdoor: indoor_outdoor || null,
      free_only: free_only === true
    };

    const result = await processSearch({
      address,
      radius,
      visitorId,
      preferences
    });

    res.status(201).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Erreur dans handleSearch : ', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}