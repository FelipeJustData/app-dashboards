<h1>DataHub</h1> 

> Status do Projeto: :warning: em desenvolvimento

## Visão Geral

A documentação a seguir oferece uma visão detalhada do código Node.js utilizando o framework Express para a aplicação web de DataHub desenvolvido pela célula de dataviz.
 O código apresentado é destinado a uma aplicação web que gerencia usuários, administradores, clientes e projetos (funciona como Hub que centraliza dashboards de diferentes fontes). Ele inclui configurações importantes, middleware, rotas e recursos essenciais para o funcionamento da aplicação.

- **Nome da Aplicação**: Datahub
- **Versão**: 1.0.0
- **Autor**: Just a Little Data
- **Data da Última Atualização**: 27 de Setembro de 2023

### Tópicos 

:small_blue_diamond: [Funcionalidades](#funcionalidades)

:small_blue_diamond: [Deploy da Aplicação](#deploy-da-aplicação-dash)

:small_blue_diamond: [Pré-requisitos](#pré-requisitos)

:small_blue_diamond: [Como rodar a aplicação](#como-rodar-a-aplicação)

## Funcionalidades

:heavy_check_mark: Cadastros de Usuários

:heavy_check_mark: Cadastros de Clientes

:heavy_check_mark: Cadastros de Projetos  

:heavy_check_mark: Cadastros de Dashboards

## Deploy da Aplicação :dash:

Para instalar a aplicação localmente, siga estas etapas:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Just-a-Little-Data/datahub.git
   cd datahub
   ```

## Como rodar a aplicação:
1. **Instale as dependências:**
   
   ```bash
   npm install
   ```

2. **Inicie a aplicação:**
   
   ```bash
   npm start
   ```

## Estrutura do Código

O código está organizado em várias seções, cada uma desempenhando um papel importante no funcionamento da aplicação.

:small_blue_diamond: [Importação de Módulos](#importação-de-módulos)
:small_blue_diamond: [Configurações](#configurações)
:small_blue_diamond: [Middleware](#middleware)
:small_blue_diamond: [Body Parser e Template Engine](#body-parser-e-template-engine)
:small_blue_diamond: [Arquivos Estáticos](#arquivos-estáticos)
:small_blue_diamond: [Rotas](#rotas)
:small_blue_diamond: [Inicialização do Servidor](#inicialização-do-servidor)

### Importação de Módulos
Nesta seção, todos os módulos necessários são importados. Isso inclui o Express, Handlebars, Body Parser, entre outros. Além disso, as rotas, middleware e configurações de autenticação também são importadas.

```javascript
const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require("path") 
const flash = require('connect-flash')
const passport = require("passport")
const session = require('express-session')
const users = require("./routes/user")
require("./config/auth")(passport)
const admin = require('./routes/admin')
const projects = require('./routes/project')
const { eAdmin } = require("./helpers/eAdmin")
const { eUser } = require("./helpers/eUser")

try{
    const User_Module = require("./models/User_Module")
}catch(err){
    console.log("Erro ao gerar module - "+err)
}
```

### Configurações
Nesta seção, as configurações principais são definidas, incluindo a configuração da sessão e do Passport, que é usado para autenticação.

```javascript
app.use(session({
    secret: 'Aplicativo',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
```

### Middleware
Este middleware é usado para configurar variáveis locais que podem ser acessadas em todas as rotas. Isso inclui mensagens de sucesso, mensagens de erro e informações do usuário autenticado.

```javascript
app.use((req,res,next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
})
```

### Body Parser e Template Engine
Aqui, o Body Parser é configurado para processar dados de formulário e JSON. Além disso, o Handlebars é configurado como o mecanismo de modelo para renderizar páginas HTML.

```javascript
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine','handlebars')
```

### Arquivos Estáticos
Esta linha permite o acesso a arquivos estáticos, como CSS e JavaScript, localizados na pasta "public".

```javascript
app.use(express.static(path.join(__dirname,"public")))
```

### Rotas
Aqui são definidas as rotas da aplicação. As duas primeiras rotas são para a página inicial, uma para administradores e outra para usuários comuns. As próximas linhas configuram as rotas para os módulos de usuários, administradores e projetos, utilizando os arquivos de rotas importados anteriormente.

```javascript
app.get('/home',eAdmin, (req, res) => {
    res.render("home",{user: req.user})
})

app.get('/',eUser, (req, res) => {
    res.render("home",{user: req.user})
})

app.use('/users', users)
app.use('/admin', admin)
app.use('/projects', projects)
```

### Inicialização do Servidor
Finalmente, o servidor é configurado para ouvir em uma porta específica (ou na porta 8081 por padrão) e uma mensagem é exibida no console quando o servidor é iniciado.

```javascript
const PORT = process.env.PORT || 8081
app.listen(PORT, function(){
    console.log(`Servidor rodando na porta: ${PORT}` )
})

```