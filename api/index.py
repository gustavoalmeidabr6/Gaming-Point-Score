from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

# --- NOVAS IMPORTAÇÕES PARA O BANCO DE DADOS ---
from sqlalchemy import create_engine, text, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError

# --- CONFIGURAÇÃO DO BANCO DE DADOS ---
# O Vercel automaticamente nos dá esta variável de ambiente
DATABASE_URL = os.environ.get('POSTGRES_URL')

# Configuração do "Motor" do SQLAlchemy
# O 'connect_args' é específico para o Vercel Postgres
engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})

# Cria uma sessão para conversar com o banco
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para nossos "Modelos" (as tabelas do banco)
Base = declarative_base()


# --- DEFINIÇÃO DAS NOSSAS TABELAS ---
# Modelo 1: A tabela de Usuários
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    # (No futuro, adicionaríamos um campo de senha_hash)

# Modelo 2: A tabela de Reviews (Onde as notas serão salvas)
class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, nullable=False, index=True) # O ID do jogo (do Giant Bomb)
    game_name = Column(String) # Vamos salvar o nome para facilitar
    
    # Suas notas personalizadas
    narrativa = Column(Float)
    graficos = Column(Float)
    trilha_sonora = Column(Float)
    mecanica = Column(Float)
    # A média
    nota_geral = Column(Float)
    
    # A quem pertence esta review?
    owner_id = Column(Integer, ForeignKey("users.id"))


# --- FUNÇÃO PARA CRIAR AS TABELAS QUANDO A API INICIA ---
# (O Vercel pode não gostar disso em ambiente serverless, mas vamos tentar)
try:
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso (ou já existiam).")
except OperationalError as e:
    print(f"Erro ao conectar ou criar tabelas: {e}")
    # Isso pode falhar se o banco não estiver pronto, mas a API continua


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

# --- Endpoints da API (antigos e novos) ---

@app.get("/api/ola")
def get_hello():
    return {"mensagem": "Olá, direto do Backend Python!"}

@app.get("/api")
def get_root():
    return {"serviço": "API Perfil Gamer", "status": "online"}

# --- !!! NOSSO NOVO ENDPOINT DE TESTE DO BANCO !!! ---
@app.get("/api/test-db")
def test_db():
    try:
        # Abre uma sessão
        db = SessionLocal()
        # Executa uma consulta SQL simples
        result = db.execute(text("SELECT 'Conexão com o banco de dados bem-sucedida!'"))
        message = result.fetchone()[0]
        db.close()
        return {"database_status": message}
    except Exception as e:
        return {"error": f"Falha ao conectar ao banco: {e}"}

# --- !!! NOVO: CRIAR UM USUÁRIO DE TESTE !!! ---
@app.post("/api/create-user")
def create_test_user():
    db = SessionLocal()
    try:
        # Verifica se o usuário de teste já existe
        existing_user = db.query(User).filter(User.username == "usuarioteste").first()
        if existing_user:
            return {"message": "Usuário de teste já existe", "user_id": existing_user.id}
            
        # Cria um novo usuário
        new_user = User(email="teste@teste.com", username="usuarioteste")
        db.add(new_user)
        db.commit() # Salva a mudança no banco
        db.refresh(new_user) # Pega o ID que o banco gerou
        
        return {"message": "Usuário de teste criado!", "user_id": new_user.id}
    except Exception as e:
        db.rollback()
        return {"error": f"Erro ao criar usuário: {e}"}
    finally:
        db.close()


# --- Endpoints de Jogo (Sem Mudanças) ---
@app.get("/api/search")
def search_games(q: str | None = None):
    # (Código da busca do Giant Bomb - sem mudanças)
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
    # (Código dos detalhes do Giant Bomb - sem mudanças)
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