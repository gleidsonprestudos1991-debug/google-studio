# Sistema de Login e Senha

Aplicativo web completo de autenticação e gestão de usuários desenvolvido em **React**, **TypeScript** e **Tailwind CSS**, com foco em segurança criptográfica, interface moderna e responsiva, e facilidade de integração.

---

## 🚀 Funcionalidades

### 1. Tela de Login
- Campo para inserção do **nome de usuário**.
- Campo para inserção da **senha**, com botão para alternar entre **mostrar e ocultar**.
- Validação dinâmica dos campos obrigatórios.
- Mensagem de **sucesso** quando o acesso for autorizado com redirecionamento suave.
- Mensagem de **erro** detalhada quando o usuário ou a senha estiverem incorretos.
- Botão **Limpar Campos** para resetar o formulário.
- Botão de atalho para preenchimento rápido da conta de teste (`maria.silva` / `Senha123!`).

### 2. Cadastro de Usuários
- Cadastro de novos usuários com:
  - **Nome Completo**
  - **Nome de Usuário** (com verificação imediata de disponibilidade)
  - **Senha** e **Confirmação de Senha**
- **Bloqueio rigoroso de duplicidades**: impede o registro de nomes de usuário já existentes.
- **Medidor de Força da Senha**: avalia tamanho, letras maiúsculas, minúsculas, números e caracteres especiais.
- Botão para limpar campos e alternar entre telas.

### 3. Segurança Criptográfica
- **Sem senhas em texto puro**: As senhas são combinadas com um **sal criptográfico exclusivo (salt)** de 128 bits e processadas via algoritmo **SHA-256** utilizando a `Web Crypto API` nativa (`crypto.subtle.digest`).
- **Sem credenciais estáticas no código**: Nenhuma senha administrativa ou de acesso mestre fica exposta no código.
- **Auditoria de Acessos**: Log em tempo real com registro de tentativas de login (sucessos e falhas), timestamps em formato tabular e dados do dispositivo.
- **Preparação para Firebase Authentication**: Módulo estruturado com guia de transição para produção corporativa com Firebase Auth ou backend dedicado (Argon2 / Bcrypt).

### 4. Área Protegida (Pós-Login)
- **Mensagem de boas-vindas personalizada** com o nome do usuário autenticado.
- **Perfil do usuário** com identificador (`@username`), data de cadastro e último acesso.
- **Botão Sair (Logout)** que revoga o token de sessão ativa.
- **Proteção de Rotas**: Usuários não autenticados são impedidos de visualizar o painel interno.
- **Gerenciador de Usuários**: Visualização de contas cadastradas com opção de remoção segura de contas de teste (sem expor senhas ou hashes).
- **Alteração de Senha**: Permite ao usuário logado alterar sua própria senha, exigindo validação da senha atual.

---

## 🛠️ Tecnologias Utilizadas
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Web Crypto API** (Criptografia SHA-256 + Salts aleatórios)

---

## 📦 Como Testar Localmente
1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
2. Abra a URL informada no terminal.
3. Teste o login com a conta demonstrativa inicial:
   - **Usuário:** `maria.silva`
   - **Senha:** `Senha123!`
4. Ou cadastre novos usuários através da aba **Criar Conta**.

---

## 🔄 Sincronização com o Repositório GitHub

Para sincronizar este projeto com o seu repositório existente:
👉 **https://github.com/gleidsonprestudos1991-debug/google-studio**

Execute os seguintes comandos no terminal do projeto:

```bash
# 1. Inicializar o repositório Git local
git init

# 2. Conectar ao seu repositório remoto existente
git remote add origin https://github.com/gleidsonprestudos1991-debug/google-studio.git

# 3. Definir branch padrão como main
git branch -M main

# 4. Adicionar todos os arquivos do projeto
git add .

# 5. Criar o commit das alterações
git commit -m "feat: Implementar Sistema de Login e Senha completo"

# 6. Enviar para o repositório no GitHub
git push -u origin main
```

> **Dica de segurança:** Caso o repositório remoto já possua commits anteriores (como um README inicial ou licença), execute antes do push:
> ```bash
> git pull origin main --rebase
> git push -u origin main
> ```
