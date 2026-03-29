# triad.ai - Multi-Agent Orchestration Framework

## Objective
Triad coordinates Claude Code, Codex, and Antigravity with strict role boundaries and file-based orchestration.

## Capability Maturity Matrix

| Capability | Status |
|---|---|
| State graph + transitions | stable |
| Checkpointing + restore | stable |
| Tracing + dashboard | stable |
| Provider detection | stable |
| Multi-model execution | beta |
| Cost reporting | beta |
| Consensus engine | planned |
| Smart router | planned |
| Dark factory mode | planned |

## Quick Start

```bash
npm install
npm run build
npx triad status
```

## CLI Commands (Runtime-Synced)

| Command | Description |
|---|---|
| `triad run` | Display current pipeline state |
| `triad status` | Combined state + roadmap + skills summary |
| `triad init` | Print scaffolding guidance |
| `triad transition <event>` | Execute state graph transition |
| `triad validate` | Run tests and auto-transition |
| `triad reject <cat> <msg>` | Trigger structured REJECT transition |
| `triad checkpoint list/show/restore` | Checkpoint operations |
| `triad skills [agent]` | List skills |
| `triad roadmap` | Print roadmap summary |
| `triad consolidate` | Review AGENTS decisions |
| `triad config [key] [value]` | Read/write config |
| `triad trace list/show <id>` | Trace inspection |
| `triad dashboard [--port]` | Start dashboard |
| `triad providers` | List currently available providers |
| `triad providers detect [id]` | Run provider detection |
| `triad multi-model <prompt>` | Execute prompt across providers |
| `triad cost-report` | Show aggregated cost usage |

## Planned (Not Yet Available)
- `triad consensus`
- `triad dark-factory`
- Automatic smart routing

## Documentation
- [Orchestration Guide](ORCHESTRATION_GUIDE.md)
- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [Changelog](CHANGELOG.md)
- [ADRs](docs/adr)
