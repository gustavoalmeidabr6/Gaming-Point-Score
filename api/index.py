from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

# Importações do SQLAlchemy
from sqlalchemy import create_engine, text, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.exc import OperationalError

# --- CONFIGURAÇÃO "PREGUIÇOSA" (LAZY) ---

# Deixamos as variáveis globais como 'None'
# Elas só serão inicializadas na primeira vez que um endpoint for chamado
engine = None
SessionLocal = None
Base = declarative_base()

# --- DEFINIÇÃO DAS TABELAS (Modelos) ---
# (Isso pode ser definido globalmente sem problemas)
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


# --- FUNÇÃO DE DEPENDÊNCIA (A "MÁGICA") ---
# Isso vai inicializar o banco e dar uma sessão para CADA endpoint que pedir
def get_db():
    global engine, SessionLocal
    
    try:
        # Só inicializa na primeira vez
        if engine is None:
            DATABASE_URL = os.environ.get('POSTGRES_URL')
            if not DATABASE_URL:
                raise ValueError("POSTGRES_URL não foi encontrada no ambiente.")
            
            engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})
            SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
            print("Conexão com o banco inicializada.")

        # Abre uma nova sessão
        db = SessionLocal()
        yield db # Entrega a sessão para o endpoint
    
    finally:
        if db:
            db.close() # Fecha a sessão quando o endpoint termina

# --- INÍCIO DA APLICAÇÃO FASTAPI ---
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

# --- NOVO: Criar Tabelas ---
@app.get("/api/create-tables")
def create_tables(db: Session = Depends(get_db)): # Pede a sessão do banco
    try:
        global engine
        # O Base.metadata precisa do 'engine' que foi criado no get_db
        Base.metadata.create_all(bind=engine)
        return {"message": "Tabelas criadas com sucesso (ou já existiam)!"}
    except Exception as e:
        return {"error": f"Erro ao criar tabelas: {e}"}

# --- ATUALIZADO: Teste do Banco ---
@app.get("/api/test-db")
def test_db(db: Session = Depends(get_db)): # Pede a sessão do banco
    try:
        result = db.execute(text("SELECT 'Conexão com o banco de dados bem-sucedida!'"))
        message = result.fetchone()[0]
        return {"database_status": message}
    except Exception as e:
        return {"error": f"Falha ao conectar ao banco: {e}"}

# --- ATUALIZADO: Criar Usuário ---
@app.post("/api/create-user")
def create_test_user(db: Session = Depends(get_db)): # Pede a sessão do banco
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

# --- Endpoints de Jogo (Sem Mudanças de Lógica) ---
# Apenas adicionamos a checagem da chave da API aqui
def get_api_key():
    GIANTBOMB_API_KEY = os.environ.get('GIANTBOMB_API_KEY')
    if not GIANTBOMB_API_KEY:
        raise ValueError("GIANTBOMB_API_KEY não encontrada.")
    return GIANTBOMB_API_KEY

@app.get("/api/search")
def search_games(q: str | None = None, api_key: str = Depends(get_api_key)):
    if not q: return {"error": "Nenhum termo de busca fornecido"}
    url = "https://www.giantbomb.com/api/search/"
    params = {'api_key': api_key, 'format': 'json', 'query': q, 'resources': 'game', 'limit': 10}
    headers = { 'User-Agent': 'MeuPerfilGamerApp' }
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status() 
        data = response.json()
        return data['results']
    except requests.exceptions.RequestException as e:
        return {"error": f"Erro ao chamar a API externa: {e}"}

@app.get("/api/game/{game_id}")
def get_game_details(game_id: str, api_key: str = Depends(get_api_key)):
    url = f"https://www.giantbomb.com/api/game/3030-{game_id}/"
    params = {'api_key': api_key, 'format': 'json', 'field_list': 'name,deck,image,guid'}
    headers = { 'User-Agent': 'MeuPerfilGamerApp' }
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['results']
    except requests.exceptions.RequestException as e:
        return {"error": f"Erro ao buscar detalhes do jogo: {e}"}