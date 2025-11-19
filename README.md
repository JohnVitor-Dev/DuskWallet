# 🌙 DuskWallet

**Gestão Financeira Pessoal com Análise Inteligente**

DuskWallet é uma aplicação moderna e intuitiva para gerenciar suas finanças pessoais, com recursos de análise inteligente usando IA para fornecer insights sobre seus gastos e hábitos financeiros.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## ✨ Funcionalidades

### 📊 Dashboard Completo
- Visualização do saldo atual em tempo real
- Cards de estatísticas (Receitas, Despesas, Saldo)
- Gráficos interativos:
  - Gráfico de pizza para despesas por categoria
  - Gráfico de barras para receitas vs despesas ao longo do tempo
- Lista das últimas 5 transações
- Guia de boas-vindas para novos usuários

### 💰 Gerenciamento de Transações
- Adicionar, editar e excluir transações
- Categorização de receitas e despesas
- Múltiplos métodos de pagamento
- Filtros avançados:
  - Por descrição (busca)
  - Por tipo (Receita/Despesa)
  - Por categoria
  - Por método de pagamento
- Design responsivo com cards informativos

### 🤖 Análise com IA
- Análise inteligente dos seus gastos
- Insights sobre padrões financeiros
- Alertas sobre gastos excessivos
- Recomendações personalizadas
- Sistema de cache para melhor performance

### 🔐 Autenticação Segura
- Registro de novos usuários
- Login com validação
- Tokens JWT para segurança
- Cache isolado por usuário
- Logout com limpeza de dados

### 🎨 Interface Moderna
- Design dark elegante
- Animações suaves
- Logo animado customizado
- Totalmente responsivo (Desktop, Tablet, Mobile)
- Ícones do Lucide React
- Notificações toast informativas

---

## 🚀 Tecnologias

### Frontend
- **React 18.2.0** - Biblioteca JavaScript para interfaces
- **React Router DOM 6.20.0** - Roteamento SPA com Lazy Loading
- **Axios 1.6.2** - Cliente HTTP
- **Recharts 2.10.3** - Gráficos interativos
- **Lucide React 0.294.0** - Ícones modernos
- **Validator 13.15.23** - Validação e sanitização de inputs
- **CSS Custom Properties** - Temas customizáveis

### Ferramentas
- **React Scripts 5.0.1** - Ferramentas de build
- **ESLint** - Linting de código
- **Git** - Controle de versão

### Otimizações
- **Error Boundary** - Tratamento de erros resiliente
- **Code Splitting** - Lazy loading de páginas
- **React Hooks** - useMemo e useCallback para performance
- **Input Validation** - Segurança contra XSS

---

## 📦 Instalação

### Pré-requisitos
- Node.js 14+ instalado
- npm ou yarn
- Git

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/JohnVitor-Dev/DuskWallet.git
cd DuskWallet
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
REACT_APP_API_URL=https://dusk-wallet-api.vercel.app/api
REACT_APP_NAME=DuskWallet
REACT_APP_VERSION=1.0.0
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

---

## 🏗️ Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `build/`.

---

## 📁 Estrutura do Projeto

```
DuskWallet/
├── public/
│   └── index.html
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── ErrorBoundary/ # Tratamento de erros
│   │   ├── Input/
│   │   ├── Layout/
│   │   ├── Modal/
│   │   ├── ProtectedRoute/
│   │   ├── Select/
│   │   └── Toast/         # Sistema de notificações
│   ├── contexts/          # Contextos React
│   │   └── AuthContext.js
│   ├── pages/             # Páginas da aplicação
│   │   ├── Analysis/      # Análise com IA
│   │   ├── Auth/          # Login e Registro
│   │   ├── Dashboard/     # Dashboard principal
│   │   ├── NotFound/      # Página 404
│   │   └── Transactions/  # Gerenciamento de transações
│   ├── services/          # Serviços e API
│   │   └── api.js
│   ├── utils/             # Utilitários
│   │   ├── helpers.js     # Funções auxiliares
│   │   └── validation.js  # Validações de formulários
│   ├── App.js
│   ├── index.css
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🎨 Categorias Disponíveis

### Receitas
- 💼 Salário
- 📈 Investimentos
- 💰 Outras Receitas

### Despesas
- 🏠 Moradia
- ⚡ Contas
- 🛒 Mercado
- 🍔 Comida Fora
- 🚗 Transporte
- 🏥 Saúde
- 📚 Educação
- 🎮 Lazer
- 🛍️ Compras
- 💳 Dívidas
- 📦 Outros

---

## 💳 Métodos de Pagamento

- 💵 Dinheiro
- 📱 PIX
- 💳 Crédito

---

## 🔒 Segurança

- Autenticação JWT
- Tokens armazenados com segurança
- Cache isolado por usuário
- Validação de formulários
- Limpeza automática de dados ao logout
- Rotas protegidas

---

## 📱 Responsividade

O DuskWallet é totalmente responsivo e otimizado para:
- 🖥️ Desktop (1024px+)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (até 767px)
- 📱 Mobile Pequeno (até 480px)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

**John Vitor**
- GitHub: [@JohnVitor-Dev](https://github.com/JohnVitor-Dev)

---

**Feito com ☕**
