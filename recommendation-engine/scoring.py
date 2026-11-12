# Cette fonction sert à calculer la note d'une seule activité.
def calculate_score(activity, preferences):
    score = 0

    # ici on verifie la catégorie qui peut avoir 40 points max.

    category = preferences.get("category")
    if category:
        categories = activity.get("categories") or []

        names = [
            c.get("name") if isinstance(c, dict) else c
            for c in categories
        ]

        if str(category).lower() in [str(name).lower() for name in names]:
            score += 40

    # 2e on calcule les point par rapport au distance, 30 points max. 
    radius = preferences["radiusMeters"]
    distance = activity.get("distance")

    if distance is not None and radius and radius > 0:
        score += 30 * max(0, 1 - distance / radius)

    # 3e on vérifie le intérieur / extérieur qui sera de 20 points max.
    if (preferences.get("indoor_outdoor")
            and activity.get("indoor_outdoor") == preferences["indoor_outdoor"]):
        score += 20

    # 4e la gratuité avec 10 points max
    if preferences.get("free_only") is True and activity.get("fee") is False:
        score += 10

    return round(score, 2)

# cette fonction sert a calculer les notes de toutes les activités et les classer
def recommend_activities(activities, preferences):
    results = []

    # Calculer le score de chaque activité
    for activity in activities:
        item = activity.copy()
        item["score"] = calculate_score(activity, preferences)
        results.append(item)

    # Trier du meilleur score au moins bon
    results.sort(key=lambda item: item["score"], reverse=True)

    # puis on ajoute la position dans le classement
    for rank, item in enumerate(results, start=1):
        item["rank"] = rank

    return results
