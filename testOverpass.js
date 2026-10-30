import { fetchActivities } from "./src/services/overpassService.js";

const activities = await fetchActivities(
  48.953,
  2.308,
  1000
);

console.log("Nombre trouvé :", activities.length);
console.log(activities);