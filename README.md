# Finance Manager

> Sistema full stack de gestão financeira pessoal — API REST com autenticação JWT, relatórios com aggregations SQL, backup/restore em JSON e dashboard com gráficos interativos.

![Node.js](https://img.shields.io/badge/Node.js_18-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat&logo=sequelize&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black)

**[🚀 App ao Vivo](https://finance-manager-frontend-vercel-ab5xh7p67.vercel.app)** • **[🔌 API](https://finance-manager-api-ykt7.onrender.com)**

---

## 🛠️ Stack

| Camada | Tecnologias |
|--------|------------|
| **Backend** | Node.js · Express · Sequelize ORM · PostgreSQL (Neon serverless) · JWT · Bcrypt |
| **Frontend** | React 18 · Tailwind CSS · Axios · Recharts |
| **Deploy** | Render (backend) · Vercel (frontend) · Neon (PostgreSQL) |

---

## ⚙️ Destaques Técnicos

**Aggregations SQL para relatórios financeiros**
O `reportController` usa `SUM`, `COUNT`, `GROUP BY` e `DATE_TRUNC` diretamente via Sequelize para calcular resumo financeiro (receitas, despesas, saldo), agrupamento por categoria com percentuais e evolução mensal do ano — sem processar dados no JavaScript, deixando o banco fazer o que sabe fazer melhor.

**Backup e restore em JSON**
`backupController` exporta todos os dados do usuário (categorias + transações) em um único JSON estruturado e permite reimportar — útil para migração entre ambientes ou recuperação de dados. Operação encapsulada em transação Sequelize para garantir consistência no restore.

**Relacionamentos Sequelize bem modelados**
`User → Categories → Transactions` com Foreign Keys e `CASCADE` configurados nos models. `categoryId` é opcional na transação (permite transações sem categoria). Os relacionamentos são declarados centralizadamente em `models/index.js`, permitindo includes aninhados nas queries sem joins manuais.

**Filtros compostos dinâmicos nas transações**
O endpoint `GET /transactions` aceita `startDate`, `endDate`, `type` e `categoryId` combinados. A query é construída dinamicamente com `Op.between`, `Op.gte` e `Op.lte` do Sequelize — nenhum filtro é obrigatório, todos são opcionais e combinam entre si.

**Isolamento completo por usuário via JWT**
Todas as rotas protegidas passam pelo `authMiddleware` que extrai o `userId` do token. Todas as queries filtram por `userId` — nenhum usuário acessa dados de outro, mesmo conhecendo o ID do recurso.

---

## ✨ Funcionalidades

**API — 15+ endpoints REST**
- Autenticação: registro, login, JWT com expiração de 7 dias
- CRUD de categorias com tipo (receita/despesa) e cor personalizada
- CRUD de transações com filtros combinados por data, tipo e categoria
- Relatórios: resumo financeiro, agrupamento por categoria, evolução mensal
- Backup: exportar todos os dados em JSON / importar de JSON

**Frontend — React SPA**
- Dashboard com saldo atual, total de receitas e despesas
- Gráficos de evolução mensal e distribuição por categoria (Recharts)
- Listagem de transações com filtros combinados
- Formulários com validação client-side

---

## 🔌 Endpoints

```
Base URL: https://finance-manager-api-ykt7.onrender.com/api

# Autenticação
POST /auth/register          Criar conta
POST /auth/login             Login — retorna JWT (7 dias)

# Categorias (Bearer token)
GET    /categories           Lista categorias do usuário
POST   /categories           Cria categoria (nome, tipo, cor)
PUT    /categories/:id       Atualiza categoria
DELETE /categories/:id       Remove categoria

# Transações (Bearer token)
GET    /transactions         Lista com filtros: ?startDate ?endDate ?type ?categoryId
POST   /transactions         Cria transação
PUT    /transactions/:id     Atualiza transação
DELETE /transactions/:id     Remove transação

# Relatórios (Bearer token)
GET /reports/summary         Resumo: receitas, despesas, saldo
GET /reports/by-category     Agrupado por categoria com percentuais
GET /reports/monthly         Evolução mensal do ano (DATE_TRUNC)

# Backup (Bearer token)
GET  /backup/export          Exporta todos os dados em JSON
POST /backup/import          Importa dados de JSON
```

---

## 🗄️ Modelo de Dados

```
users
  id · name · email · password (bcrypt) · createdAt · updatedAt

categories
  id · name · type (income|expense) · color (#hex)
  userId (FK → users, CASCADE)

transactions
  id · description · amount (DECIMAL 10,2) · type (income|expense)
  date · userId (FK → users) · categoryId (FK → categories, NULL permitido)
```

---

## 📁 Estrutura do Projeto

```
finance-manager-api/
└── src/
    ├── config/
    │   └── database.js              # Sequelize + Neon
    ├── controllers/
    │   ├── authController.js
    │   ├── categoryController.js
    │   ├── transactionController.js # Filtros compostos dinâmicos
    │   ├── reportController.js      # SUM, GROUP BY, DATE_TRUNC
    │   └── backupController.js      # Export/Import JSON
    ├── middlewares/
    │   ├── authMiddleware.js        # JWT → userId
    │   └── errorHandler.js
    ├── models/
    │   ├── index.js                 # Relacionamentos centralizados
    │   ├── User.js
    │   ├── Category.js
    │   └── Transaction.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── categoryRoutes.js
    │   ├── transactionRoutes.js
    │   ├── reportRoutes.js
    │   └── backupRoutes.js
    └── server.js
```

---

## 🚀 Como Rodar Localmente

**Pré-requisitos:** Node.js 18+, PostgreSQL ou conta no [Neon](https://neon.tech) (gratuito)

```bash
git clone https://github.com/DiegoRapichan/finance-manager-api.git
cd finance-manager-api
npm install

# Configure o .env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
JWT_SECRET=sua_chave_secreta
PORT=3000

npm run dev   # http://localhost:3000
```

---

## 🌐 Deploy

| Serviço | URL |
|---------|-----|
| Frontend | https://finance-manager-frontend-vercel-ab5xh7p67.vercel.app |
| Backend API | https://finance-manager-api-ykt7.onrender.com |
| Banco de dados | Neon (PostgreSQL serverless) |

---

## 👨‍💻 Autor

**Diego Rapichan** — Desenvolvedor Full Stack · Node.js + React

[![LinkedIn](https://img.shields.io/badge/LinkedIn-diego--rapichan-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/diego-rapichan)
[![GitHub](https://img.shields.io/badge/GitHub-DiegoRapichan-181717?style=flat&logo=github)](https://github.com/DiegoRapichan)

---

📄 Licença MIT
