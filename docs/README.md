# Karakeep Frontend Documentation

> **Navigation Hub** for all project documentation

## 📊 Current Status

- **[Project Status](STATUS.md)** - Current state, achievements, and next priorities
- **[Development Log](development/DEVELOPMENT_LOG.md)** - Session-by-session development progress

## 📖 Core Documentation

- **[Main README](../README.md)** - Project overview, features, and setup instructions
- **[Development Guide](../CLAUDE.md)** - AI assistant guidelines and project context
- **[Security Policy](../SECURITY.md)** - Security guidelines and secret handling
- **[Changelog](../CHANGELOG.md)** - Generated changelog of all changes

## 🔄 Automated Documentation

- **[Session Archive](sessions/)** - Automated documentation from Claude Code hooks
  - Generated before context compaction
  - Captures development sessions, achievements, and progress
  - Created by pre-compact hooks to preserve work

## 📚 Development Resources

- **[Development Logs](development/)** - Manual development documentation
  - Current session work
  - Feature implementation details
  - Decision logs and architecture notes

## 🗄️ Historical Archive

- **[Migration Archive](archive/)** - Complete React-Admin to Refine migration documentation
  - Authentication migration logs
  - Step-by-step migration progress
  - Preserved code patterns and assets
  - Historical context and decisions

## 🛠️ Development Workflow

### Documentation Updates

1. **Automated** (via Claude Code hooks):
   - Session summaries → `sessions/`
   - Changelog updates → `../CHANGELOG.md`
   - Progress tracking

2. **Manual** (developer updates):
   - Project status → `STATUS.md`
   - Development logs → `development/`
   - Core documentation → `../README.md`, `../CLAUDE.md`

### Quick Navigation

| What you need | Where to find it |
|---------------|------------------|
| **Project overview** | [`../README.md`](../README.md) |
| **Current status** | [`STATUS.md`](STATUS.md) |
| **Setup instructions** | [`../README.md#development`](../README.md#development) |
| **Recent work** | [`sessions/`](sessions/) (latest files) |
| **AI guidelines** | [`../CLAUDE.md`](../CLAUDE.md) |
| **Security info** | [`../SECURITY.md`](../SECURITY.md) |
| **Migration history** | [`archive/migration/`](archive/migration/) |

## 🎯 Quick Links for Development

- **Start development**: `npm run dev` (see [README](../README.md))
- **Test hooks**: `python3 scripts/hooks/test_hooks.py`
- **Check status**: Review [STATUS.md](STATUS.md)
- **See recent work**: Check latest in [sessions/](sessions/)

---

*This documentation structure is maintained by Claude Code hooks and manual updates to ensure comprehensive project coverage.*