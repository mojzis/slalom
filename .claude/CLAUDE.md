# Slalom Game Development

This is a browser-based game project.

## Development Workflow

### For Large Implementations

When implementing major features or doing initial project setup, use the multi-agent workflow to prevent context exhaustion:

**Option 1: Use the skill (recommended)**
```
User: "Implement the plan in plans/[feature].md using the multi-agent workflow"
```

**Option 2: Reference the guide**
Follow the detailed instructions in `plans/multi-agent-workflow-guide.md`

### For Normal Development

Standard conversation-based development is fine for:
- Bug fixes
- Small feature additions
- Code exploration
- Questions about the codebase

## Project Structure

- `plans/` - High-level feature plans and detailed implementation plans
- `logs/` - Agent outputs (test results, reviews, summaries)
- `src/` - Source code
- `tests/` - Test files

## Quick Start for New Features

1. Create a high-level plan in `plans/feature-name-plan.md`
2. Invoke the multi-agent workflow
3. The planner agent will create `plans/detailed-plan.md`
4. Coder/tester/reviewer agents will implement iteratively
5. Check `logs/` for test results and reviews
6. Final summary in `logs/completion-summary.md`

## Technology Stack

[To be filled in based on your project choices]
