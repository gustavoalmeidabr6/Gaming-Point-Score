from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

# Pega a NOVA chave da API que salvamos no Vercel
GIANTBOMB_API_KEY = os.environ.get('GIANTBOMB_API_KEY')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# ---- Endpoint antigo (ainda funciona) ----
@app.get("/api/ola")
def get_hello():
    return {"mensagem": "Olá, direto do Backend Python!"}

# ---- Endpoint raiz (ainda funciona) ----
@app.get("/api")
def get_root():
    return {"serviço": "API Perfil Gamer", "status": "online"}

# ---- NOSSO ENDPOINT DE BUSCA (ATUALIZADO) ----
@app.get("/api/search")
def search_games(q: str | None = None):
    if not q:
        return {"error": "Nenhum termo de busca fornecido"}
    
    # URL da API Giant Bomb
    url = "https://www.giantbomb.com/api/search/"
    
    # Parâmetros necessários para o Giant Bomb
    params = {
        'api_key': GIANTBOMB_API_KEY,
        'format': 'json', # Queremos a resposta em JSON
        'query': q,
        'resources': 'game', # Queremos buscar apenas "jogos"
        'limit': 10 # Limitar a 10 resultados
    }
    
    # O Giant Bomb exige um User-Agent.
    headers = {
        'User-Agent': 'MeuPerfilGamerApp'
    }
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status() 
        
        data = response.json()
        
        # O Giant Bomb retorna os jogos dentro de "results"
        return data['results']

    except requests.exceptions.RequestException as e:
        return {"error": f"Erro ao chamar a API externa: {e}"}