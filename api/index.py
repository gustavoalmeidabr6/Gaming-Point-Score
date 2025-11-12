from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

# --- NOVAS IMPORTAÇÕES PARA O BANCO DE DADOS ---
from sqlalchemy import create_engine, text, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError

# --- CONFIGURAÇÃO DO BANCO DE DADOS ---
DATABASE_URL = os.environ.get('POSTGRES_URL')

# Verifica se a URL do banco foi carregada
if not DATABASE_URL:
    print("ERRO FATAL: Variável de ambiente POSTGRES_URL não encontrada.")
    # Isso fará a API falhar, mas saberemos o porquê nos logs.
    
engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# --- DEFINIÇÃO DAS NOSSAS TABELAS (Modelos - Sem mudança) ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, nullable=False, index=True) 
    game_name = Column(String) 
    narrativa = Column(Float)
    graficos = Column(Float)
    trilha_sonora = Column(Float)
    mecanica = Column(Float)
    nota_geral = Column(Float)
    owner_id = Column(Integer, ForeignKey("users.id"))

# --- !!! LINHA PROBLEMÁTICA REMOVIDA DAQUI !!! ---
# Base.metadata.create_all(bind=engine) <-- REMOVIDO


# --- INÍCIO DA APLICAÇÃO FASTAPI ---
GIANTBOMB_API_KEY = os.environ.get('GIANTBOMB_API_KEY')
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# --- Endpoints da API ---

@app.get("/api/ola")
def get_hello():
    return {"mensagem": "Olá, direto do Backend Python!"}

@app.get("/api")
def get_root():
    return {"serviço": "API Perfil Gamer", "status": "online"}

# --- !!! NOSSO NOVO ENDPOINT PARA CRIAR AS TABELAS !!! ---
@app.get("/api/create-tables")
def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        return {"message": "Tabelas criadas com sucesso (ou já existiam)!"}
    except Exception as e:
        return {"error": f"Erro ao criar tabelas: {e}"}

# --- ATUALIZADO: Teste do Banco ---
@app.get("/api/test-db")
def test_db():
    if not DATABASE_URL:
        return {"error": "POSTGRES_URL não foi encontrada no ambiente."}
    try:
        db = SessionLocal()
        result = db.execute(text("SELECT 'Conexão com o banco de dados bem-sucedida!'"))
        message = result.fetchone()[0]
        db.close()
        return {"database_status": message}
    except Exception as e:
        # Retorna um JSON válido em caso de erro
        return {"error": f"Falha ao conectar ao banco: {e}"}

# --- NOVO: Criar Usuário (Sem mudança) ---
@app.post("/api/create-user")
def create_test_user():
    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.username == "usuarioteste").first()
        if existing_user:
            return {"message": "Usuário de teste já existe", "user_id": existing_user.id}
            
        new_user = User(email="teste@teste.com", username="usuarioteste")
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {"message": "Usuário de teste criado!", "user_id": new_user.id}
    except Exception as e:
        db.rollback()
        return {"error": f"Erro ao criar usuário: {e}"}
    finally:
        db.close()

# --- Endpoints de Jogo (Sem Mudanças) ---
@app.get("/api/search")
def search_games(q: str | None = None):
    if not q: return {"error": "Nenhum termo de busca fornecido"}
    url = "https://www.giantbomb.com/api/search/"
    params = {'api_key': GIANTBOMB_API_KEY, 'format': 'json', 'query': q, 'resources': 'game', 'limit': 10}
    headers = { 'User-Agent': 'MeuPerfilGamerApp' }
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status() 
        data = response.json()
        return data['results']
    except requests.exceptions.RequestException as e:
        return {"error": f"Erro ao chamar a API externa: {e}"}

@app.get("/api/game/{game_id}")
def get_game_details(game_id: str):
    url = f"https://www.giantbomb.com/api/game/3030-{game_id}/"
    params = {'api_key': GIANTBOMB_API_KEY, 'format': 'json', 'field_list': 'name,deck,image,guid'}
    headers = { 'User-Agent': 'MeuPerfilGamerApp' }
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['results']
    except requests.exceptions.RequestException as e:
        return {"error": f"Erro ao buscar detalhes do jogo: {e}"}