StartWars

# Instruções para executar

Requisitos:

- node 20
- docker & docker compose funcionando
- terminal para executar

Clonar o código:

`git clone https://github.com/jpolvora/startwars.git`

Instalar dependências:

`npm install`

Casso possua `mongodb` instalado e rodando localmente, faça as adaptações necessárias no arquivo `.env` ou ajuste suas variáveis de ambiente conforme `.env.example`

Para executar via `docker` , no terminal execute `npm run compose:up`

Para executar em ambiente de desenvolvimento, com `mongodb` instalado localmente, utilize `npm run dev`

Para executar em produção, ajuste as variáveis de ambiente corretamente e utilize `npm start`

# Estrutura do projeto

    startwars
    ├── .env.example             # Exemplo de variáveis de ambiente com valores. Deve ser copiado para .env
    ├── package.json
    ├── src
    │   ├── api.js               # 2 - Cria a aplicação express, configura as rotas, mantendo a separação e testabilidade
    │   ├── env.js
    │   ├── index.js             # 1 - Entrypoint da aplicação. Faz a inicialização e vinculação entre rotas, servidor HTTP, mensageria e banco de dados. Composition Root, Graceful shutdown.
    │   ├── server.js            # 3 - Incializa o servidor http e consome o aplicativo Express
    │   └── routes               # Contém os handlers para atender as requisições.
    │       ├── index.js
    │       └── scripts.js

`

### Index.js

# API's disponíveis

`GET /api/import` : Prompt para agendar o job de importação dos dados via API do `swapi`, sobrescrevendo as informações já existentes no banco de dados.

`POST /api/import` : Confirma o agendamento do job de importação. Deve ser informado no payload o código de confirmação.

`GET /api/personagens`: Listará todos os personagens cadastrados, de forma paginada.

`GET /api/personagens/{id}`: Mostrará somente o personagem com o `id` informado.
