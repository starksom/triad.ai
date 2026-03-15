# How to Install the "Triad Pipeline" (New User Guide)

If you have received this repository, you are about to use a high-performance automated development pipeline that integrates the intelligence of three AI Agents:
1. **Claude Code** (Your Architect and Product Owner)
2. **Codex** (Your Implementer and Developer)
3. **Antigravity** (Your Tech Lead and Orchestrator)

Follow the steps below to configure your machine and start using the method. The setup is compatible with both macOS/Linux and Windows.

---

## Step 1: Configure the Antigravity Workflow
Antigravity requires an automation workflow installed globally on your machine to act as a Tech Lead and continuous orchestrator for your projects.

### For macOS and Linux (Zsh/Bash)
1. Open your terminal and create the global workflows folder for Antigravity:
   ```bash
   mkdir -p ~/.agent/workflows
   ```
2. Copy the triad workflow file (located inside this template) to your global folder:
   ```bash
   cp .agent/workflows/triad_feature_cycle.md ~/.agent/workflows/
   ```

### For Windows (PowerShell)
1. Open PowerShell and create the global workflows folder for Antigravity:
   ```powershell
   New-Item -ItemType Directory -Force -Path "$HOME\.agent\workflows"
   ```
2. Copy the triad workflow file to the new global folder:
   ```powershell
   Copy-Item -Path ".agent\workflows\triad_feature_cycle.md" -Destination "$HOME\.agent\workflows\"
   ```

*Done! Now Antigravity will recognize the `/triad_feature_cycle` command in any project you create on your computer.*

---

## Step 2: Use this Template for a New Project
This repository serves as the perfect foundation for initiating applications. Do not alter the base structure when starting.

1. **Clone this template** and rename the folder to the name of your new project.
2. Initialize a new git repository:

### For macOS and Linux (Zsh/Bash)
   ```bash
   rm -rf .git
   git init
   git add .
   git commit -m "chore: setup triad pipeline template"
   ```

### For Windows (PowerShell)
   ```powershell
   Remove-Item -Recurse -Force .git
   git init
   git add .
   git commit -m "chore: setup triad pipeline template"
   ```

---

## Step 3: Inject the "Personalities" into the Agents (System Prompts)
The three agents operate ideally when provided with the explicit constraints of this workflow. To begin a work cycle:

**For Claude Code:**
1. Open Claude Code (or the Claude 3.5 Sonnet / Opus web interface).
2. Open the file `prompts/claude_code.md`.
3. Copy the "System Prompt" (the main text block) and paste it into the chat, instructing: *"Assume this persona and plan my new project, which will be an [App XYZ]"*.

**For Codex (In your IDE):**
1. With your cursor in the editor, invoke Codex's code generation.
2. Copy the prompt contained in `prompts/codex.md` and insert it into its context so it understands it is an implementer (Squad Leader) with strict UX limits (Web Quality / 21:9 / Light Themes).

**For Antigravity (In your Terminal):**
1. Invoke Antigravity.
2. Paste the content of `prompts/antigravity.md` so it assumes the role of a strict validator. (Note: in practice, by running `/triad_feature_cycle`, much of this Validator personality will already be internalized within the workflow you copied in Step 1).

---

## Step 4: Daily Operation
You must never skip steps or allow the agents to operate without reading the **Short-Term Memory**.

Always demand that the very first action of any agent is to **READ the file `docs/CONTEXT_STATE.md`**. This file dictates whose "turn" it is. It prevents Claude from writing code and Codex from inventing documentation.

**The Perfect Flow:**
1. **Claude** plans and updates `CONTEXT_STATE.md`, pointing to Codex.
2. **Codex** reads the plan, programs, and updates `CONTEXT_STATE.md`, pointing to Antigravity.
3. **Antigravity** (triggered via `/triad_feature_cycle`) tests the code. If it breaks, it returns the task to Codex. If it passes, it updates the architecture and Changelog.

For further theoretical details and operational limits, read the [ORCHESTRATION_GUIDE.md](./ORCHESTRATION_GUIDE.md).
