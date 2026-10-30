import { fetchActivities } from "./src/services/overpassService.js";

const activities = await fetchActivities(48.953, 2.308, 500);

console.log("Nombre de lieux :", activities.length);

for (const activity of activities.slice(0, 10)) {
  console.log(
    activity.tags?.name || "Sans nom",
    activity.tags?.leisure ||
    activity.tags?.amenity ||
    activity.tags?.tourism ||
    activity.tags?.sport
  );
}