import { geocodeAddress } from "./src/services/geoCodingService.js";

try {
  const result = await geocodeAddress("Tour Eiffel, Paris");
  console.log(result);
} catch (error) {
  console.error("Erreur :", error.message);
}