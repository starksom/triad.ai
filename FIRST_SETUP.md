# 🚀 Como Instalar o "Triad Pipeline" (Guia para Novos Usuários)

Se você recebeu este repositório, você está prestes a usar um pipeline de desenvolvimento automatizado de alta performance que integra a inteligência de três Agentes de IA:
1. **Claude Code** (Seu Arquiteto e Product Owner)
2. **Codex** (Seu Implementador e Desenvolvedor)
3. **Antigravity** (Seu Tech Lead e Orquestrador)

Siga os passos abaixo para configurar a sua máquina e começar a usar o método.

---

## Passo 1: Configurar o Workflow do Antigravity
O Antigravity precisa de uma automação instalada globalmente na sua máquina para agir como Tech Lead e orquestrador contínuo dos seus projetos.

1. No seu terminal, crie a pasta global de workflows do Antigravity:
   ```bash
   mkdir -p ~/.agent/workflows
   ```
2. Copie o arquivo do fluxo da tríade (que está dentro deste template) para sua pasta global:
   ```bash
   cp .agent/workflows/triad_feature_cycle.md ~/.agent/workflows/
   ```
   *Pronto! Agora o Antigravity reconhecerá o comando `/triad_feature_cycle` em qualquer projeto que você criar no seu computador.*

---

## Passo 2: Usar este Template para um Novo Projeto
Este repositório serve como a semente "perfeita" para iniciar aplicações. Não altere a estrutura base ao começar.

1. **Clone este template** e renomeie a pasta para o nome do seu novo projeto.
2. Inicie um repositório git novo:
   ```bash
   rm -rf .git
   git init
   git add .
   git commit -m "chore: setup triad pipeline template"
   ```

---

## Passo 3: Injetar as "Personalidades" nos Agentes (System Prompts)
Os 3 agentes são "burros" por natureza até que você dê a eles as restrições deste fluxo. Para iniciar um ciclo de trabalho:

**Para o Claude Code:**
1. Abra o Claude Code (ou a interface web do Claude 3.5 Sonnet / Opus).
2. Abra o arquivo `prompts/claude_code.md`.
3. Copie o "System Prompt" (a seção de texto preta principal) e cole no chat, instruindo: *"Assuma essa persona e faça o planejamento do meu novo projeto que será um [App XYZ]"*.

**Para o Codex (No seu IDE):**
1. Com o cursor no editor, chame a geração de código do Codex.
2. Copie o prompt contido em `prompts/codex.md` e jogue no contexto dele para que ele entenda que é um implementador (Squad Leader) e tem limites estritos de UX (Web Quality / 21:9 / Temas Claros).

**Para o Antigravity (No seu Terminal):**
1. Chame o Antigravity.
2. Cole o conteúdo de `prompts/antigravity.md` para que ele assuma o papel de validador linha-dura. (Nota: na prática, ao rodar `/triad_feature_cycle`, grande parte dessa personalidade de Validador já estará internalizada no workflow que você copiou no Passo 1).

---

## 🚦 Passo 4: Como Operar o Dia-a-Dia
Vocês nunca devem pular etapas ou deixar que os agentes funcionem sem ler a **Memória Curta**. 

Sempre exija que a primeira ação de qualquer agente seja **LER o arquivo `docs/CONTEXT_STATE.md`**. Esse arquivo é o que dita de quem é a "Vez". Ele evita que o Claude escreva código e que o Codex invente documentação.

**O Fluxo Perfeito:**
1. ✅ **Claude** planeja e altera o `CONTEXT_STATE.md` apontando para o Codex.
2. 💻 **Codex** lê o plano, programa e altera o `CONTEXT_STATE.md` apontando para o Antigravity.
3. 🕵️‍♂️ **Antigravity** acionado via (`/triad_feature_cycle`) testa o código. Se quebrar, devolve pro Codex. Se passar, atualiza a arquitetura e Changelog.

Para mais detalhes teóricos e limites de atuação, leia o [ORCHESTRATION_GUIDE.md](./ORCHESTRATION_GUIDE.md).
