// src/controllers/searchController.js
import { processSearch } from '../services/searchService.js';

export async function handleSearch(req, res) {
  try {
    const { address, radius, visitorId, indoor_outdoor } = req.body;

    if (!address) {
      return res.status(400).json({ 
        success: false, 
        error: "L'adresse est obligatoire pour lancer une recherche." 
      });
    }

    const result = await processSearch({
      address,
      radius,
      visitorId,
      indoor_outdoor
    });

    res.status(201).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("❌ Erreur dans handleSearch :", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}