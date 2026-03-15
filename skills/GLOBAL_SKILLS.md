# Global Skills Context

Para maximizar a inteligência e o reaproveitamento de conhecimento entre Claude Code, Codex e Antigravity, este projeto incorpora os princípios de "Multi-Skills" baseados nos seguintes repositórios de referência:

## 1. Planning with Files & BMAD / Ralph Methods
**Conceito Base:** Agentes não devem confiar na própria memória de contexto volátil. Toda decisão, requisito e passo a passo deve ser lido, validado e escrito em arquivos Markdown (`roadmap.md`, `architecture.md`).
- **Ação Obrigatória:** Antes de qualquer modificação, o agente DEVE ler a documentação de arquitetura e o plano.
- **Estruturação:** O raciocínio deve ser explícito ("step-by-step") e declarativo.

## 2. Web Quality Skills (addyosmani)
**Conceito Base:** Foco absoluto em UX responsivo e performance.
- **Regras de UX (Codex e Antigravity):**
  - **Tema Obrigatório:** Apenas Temas Claros (Light Theme), a não ser que explicitamente pedido o contrário.
  - **Responsividade Obrigatória:** A interface deve adaptar-se perfeitamente a aspect ratios de 21:9 (Ultrawide), 16:9 (Desktop Padrão) e 4:3 (Tablets tradicionais).
  - **Mobile-First Vertical:** O layout deve prever usabilidade em iPhones, iPads e Androids na posição vertical de forma nativa.

## 3. Security & Snyk Studio Recipes
**Conceito Base:** Shift-left security e OWASP Top 10 por default.
- **Regras Confidenciais:** Nenhum hardcoded secret é permitido.
- **Validação:** Antigravity e Claude Code são responsáveis por checar injection de SQL/NoSQL, XSS, CSRF, e falhas de CORS durante a auditoria formal.

## 4. Git PR & Lifecycle Skills
**Conceito Base:** O fluxo de features termina com uma decisão executiva do usuário final.
- **Decisão de Commit:** O Claude Code prepara a revisão, mas não toma a ação destrutiva de merge/commit em main sem a validação humana final (a não ser automatizado no workflow).
