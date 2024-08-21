# FW7 Shorten URL

## Descrição

FW7 Shorten URL é uma aplicação web para encurtamento de URLs. A aplicação foi construída utilizando React, Vite, Node.js, TypeScript, Redis, Docker e Express. O frontend está hospedado no Vercel, e o backend está hospedado no Render e Railway.

**O site de produção está disponível em:** [https://fw7-shrt.vercel.app/](https://fw7-shrt.vercel.app/)

Abaixo estão as instruções para instalar e rodar o projeto localmente, caso deseje contribuir para o desenvolvimento.

## Tecnologias Utilizadas

- **Frontend:** React, Vite
- **Backend:** Node.js, TypeScript, Express
- **Banco de Dados:** Redis
- **Infraestrutura:** Docker, Render, Railway, Vercel

## Pré-requisitos

- **Docker:** Certifique-se de ter o Docker instalado em sua máquina.
- **Git:** Para clonar o repositório.
- **Redis:** Um serviço Redis deve estar disponível para o backend funcionar corretamente.
- **Make:** Certifique-se de ter o Make instalado em sua máquina para executar comandos predefinidos.

## Instalação e Execução

As imagens Docker do projeto já estão disponíveis. Para rodar a aplicação localmente e contribuir para o desenvolvimento, siga os passos abaixo:

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/phlucasfr/fw7-shorten
    ```

2. **Configure o Redis para o Backend:**

   Para o backend funcionar corretamente, você precisa ter um serviço Redis disponível. Crie um arquivo `.env` na pasta `backend` e configure as variáveis de ambiente necessárias:

    ```plaintext
    REDIS_URL=SUA_URL_REDIS
    REDISCLI_AUTH=SUA_AUTH_REDIS
    PORT=4000
    ```
3. **Navegue até o diretório `project`:**

    ```bash
    cd project
    ```

4. **Execute o comando para construir e iniciar os containers do frontend e backend:**

    ```bash
    make all
    ```

Este comando irá construir as imagens Docker do frontend e backend e iniciar os containers correspondentes. O frontend estará disponível na porta `5000`, e o backend na porta `4000`.

## Testes

O projeto inclui uma suíte de testes para garantir a qualidade do código e a funcionalidade da aplicação.

## Ações (GitHub Actions)
Este projeto utiliza GitHub Actions para CI/CD, que automatiza a construção, teste e deploy da aplicação. As ações são configuradas para garantir que o código esteja sempre atualizado e funcionando conforme o esperado antes de ser integrado ao branch principal.

## Documentação da API

A documentação completa da API está disponível no Postman:

[Documentação da API](https://documenter.getpostman.com/view/29417482/2sA3s9D8MG)
