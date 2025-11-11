from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Cria a aplicação
app = FastAPI()

# Configuração de CORS (Importante para conectar Front e Back)
# Permite que seu frontend (em um domínio diferente) chame esta API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite todas as origens (mude isso em produção)
    allow_credentials=True,
    allow_methods=["*"], # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"], # Permite todos os cabeçalhos
)

# Este é o seu primeiro "Endpoint"
# Quando o site acessar "URL_DO_SITE/api/ola"
# esta função vai rodar e retornar a mensagem.
@app.get("/api/ola")
def get_hello():
    return {"mensagem": "Olá, direto do Backend Python!"}

# Endpoint raiz (opcional, bom para testar)
@app.get("/api")
def get_root():
    return {"serviço": "API Perfil Gamer", "status": "online"}