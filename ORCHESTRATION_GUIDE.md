# Guia de Orquestração - Triad Pipeline

Este documento explica como você, o Desenvolvedor/Tech Lead, deve orquestrar a interação entre o **Claude Code**, o **Codex** e o **Antigravity** para garantir um fluxo de trabalho sem atritos.

Os três agentes não se falam diretamente. Eles se comunicam através da leitura e escrita nos seguintes documentos base:
- `README.md`
- `docs/roadmap.md`
- `docs/architecture.md`
- `CHANGELOG.md`

Para manter a ordem, siga estritamente o fluxo abaixo, passando o bastão de um agente para o outro no momento certo.

---

## 🧠 Skills Globais, Guardrails e Context State
Para eficiência máxima (BMAD/Ralph, Snyk Sec, Web Quality), leia o arquivo `skills/GLOBAL_SKILLS.md`.

**A Ficha de Transação (O Bastão):**
Nenhum agente começa a trabalhar sem ler e depois atualizar o arquivo `docs/CONTEXT_STATE.md`. Este arquivo diz qual fase estamos (`[PLANEJAMENTO]`, `[DESENVOLVIMENTO]`, `[VALIDAÇÃO]`, etc) e quem é o responsável atual para evitar confusão de memória.

**Guardrails:**
- **Claude:** Apenas planeja, assume papéis de PO/InfoSec/Arquiteto. Não escreve código. Quando termina, atualiza o `CONTEXT_STATE.md` para Fase de Desenvolvimento e manda para o Codex.
- **Codex:** Squad Leader. Apenas coda, cria testes e resolve CSS responsivo (Mobile-first vertical, Light Theme). Não decide versão. Quando termina, atualiza o `CONTEXT_STATE.md` para Fase de Validação e manda para o Antigravity.
- **Antigravity:** Tech Lead absoluto. Testa na máquina. Se houver erro de Testes/Responsividade/Segurança, ele **rejeita**, altera o `CONTEXT_STATE.md` de volta para o Codex. Se aprova, atualiza documentos.

---

## 🔄 O Ciclo de Vida de uma Feature

### 1️⃣ Fase de Planejamento (Claude Code - O Product Owner)
1. Abra o **Claude Code** com a instrução `plan_project` de `prompts/claude_code.md`.
2. O Claude Code vai gerar Requisitos, preencher o roadmap, verificar segurança de escopo e pausar.
3. **Pausa:** Vá para o Codex.

### 2️⃣ Fase de Implementação (Codex - O Squad Leader/Dev)
1. No seu IDE, abra o **Codex** com a instrução `implement_task` de `prompts/codex.md`.
2. O Codex aplicará seus conhecimentos em UX responsivo avançado (21:9, Mobile iPhone/iPad, Light theme) e codificará exatamente a tarefa.
3. **Pausa:** Chame o Antigravity para testar.

### 3️⃣ Fase de Validação e Gatekeeper (Antigravity - O Tech Lead)
1. Chame-me no seu terminal enviando `/triad_feature_cycle Valide a tarefa [Nome]`.
2. Eu roda testes e linters:
   - **ERRO:** Eu te enviarei o log exato e mandarei você voltar à Fase 2 (Codex) para consertar.
   - **SUCESSO:** Eu alterarei os documentos (`Roadmap`, `Architecture`, `Changelog`).

### 4️⃣ Fase de Auditoria Final de Release (Claude Code)
1. Quando Roadmap estiver em zero itens, chame o **Claude Code** com a instrução `audit_implementation`.
2. O Claude avalia em altíssimo nível se tudo atende as regras de negócio e versionamento. Ele emite um relatório sumário.

### 5️⃣ Fase de Decisão de Commit (Usuário)
1. Como passo final, o Claude devolverá a responsabilidade "Decisão de Merge/Commit" para você.
2. Você pode aprovar ("git commit -m 'release'") ou mandar voltar ao planejamento se achar que faltou algo crítico!

---

## 🚫 Dicas e Limites Críticos
- **Nunca peça para o Codex atualizar o Roadmap ou o Changelog.** Ele foi proibido de fazer isso nos prompts para evitar sobreposição. Isso é trabalho do Antigravity.
- **Nunca peça para o Claude Code escrever código de produção.** Ele desenha os blocos e checa a segurança de alto nível.
- **Não ignore as Regras de Parada (Handoffs).** Se um agente pedir para você ir para o outro, obedeça. Isso garante que testes rodem antes das coisas serem documentadas, e que a documentação seja atualizada antes que códigos novos sejam pensados.
