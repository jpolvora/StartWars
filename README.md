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

* Acessando os dados
    
    Durante a execução do projeto, abra o browser em `http://localhost:3000` e a tela de listagem irá se apresentar.
    Inicialmente a tela mostrará um grid vazio.
    Para popular os dados (executar a importação da `swapi`), clique no botão `Agendar Importação`. Uma mensagem de confirmação será exibida, indicando que o processo de importação foi agendado.
    A execução da importação é assíncrona, executada de forma paginada.
    Após alguns segundos, aperte F5 no navegador para acompanhar os dados sendo populados.

### API's disponíveis

`GET /api/import` : Pegar a chave para o job de importação dos dados via API do `swapi`, sobrescrevendo as informações já existentes no banco de dados.

`POST /api/import` : Confirma o agendamento do job de importação. Deve ser informado no payload o código de confirmação.

`GET /api/personagens`: Listará todos os personagens cadastrados, de forma paginada.

`GET /api/personagens/{id}`: Mostrará somente o personagem com o `id` informado.

### Estrutura do projeto
