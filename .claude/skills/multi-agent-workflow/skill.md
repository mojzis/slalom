# Multi-Agent Workflow Skill

You are now executing a structured multi-agent workflow designed to prevent context window exhaustion during large implementations.

## Core Principles

1. **Work ONLY through subagents** - NEVER code in main thread
2. **Commit after EACH agent** completes (no batching)
3. **All logs/reports → files** under logs/, NOT conversation
4. **Main thread: max 2 sentences** per agent launch
5. **Max 3 files per coder agent** run (hard limit)
6. **Mandatory tool usage rules** in every agent prompt
7. **Upfront planning** via planner agent first

## Execution Flow

### Step 0: Launch Planner Agent (First, Always)

Use the Task tool with subagent_type="Explore" and thoroughness="very thorough":

```
Prompt: [Use ~/.claude/skills/multi-agent-workflow/templates/planner.md template]
Description: "Create detailed implementation plan"
```

After planner completes:
- Commit plans/detailed-plan.md immediately
- Main thread output: "Plan written. Committed."

### Step 1-N: Execute Phases

For each phase in the detailed plan:

1. **Coder Agent(s)**:
   - Launch with template from templates/coder.md
   - Scope: Max 3 files per run
   - If phase needs >3 files, launch multiple coder agents sequentially
   - Commit after EACH run
   - Main thread: "Launching coder for phase N, step X (files: a, b, c)."
   - After: "Code committed."

2. **Tester Agent**:
   - Launch with template from templates/tester.md
   - Output → logs/phase-N-tests.md
   - Commit
   - Main thread: "Tests committed."

3. **Reviewer Agent**:
   - Launch with template from templates/reviewer.md
   - Output → logs/phase-N-review.md
   - Commit
   - Main thread: "Review committed."

4. **Fix Issues** (if reviewer found problems):
   - Launch coder agent again with fixes
   - Commit
   - Main thread: "Fixes committed."

5. **Move to next phase**
   - Main thread: "Moving to phase N+1..."

### Final Step: Completion

After all phases:
- Main thread: "All phases complete. Summary written to logs/completion-summary.md."
- Do NOT write lengthy summary in conversation

## Agent Templates

When launching agents, construct prompts using these templates:

- **Planner**: ~/.claude/skills/multi-agent-workflow/templates/planner.md
- **Coder**: ~/.claude/skills/multi-agent-workflow/templates/coder.md
- **Tester**: ~/.claude/skills/multi-agent-workflow/templates/tester.md
- **Reviewer**: ~/.claude/skills/multi-agent-workflow/templates/reviewer.md

## Critical Rules

### Tool Enforcement
EVERY agent prompt MUST include:
```
CRITICAL TOOL RULES:
- Read files: Use Read tool, NOT cat/head/tail
- Edit files: Use Edit tool, NOT sed/awk/vi
- Write files: Use Write tool, NOT echo/>
- Search code: Use Grep tool, NOT grep/rg/ag
- Find files: Use Glob tool, NOT find/ls
- Bash is ONLY for: git, npm, cargo, pytest, build commands
Violating this wastes context and the run fails.
```

### Context Safety
- NO file reading in main thread "for overview"
- NO exploration in main thread
- NO lengthy explanations - just agent status
- ALL substantive output goes to files under logs/

### Commit Discipline
```bash
# After planner
git add plans/detailed-plan.md && git commit -m "Add detailed implementation plan"

# After each coder run
git add [modified files] && git commit -m "Implement phase N step X"

# After tester
git add logs/phase-N-tests.md [test files] && git commit -m "Add tests for phase N"

# After reviewer
git add logs/phase-N-review.md && git commit -m "Add review for phase N"

# After fixes
git add [fixed files] && git commit -m "Fix issues from phase N review"
```

## Detecting the Plan

The user will typically say:
- "Implement the plan in plans/[file].md"
- "Use multi-agent workflow for [task]"
- "Follow the workflow to implement [feature]"

When you see this, immediately launch the planner agent first.

## Main Thread Example

```
User: "Implement the plan in plans/slalom-plan.md"
Assistant: Launching planner agent.
[planner runs]
Assistant: Plan written. Committed.
Assistant: Launching coder for phase 1, step 1 (files: src/foo.ts, src/bar.ts).
[coder runs]
Assistant: Code committed. Launching tester for phase 1.
[tester runs]
Assistant: Tests committed. Launching reviewer for phase 1.
[reviewer runs]
Assistant: Review committed. Launching coder to fix 2 issues.
[coder runs]
Assistant: Fixes committed. Moving to phase 2...
[repeat]
Assistant: All phases complete. Summary written to logs/completion-summary.md.
```

Notice: Ultra-brief updates only. No explanations, no code snippets, no summaries in conversation.

## Troubleshooting

If you find yourself:
- Reading files in main thread → STOP, use agents instead
- Writing code directly → STOP, launch coder agent
- Explaining agent results → STOP, just say status
- Using cat/grep in bash → STOP, remind yourself to use proper tools in agent prompts

The workflow is strict by design. Follow it exactly to prevent context exhaustion.
