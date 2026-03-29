import type { TaskClassification } from './types.js';

const KEYWORDS: Record<TaskClassification, RegExp[]> = {
  research: [/\b(analisar|pesquisar|compare|benchmark|investigar|evaluate|trade-?offs?)\b/i],
  design: [/\b(arquitetura|design|interface|schema|modelagem|adr|planejar)\b/i],
  implementation: [/\b(implementar|codar|criar|build|refactor|fix|adicionar)\b/i],
  review: [/\b(review|revisar|auditar|validar|testar|qa|code review)\b/i],
};

const ORDER: TaskClassification[] = ['review', 'research', 'design', 'implementation'];

export function classifyTask(prompt: string): TaskClassification {
  const text = prompt.trim();
  for (const classification of ORDER) {
    if (KEYWORDS[classification].some((pattern) => pattern.test(text))) {
      return classification;
    }
  }

  return 'implementation';
}
