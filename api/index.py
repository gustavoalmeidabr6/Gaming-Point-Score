from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

GIANTBOMB_API_KEY = os.environ.get('GIANTBOMB_API_KEY')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# --- Funções Padrão (Sem Mudanças) ---
@app.get("/api/ola")
def get_hello():
    return {"mensagem": "Olá, direto do Backend Python!"}

@app.get("/api")
def get_root():
    return {"serviço": "API Perfil Gamer", "status": "online"}

# --- Endpoint de Busca (Sem Mudanças) ---
@app.get("/api/search")
def search_games(q: str | None = None):
    if not q:
        return {"error": "Nenhum termo de busca fornecido"}
    
    url = "https://www.giantbomb.com/api/search/"
    params = {
        'api_key': GIANTBOMB_API_KEY,
        'format': 'json',
        'query': q,
        'resources': 'game',
        'limit': 10
    }
    headers = { 'User-Agent': 'MeuPerfilGamerApp' }
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status() 
        data = response.json()
        return data['results']
    except requests.exceptions.RequestException as e:
        return {"error": f"Erro ao chamar a API externa: {e}"}

# --- !!! NOSSO NOVO ENDPOINT DE DETALHES !!! ---
@app.get("/api/game/{game_id}")
def get_game_details(game_id: str):
    # O ID do jogo no Giant Bomb é "3030-XXXX". O frontend vai passar só o XXXX.
    # Mas a API de detalhes usa o ID completo. A API de busca já nos deu o "guid" (ID completo)
    # Ah, espera, a API de busca não dá o ID completo...
    # Vamos corrigir: A API de busca retorna o 'id' (ex: 26848).
    # A API de detalhes usa o 'guid' (ex: 3030-26848).
    # Vamos simplificar por agora e assumir que o frontend vai nos dar o ID numérico.
    
    # A URL da API de detalhes do jogo é diferente.
    url = f"https://www.giantbomb.com/api/game/3030-{game_id}/"
    
    params = {
        'api_key': GIANTBOMB_API_KEY,
        'format': 'json',
        'field_list': 'name,deck,image,guid' # Pedindo só os campos que queremos
    }
    headers = { 'User-Agent': 'MeuPerfilGamerApp' }
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        # A API de detalhes retorna o jogo dentro de "results"
        return data['results']
        
    except requests.exceptions.RequestException as e:
        return {"error": f"Erro ao buscar detalhes do jogo: {e}"}