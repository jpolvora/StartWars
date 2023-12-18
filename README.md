# StartWars

### Instruções para executar

* Requisitos para executar via `docker compose`

  - Docker
  - Node 20 LTS

* Clonar o código:

    `git clone https://github.com/jpolvora/startwars.git`

* Instalar dependências:
  
    `npm install`

    Para executar via `docker` , no terminal execute `npm run compose:up`

    Para executar em ambiente de desenvolvimento, ajuste as variáveis de ambiente corretamente e utilize `npm run dev`

    Para executar em produção, ajuste as variáveis de ambiente corretamente e utilize `npm start`

    Para rodar os testes, utilize `npm run test`

* Acessando o frontend
    
    Durante a execução do projeto, abra o browser em `http://localhost:3000` e a tela de listagem irá se apresentar.
    Inicialmente a tela mostrará um grid vazio.
    Para popular os dados (executar a importação da `swapi`), clique no botão `Agendar Importação`. Uma mensagem de confirmação será exibida, indicando que o processo de importação foi agendado.
    A execução da importação é assíncrona, executada de forma paginada.
    Após alguns segundos, aperte F5 no navegador para acompanhar os dados sendo populados.

    Obs: No projeto há um arquivo `teste.http` que contém os endpoints a serem executados pelo plugin `Rest Client` do VSCODE.

* Swagger
  
    O projeto contém documentação gerada automaticamente pelo Swagger, acessível via `/doc`

### API's disponíveis

`GET /api/import` : Pegar a chave para o job de importação dos dados via API do `swapi`, sobrescrevendo as informações já existentes no banco de dados.

`POST /api/import` : Confirma o agendamento do job de importação. Deve ser informado no payload o código de confirmação.

`GET /api/personagens`: Listará todos os personagens cadastrados, de forma paginada.

`GET /api/personagens/{id}`: Mostrará somente o personagem com o `id` informado.

### Estrutura do projeto

    O projeto foi escrito em NodeJS v.20, consituído de:
    -   Um endpoint que retorna um frontend escrito em .html ( http://localhost:3000/ )
    -   Endpoints para interação com API Rest ( http://localhost:3000/api )
    -   Endpoint para documentação swagger ( http://localhost:3000/doc )


    Decisões de design

    Utilizo neste projeto o conceito de `Listen to yourself`, utilizando RabbitMQ, de forma a simular um job scheduler. Desta forma, podemos "agendar" jobs através de mensagens enviadas para uma fila específica, e a própria aplicação escuta as mensagens da fila, de forma concorrente.
    Como o endpoint da API `swapi` retorna 10 registros por vez, informando na response a url da próxima página, a cada página informada, agendamos um novo job.
    Esse processo torna a importação mais lenta, porém, escalável, atendendo múltiplas requisições de forma a não sobrecarregar a API.
    

### Overview of design and patterns

  - [Twelve Factor](https://en.wikipedia.org/wiki/Twelve-Factor_App_methodology)
  - Clean Code
    - Separation of Concerns (SOC)
    - Don't Repeat Yourself (DRY)
    - Keep It Simple, Silly (KISS)
    - Small commits
  - SOLID Features:
    - Single Responsability Principle
    - Service Locator (Dependency Inversion principle)
  - Functional Programming
  - DTO / Adapters / Mappers
  - Composition over inheritance
  - Encapsulation
  - Asynchronous Programming (Async/Await/Promises)
  - Listen to Yourself Pattern (outbox)
  - Feature Flags
  - Exception Handling
  - Retry Policy
  - TDD
  - OOP
  - Unit Tests
  - Integration Tests
  - REST

#### Design Patterns

### Technologies
  - NodeJS 20
  - MongoDB
  - RabbitMQ
  - Docker