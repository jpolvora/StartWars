# StartWars

### Instruções para executar

* Requisitos para executar via `docker compose`

  - docker
  - node 20

* Clonar o código:

    `git clone https://github.com/jpolvora/startwars.git`

* Instalar dependências:
  
    `npm install`

    Para executar via `docker` , no terminal execute `npm run compose:up`

    Para executar em ambiente de desenvolvimento, ajuste as variáveis de ambiente corretamente e utilize `npm run dev`

    Para executar em produção, ajuste as variáveis de ambiente corretamente e utilize `npm start`

    Para rodar os testes, utilize `npm run test`


### API's disponíveis

`GET /api/import` : Pegar a chave para o job de importação dos dados via API do `swapi`, sobrescrevendo as informações já existentes no banco de dados.

`POST /api/import` : Confirma o agendamento do job de importação. Deve ser informado no payload o código de confirmação.

`GET /api/personagens`: Listará todos os personagens cadastrados, de forma paginada.

`GET /api/personagens/{id}`: Mostrará somente o personagem com o `id` informado.
