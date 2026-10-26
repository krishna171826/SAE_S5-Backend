FROM python:3.11-slim

WORKDIR /app

# Installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code Python
COPY . .

# Exposition du port FastAPI
EXPOSE 8000

# Lancement de l'application via Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]