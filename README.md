# Guarda de Material

## Descrição do Projeto
<p >Sistema para acompanhar itens pela fábrica depois do recebimento até o estoque</p>

[Versão Produção](http://brz-app30:3003/api/versao)
[Versão Desenvolvimento](http://localhost:3003/api/versao)

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Funcionalidades
- Visualizar lista de itens que chegaram no recebimento;
- Filtrar lista por código do item, descrição, data de início e fim;
- Gerar CSV da lista de itens;
- Editar Status do item (lista de opções);
- Editar Responsável do Item pela matrícula;
- Remover da lista.

## Acesso
Acessar pela porta 3003 
Desenvolvimento: [http://localhost:3003](http://localhost:3003)
Produção: [http://brz-app30:3003](http://brz-app30:3003)


## Informações de desenvolvimento
Projeto feito em Next.js
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

Pode ser modificado a partir da página inicial: `app/page.tsx`

