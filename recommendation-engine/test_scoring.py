from scoring import recommend_activities

# Activités fictives
activities = [
    {
        "id": 1,
        "name": "Badminton",
        "distance": 1000,
        "categories": [{"id": 4, "name": "Sport"}],
        "indoor_outdoor": "indoor",
        "fee": False
    },
    {
        "id": 2,
        "name": "Cinéma",
        "distance": 500,
        "categories": [{"id": 1, "name": "Culture"}],
        "indoor_outdoor": "indoor",
        "fee": True
    }
]

# Préférences de l'utilisateur
preferences = {
    "category": "Sport",
    "radiusMeters": 5000,
    "indoor_outdoor": "indoor",
    "free_only": True
}

results = recommend_activities(activities, preferences)

for activity in results:
    print(activity["name"], ":", activity["score"], "points")