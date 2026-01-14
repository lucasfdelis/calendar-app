# Google Calendar Web Editor

Google Calendar Web Editor é uma aplicação web que permite autenticar com uma conta Google e criar eventos reais no Google Calendar utilizando OAuth 2.0 e a Google Calendar API. Diferente do simples embed por iframe, que é apenas leitura, este projeto possibilita a edição real do calendário diretamente pelo site.

O usuário pode fazer login, autorizar o acesso, listar seus próximos compromissos e criar novos eventos que aparecem imediatamente em sua conta Google.

## Funcionalidades

- Login com conta Google  
- Autorização segura via OAuth 2.0  
- Listagem dos próximos eventos do usuário  
- Criação de novos eventos pelo site  
- Integração direta com o Google Calendar real  

## Tecnologias Utilizadas

- Node.js (v18 ou superior)  
- Express  
- Google APIs (`googleapis`)  
- OAuth 2.0  
- HTML + JavaScript  

## Estrutura do Projeto
```
calendar-app/
├─ server.js
├─ package.json
└─ public/
└─ index.html
```
## Como Executar

1. Instale o Node.js (v18 ou superior)

3. Clone o repositório:
 ```bash
 git clone https://github.com/lucasfdelis/calendar-app
 cd calendar-app
```
4. Instale as dependências:
 ```bash
 npm install
 ```
5. No arquivo server.js, configure suas credenciais do Google:
```bash
const oauth2Client = new google.auth.OAuth2(
  "SEU_CLIENT_ID",
  "SEU_CLIENT_SECRET",
  "http://localhost:3000/auth/google/callback"
);
```

5. Inicie o servidor:
```bash
node server.js
```
6. Acesse no navegador:

http://localhost:3000
