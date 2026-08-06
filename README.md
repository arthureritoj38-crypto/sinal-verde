# Sinal Verde — pacote web v3

## Estado actual da configuração

- Projecto Supabase ligado: `meocypgdqxnrltkiolzu`;
- migração da autenticação, licenças e progresso aplicada;
- `config.js` já contém a Project URL e a chave pública publishable;
- contacto de pagamento configurado: e-Mola 862181301;
- falta publicar o site e definir os URLs finais no Supabase;
- depois da publicação, crie a sua conta e promova-a a administrador.


Este é o pacote limpo para publicar o dashboard como página web e instalá-lo no Android/Huawei como PWA.

## Melhorias incluídas

- **Entrar** e **Criar conta** no ecrã inicial;
- confirmação de e-mail e opção de reenvio;
- recuperação e alteração da senha;
- conta nova com estado **Activação pendente**;
- pagamento único e activação pelo administrador;
- acesso sem mensalidade e sem data programada de expiração;
- progresso separado por utilizador e sincronizado pelo Supabase;
- painel `admin.html` protegido por perfil `admin`;
- navegação Android/Huawei por gaveta com cartões maiores;
- barra de ferramentas móvel simplificada;
- PWA para adicionar ao ecrã inicial;
- Termos e Política de privacidade.

## Ficheiros necessários

- `index.html`
- `admin.html`
- `config.js`
- `manifest.webmanifest`
- `sw.js`
- `icons/`
- `termos.html`
- `privacidade.html`

O ficheiro `supabase_setup.sql` deve ser executado no Supabase, mas pode ser retirado do alojamento depois da configuração.

## 1. Configurar o Supabase

1. Crie um projecto.
2. Abra **SQL Editor** e execute `supabase_setup.sql`.
3. Em **Authentication → URL Configuration**:
   - defina **Site URL** com o endereço final;
   - adicione o endereço final em **Redirect URLs**.
4. Mantenha **Email/Password** activo e **Confirm Email** ligado.
5. Em **Project Settings → API**, copie a **Project URL** e a chave pública `publishable`/`anon`.
6. Cole apenas esses dois valores em `config.js`.

Nunca coloque `service_role`, secret key, senha da base de dados ou outras credenciais privadas no site.

## 2. Criar o primeiro administrador

1. Publique o site.
2. Crie a sua conta e confirme o e-mail.
3. No SQL Editor, execute:

```sql
update public.profiles
set role = 'admin', access_status = 'active', activated_at = now()
where id = (select id from auth.users where email = 'arthureritoj38@gmail.com');
```

4. Abra `admin.html`.

## 3. Fluxo do comprador

1. Abre o site e escolhe **Criar conta**.
2. Introduz nome, e-mail e senha.
3. Confirma o e-mail.
4. Entra e vê **Activação pendente**.
5. Faz o pagamento único e envia o comprovativo.
6. O administrador abre `admin.html` e toca em **Activar**.
7. O acesso fica activo e o progresso sincroniza entre dispositivos.

## 4. Publicar no Cloudflare Pages — recomendado

### Upload directo

1. Abra **Workers & Pages → Create → Pages → Direct Upload**.
2. Carregue esta pasta ou o ZIP.
3. Copie o endereço `pages.dev`.
4. Coloque esse endereço no Supabase em **Site URL** e **Redirect URLs**.

O ficheiro `_headers` é aplicado automaticamente pelo Cloudflare Pages.

### Ligação ao GitHub

Pode também ligar o repositório ao Cloudflare Pages. O site é HTML estático: não use comando de compilação e use a raiz como pasta de saída.

## 5. Publicar no GitHub Pages

1. Crie um repositório e carregue o conteúdo desta pasta.
2. Em **Settings → Pages**, escolha **GitHub Actions**.
3. O fluxo `.github/workflows/pages.yml` publica automaticamente.
4. Depois, actualize **Site URL** e **Redirect URLs** no Supabase.

O GitHub Pages serve o site por HTTPS, mas não aplica `_headers`. Para cabeçalhos de segurança personalizados, prefira Cloudflare Pages.

## 6. Huawei P40 / Android

1. Abra o endereço no Navegador Huawei.
2. Use **Adicionar ao ecrã inicial**.
3. Em navegadores compatíveis, aparece também **Instalar no telefone**.
4. A autenticação e validação da licença requerem ligação à internet.

## 7. Antes de vender

- confirme no site que aparece e-Mola 862181301;
- reveja `termos.html` e `privacidade.html`;
- teste criação, confirmação, recuperação, activação e suspensão;
- confirme que uma conta comum não abre `admin.html`;
- configure SMTP próprio no Supabase;
- faça cópias de segurança periódicas.

## Limitação de protecção do conteúdo

A autenticação, a licença e o progresso estão no servidor. Porém, o banco de questões continua incorporado no `index.html`. Para protecção superior, a próxima fase deve mover perguntas, imagens e gabarito para a base de dados/API e entregar apenas as questões necessárias a cada sessão.
