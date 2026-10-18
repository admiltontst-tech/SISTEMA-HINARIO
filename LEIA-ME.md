# Hinário — app pessoal (PWA)

App de hinos com cifras, transposição de tom, rolagem automática, modo palco,
pastas, favoritos, lista do culto, importador de cifras, backup e
sincronização entre computador e celular. Funciona sem internet depois de instalado.

## Arquivos
- `index.html` — o app inteiro
- `config.js` — endereço e chave do Supabase (você preenche)
- `supabase.sql` — cria a tabela da sincronização (roda uma vez no Supabase)
- `vendor/supabase.js` — biblioteca do Supabase (fica no app para funcionar offline)
- `sw.js` — faz o app funcionar offline
- `manifest.webmanifest` + `icons/` — nome e ícone para instalar na tela inicial
- `vercel.json` — configurações para a Vercel

## 1. Criar o Supabase (uma vez, uns 5 minutos)
1. Entre em supabase.com, crie uma conta grátis e clique em **New project**.
   Nome: `hinario`. Região: **South America (São Paulo)**. Crie uma senha do banco e guarde.
2. Quando o projeto terminar de criar, abra **SQL Editor** > **New query**,
   cole todo o conteúdo do arquivo `supabase.sql` e clique em **Run**.
   Deve aparecer "Success. No rows returned".
3. (Recomendado, deixa mais simples) Vá em **Authentication** > **Sign In / Providers** > **Email**
   e desligue **Confirm email**. Assim a conta funciona na hora, sem e-mail de confirmação.
4. Clique em **Connect** (no topo do painel) ou vá em **Project Settings** > **API** e copie:
   - **Project URL** (ex.: `https://abcdxyz.supabase.co`)
   - **anon public key** (também pode aparecer como "publishable key")
5. Abra `config.js` no VS Code e cole os dois valores no lugar de `COLE_AQUI_...`. Salve.

## 2. Publicar na Vercel
O projeto da Vercel está ligado a este repositório do GitHub: cada mudança que entra
na branch `main` (por exemplo, o merge de um PR) publica o site sozinha, em um ou dois minutos.
Não é preciso enviar a pasta à mão.

## 3. Entrar nos aparelhos
1. No computador, abra o app, toque em **Entrar** (no topo) > digite e-mail e uma senha > **Criar conta**.
2. No celular, abra o app, toque em **Entrar** > mesmo e-mail e senha > **Entrar**.
3. Pronto: o que você salvar em um aparece no outro.

O indicador no topo mostra a situação:
- **Sincronizado** (bolinha verde): tudo igual na nuvem.
- **Sincronizando…**: enviando ou recebendo hinos.
- **Offline (n)**: sem internet, com n alterações esperando. Elas vão sozinhas quando a internet voltar.
- **Erro ao sincronizar**: toque nele para ver o motivo.

O app sincroniza ao abrir, logo depois de cada alteração e a cada minuto enquanto está aberto.
Se você editar o mesmo hino nos dois aparelhos, fica a versão editada por último.

## Instalar no celular
- **Android (Chrome):** abra o link > menu ⋮ > "Instalar app".
- **iPhone (Safari):** abra o link > Compartilhar > "Adicionar à Tela de Início".
- Abra o app uma vez com internet. Depois disso ele funciona offline.

## Importar cifra da internet
1. Toque em **⤓ Importar cifra** e use **Buscar cifra** para achar o hino.
2. No site, selecione do primeiro acorde até o fim da letra e copie.
3. Volte ao app, toque em **Colar** e depois em **Converter e revisar**.
4. Confira número, pasta e acordes e toque em **Salvar hino**.

No Android, com o app instalado: selecione a cifra no navegador > **Compartilhar** > **Hinário**.

## Excluir um hino
Abra o hino > **Excluir** > **Confirmar exclusão**. Aparece **Desfazer** por alguns segundos.
A exclusão também vale para os outros aparelhos.

## Bom saber
- O plano grátis do Supabase pausa projetos parados por cerca de uma semana. Se aparecer
  "Erro ao sincronizar" depois de muito tempo sem usar, entre no painel do Supabase e clique em
  **Restore project**. Os hinos continuam no aparelho enquanto isso.
- A chave "anon" no `config.js` é pública por natureza. Quem protege os seus hinos são as regras
  de segurança criadas pelo `supabase.sql`: cada conta só vê e altera os próprios hinos.
- O **Backup** continua disponível e vale como cópia extra.

## Publicar uma melhoria
Altere os arquivos, aumente `VERSAO` no `sw.js` (ex.: `hinario-v7`) e faça o merge na `main`;
a Vercel publica sozinha.
O app atualiza na próxima vez que abrir com internet.
