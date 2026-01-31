# 💰 Finance Manager API

API REST para gerenciamento de finanças pessoais com autenticação JWT, categorias personalizadas e relatórios financeiros completos.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---


* * *

## 🚀 Demonstração

**API em Produção:** [https://finance-manager-api-ykt7.onrender.com](https://finance-manager-api-ykt7.onrender.com)

**Frontend da Aplicação:** [https://finance-manager-frontend-vercel-ab5xh7p67.vercel.app](https://finance-manager-frontend-vercel-ab5xh7p67.vercel.app)

* * *

## 🛠️ Tecnologias

* **Node.js** - Runtime JavaScript
* **Express** - Framework web minimalista
* **PostgreSQL** - Banco de dados relacional
* **Sequelize** - ORM para Node.js
* **JWT (JSON Web Tokens)** - Autenticação segura
* **Bcrypt.js** - Criptografia de senhas
* **CORS** - Compartilhamento de recursos entre origens
* **Neon** - PostgreSQL serverless (hosting do banco)

* * *

## 📋 Funcionalidades

* ✅ **Autenticação JWT** - Sistema completo de login/registro
* ✅ **CRUD de Transações** - Gerenciamento de receitas e despesas
* ✅ **CRUD de Categorias** - Categorias personalizadas com cores
* ✅ **Relatórios Financeiros** - Agregações e análises SQL
* ✅ **Filtros Avançados** - Por data, tipo e categoria
* ✅ **Cálculo Automático** - Saldo, totais e percentuais
* ✅ **Backup/Restore** - Exportar e importar dados em JSON
* ✅ **Validação de Dados** - Proteção contra entradas inválidas
* ✅ **Relacionamentos SQL** - Foreign Keys e JOINs

* * *

## 🔗 Endpoints da API

### 🔐 Autenticação

    POST /api/auth/register - Criar nova conta
    POST /api/auth/login    - Fazer login

### 🗂️ Categorias (requer autenticação)

    GET    /api/categories     - Listar todas as categorias
    POST   /api/categories     - Criar nova categoria
    PUT    /api/categories/:id - Atualizar categoria
    DELETE /api/categories/:id - Deletar categoria

### 💰 Transações (requer autenticação)

    GET    /api/transactions     - Listar transações (com filtros opcionais)
    POST   /api/transactions     - Criar nova transação
    PUT    /api/transactions/:id - Atualizar transação
    DELETE /api/transactions/:id - Deletar transação

**Filtros disponíveis:**

* `?startDate=YYYY-MM-DD` - Data inicial
* `?endDate=YYYY-MM-DD` - Data final
* `?type=income|expense` - Tipo de transação
* `?categoryId=1` - ID da categoria

### 📊 Relatórios (requer autenticação)

    GET /api/reports/summary      - Resumo financeiro (receitas, despesas, saldo)
    GET /api/reports/by-category  - Agrupado por categoria
    GET /api/reports/monthly      - Evolução mensal do ano

### 💾 Backup (requer autenticação)

    GET  /api/backup/export - Exportar dados em JSON
    POST /api/backup/import - Importar dados de JSON

* * *

## 💻 Instalação Local

### Pré-requisitos

* Node.js 18+ instalado
* PostgreSQL ou conta no [Neon](https://neon.tech)
* Git

### Passo a passo

    # Clone o repositório
    git clone https://github.com/DiegoRapichan/finance-manager-api.git
    
    # Entre na pasta
    cd finance-manager-api
    
    # Instale as dependências
    npm install
    
    # Configure as variáveis de ambiente
    # Crie um arquivo .env na raiz do projeto com:
    DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
    JWT_SECRET=seu_segredo_super_secreto_aqui
    NODE_ENV=development
    PORT=3000
    
    # Inicie o servidor
    npm run dev

A API estará rodando em `http://localhost:3000`

* * *

## 🗄️ Modelo de Dados

### Users (Usuários)

    id          INTEGER (PK, AUTO_INCREMENT)
    name        STRING
    email       STRING (UNIQUE)
    password    STRING (HASHED)
    createdAt   TIMESTAMP
    updatedAt   TIMESTAMP

### Categories (Categorias)

    id          INTEGER (PK, AUTO_INCREMENT)
    name        STRING
    type        ENUM ('income', 'expense')
    color       STRING (hex color)
    userId      INTEGER (FK → Users.id)
    createdAt   TIMESTAMP
    updatedAt   TIMESTAMP

### Transactions (Transações)

    id              INTEGER (PK, AUTO_INCREMENT)
    description     STRING
    amount          DECIMAL(10, 2)
    type            ENUM ('income', 'expense')
    date            DATE
    userId          INTEGER (FK → Users.id)
    categoryId      INTEGER (FK → Categories.id, NULL)
    createdAt       TIMESTAMP
    updatedAt       TIMESTAMP

**Relacionamentos:**

* Um User tem muitas Categories
* Um User tem muitas Transactions
* Uma Category tem muitas Transactions
* Uma Transaction pertence a um User e uma Category (opcional)

* * *

## 📝 Exemplos de Uso

### Criar usuário

    POST /api/auth/register
    Content-Type: application/json
    
    {
      "name": "João Silva",
      "email": "joao@email.com",
      "password": "senha123"
    }

**Resposta:**

    {
      "user": {
        "id": 1,
        "name": "João Silva",
        "email": "joao@email.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }

### Criar categoria

    POST /api/categories
    Authorization: Bearer SEU_TOKEN_AQUI
    Content-Type: application/json
    
    {
      "name": "Alimentação",
      "type": "expense",
      "color": "#EF4444"
    }

### Criar transação

    POST /api/transactions
    Authorization: Bearer SEU_TOKEN_AQUI
    Content-Type: application/json
    
    {
      "description": "Salário Janeiro",
      "amount": 5000,
      "type": "income",
      "date": "2025-01-15",
      "categoryId": 1
    }

### Obter resumo financeiro

    GET /api/reports/summary?startDate=2025-01-01&endDate=2025-01-31
    Authorization: Bearer SEU_TOKEN_AQUI

**Resposta:**

    {
      "income": 5000,
      "expense": 1250.50,
      "balance": 3749.50
    }

* * *

## 🔒 Autenticação

A API utiliza **JSON Web Tokens (JWT)** para autenticação.

**Como funciona:**

1. Usuário faz registro ou login
2. API retorna um token JWT
3. Cliente inclui o token em todas as requisições protegidas:
  
      Authorization: Bearer SEU_TOKEN_AQUI
  
4. Token expira em 7 dias

* * *

## 🌐 Deploy

### Hospedagem

* **Backend:** [Render](https://render.com) (Free Tier)
* **Banco de Dados:** [Neon](https://neon.tech) (PostgreSQL Serverless)

### Variáveis de Ambiente (Produção)

    DATABASE_URL=postgresql://...@...neon.tech/...?sslmode=require
    JWT_SECRET=chave_super_secreta_de_producao
    NODE_ENV=production

### Build Command

    npm install

### Start Command

    npm start

* * *

## 🐛 Troubleshooting

### Erro: "relation does not exist"

**Solução:** O banco não foi sincronizado. O Sequelize cria as tabelas automaticamente no primeiro start com `sequelize.sync({ alter: true })`.

### Erro: CORS bloqueando requisições

**Solução:** Certifique-se que `app.use(cors())` está configurado no `server.js`.

### Erro: Token inválido

**Solução:** O `JWT_SECRET` deve ser o mesmo em desenvolvimento e produção. Verifique o `.env`.

### API não responde no Render

**Solução:** Verifique os logs no Render Dashboard e confirme que `DATABASE_URL` está configurada corretamente.

* * *

## 📊 Estrutura do Projeto

    finance-manager-api/
    ├── src/
    │   ├── config/
    │   │   └── database.js          # Configuração Sequelize
    │   ├── controllers/
    │   │   ├── authController.js    # Login/Registro
    │   │   ├── categoryController.js
    │   │   ├── transactionController.js
    │   │   ├── reportController.js
    │   │   └── backupController.js  # Export/Import JSON
    │   ├── middlewares/
    │   │   ├── authMiddleware.js    # Verificação JWT
    │   │   └── errorHandler.js
    │   ├── models/
    │   │   ├── index.js             # Relacionamentos
    │   │   ├── User.js
    │   │   ├── Category.js
    │   │   └── Transaction.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── categoryRoutes.js
    │   │   ├── transactionRoutes.js
    │   │   ├── reportRoutes.js
    │   │   └── backupRoutes.js
    │   └── server.js                # Entrada da aplicação
    ├── .env
    ├── .gitignore
    ├── package.json
    └── README.md

* * *

## 🎓 Aprendizados e Diferenciais

Este projeto demonstra conhecimento em:

* **Arquitetura MVC** - Separação de responsabilidades
* **ORM Sequelize** - Abstração de banco de dados
* **Relacionamentos SQL** - Foreign Keys, JOINs, CASCADE
* **Agregações SQL** - SUM, COUNT, GROUP BY, DATE_TRUNC
* **Autenticação JWT** - Segurança de rotas
* **Hash de senhas** - Bcrypt para proteção
* **Validação de dados** - Sequelize validators
* **CORS** - Configuração para APIs
* **Environment variables** - Boas práticas de segurança
* **Deploy profissional** - Render + Neon

* * *

## 📄 Documentação Completa

Para documentação detalhada de todos os endpoints, consulte: [API.md](API.md)

* * *

## 🔗 Links Relacionados

* **Frontend:** [finance-manager-frontend-vercel](https://github.com/DiegoRapichan/finance-manager-frontend-vercel)
* **App Live:** [https://finance-manager-frontend-vercel-ab5xh7p67.vercel.app](https://finance-manager-frontend-vercel-ab5xh7p67.vercel.app)
* **Documentação API:** [Postman Collection](https://documenter.getpostman.com/view/your-collection)

* * *

## 👤 Autor

**Diego Rapichan**

* LinkedIn: [diego-rapichan](https://www.linkedin.com/in/diego-rapichan)
* GitHub: [@DiegoRapichan](https://github.com/DiegoRapichan)
* Portfolio: [Em breve]

* * *

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

* * *

## 🙏 Agradecimentos

* [Neon](https://neon.tech) - PostgreSQL serverless
* [Render](https://render.com) - Hospedagem gratuita
* Comunidade Node.js e Express

* * *

⭐ Se este projeto te ajudou, deixe uma estrela no repositório!
