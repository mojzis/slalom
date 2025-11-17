# Multi-Agent Workflow Guide: Context Management Best Practices

## Problem Statement

When running complex implementation tasks with AI assistants, context window exhaustion is a common failure mode. This guide documents lessons learned for structuring work to prevent this.

## Root Causes of Context Exhaustion

1. **Working in main thread** - All code, exploration, debugging happens in conversation
2. **Vague delegation** - "Use subagents if you want" → assistant works directly instead
3. **No commit checkpoints** - Can't recover partial work when context runs out
4. **Logs/reports in conversation** - Verbose summaries pollute context
5. **Tool misuse in subagents** - Using `cat`/`echo`/`grep` instead of Read/Edit/Write/Grep tools
6. **Unbounded work units** - One agent tries to modify 20 files at once
7. **No upfront planning** - Each agent re-explores codebase independently

## Solution: Structured Multi-Agent Workflow

### Core Instruction Template

```
Read plans/ and implement ALL phases.

MANDATORY PROCESS - START HERE:
0. Launch planner agent FIRST (thoroughness: "very thorough"):
   - Reads the high-level plan from plans/
   - Explores codebase to understand architecture
   - Writes detailed implementation plan to plans/detailed-plan.md
   - Plan MUST include: files to modify, functions to add, dependencies, step-by-step breakdown
   - Commit the plan immediately

1. Work ONLY through subagents - NEVER code in main thread
2. Every agent prompt MUST include tool usage rules:
   "CRITICAL TOOL RULES:
   - Read files: Use Read tool, NOT cat/head/tail
   - Edit files: Use Edit tool, NOT sed/awk/vi
   - Write files: Use Write tool, NOT echo/>
   - Search code: Use Grep tool, NOT grep/rg/ag
   - Find files: Use Glob tool, NOT find/ls
   - Bash is ONLY for: git, npm, cargo, pytest, build commands
   Violating this wastes context and the run fails."

3. Commit after EACH agent completes (no batching)
4. All logs/reports → files under logs/, NOT conversation
5. Main thread: max 2 sentences per agent launch

AGENT WORKFLOW PER PHASE:
- Coder agent:
  * Gets specific steps from plans/detailed-plan.md
  * Max 3 files per run
  * If phase needs more files, run multiple coder agents sequentially
  * Each run → commit
- Tester agent → writes logs/phase-N-tests.md → commit
- Reviewer agent → writes logs/phase-N-review.md → fixes issues → commit
- Move to next phase

CONTEXT SAFETY:
- Max 3 files per coder agent run (hard limit)
- Multiple coder runs for larger features = multiple commits = checkpoints
- No file reading in main thread "for overview"
- No explanatory text in main thread beyond agent status

Final output: logs/completion-summary.md (NOT in conversation)
```

## Agent Design Patterns

### 1. Planner Agent (Runs Once, Upfront)

**Purpose:** Single exploration phase to map out all work

**Instruction Template:**
```
You are the planner agent. Your task:
1. Read the high-level plan from plans/[plan-file].md
2. Explore the codebase thoroughly (use Grep, Glob, Read tools)
3. Document current architecture relevant to this plan
4. Create detailed implementation plan with:
   - Phase breakdown
   - For each phase: exact files to modify, functions to add, dependencies
   - Test strategy for each phase
   - Potential risks/blockers

CRITICAL TOOL RULES:
- Use Read (not cat), Grep (not grep), Glob (not find)
- Bash only for git status, dependency checks

Write comprehensive plan to plans/detailed-plan.md
Focus on technical details, file paths, function names - no PM jargon.
```

**Why this works:** All codebase exploration happens once. Later agents just follow the map.

### 2. Coder Agent (Runs Multiple Times)

**Purpose:** Implement specific, bounded changes

**Instruction Template:**
```
You are the coder agent. Your task:
Implement phase [N], step [X] from plans/detailed-plan.md

SCOPE LIMIT: Modify maximum 3 files this run.
If step requires more, only do first 3 files.

CRITICAL TOOL RULES:
- Use Read (not cat), Edit (not sed), Write (not echo)
- Bash only for git, npm, cargo, build tools

Do NOT explore or plan - just implement exactly what's in the detailed plan.
Do NOT write logs or summaries - just code.
```

**Why this works:** Bounded scope = predictable context usage. Multiple small agents better than one large agent.

### 3. Tester Agent

**Purpose:** Run tests, write test code, document results

**Instruction Template:**
```
You are the tester agent. Your task:
Test phase [N] implementation.

1. Run existing tests related to changes
2. Write new tests if needed
3. Document results in logs/phase-N-tests.md (NOT in conversation)

CRITICAL TOOL RULES:
- Use Read/Write tools for test files
- Bash for pytest/npm test/cargo test only

Output format in logs/phase-N-tests.md:
- Tests run: [list]
- Pass/Fail: [results]
- New tests added: [list]
- Issues found: [specific failures]
```

**Why this works:** Test output goes to files, not conversation. Clear pass/fail signal.

### 4. Reviewer Agent

**Purpose:** Code quality check, identify issues

**Instruction Template:**
```
You are the reviewer agent. Your task:
Review phase [N] implementation for quality.

Check:
- Code correctness (logic errors, edge cases)
- Security issues (injection, XSS, etc.)
- Performance problems
- Code clarity and maintainability
- Adherence to plan in plans/detailed-plan.md

CRITICAL TOOL RULES:
- Use Read (not cat), Grep (not grep)
- No bash commands needed

Write review to logs/phase-N-review.md with:
- Issues found (file:line format)
- Severity (critical/major/minor)
- Suggested fixes

Be strict. Focus on technical quality, not praise.
```

**Why this works:** Review in file = permanent record. Forces fixes before moving on.

## Key Principles

### 1. Mandatory Subagent Usage
**Wrong:** "Feel free to use subagents"
**Right:** "Work ONLY through subagents - NEVER code in main thread"

### 2. Frequent Commits
**Wrong:** Commit when phase completes
**Right:** Commit after EACH agent (planner, coder, tester, reviewer)

### 3. Work Chunking
**Wrong:** "Implement the authentication system"
**Right:** "Modify these 3 files: auth.ts, user.ts, db.ts. If more files needed, stop and I'll launch another agent."

### 4. File-Based Outputs
**Wrong:** Agent writes summary in conversation
**Right:** Agent writes to logs/phase-N-summary.md, main thread says "Summary written"

### 5. Tool Enforcement
**Wrong:** Let agents choose their tools
**Right:** Every agent prompt includes tool rules, violations = failed run

### 6. Upfront Planning
**Wrong:** Start coding, figure it out as you go
**Right:** Planner agent explores and documents everything first

### 7. Ultra-Brief Main Thread
**Wrong:** Explain what each agent is doing, provide status updates
**Right:** "Launching coder agent for phase 1." [2 sentences max]

## Expected Workflow Example

```
User: "Implement the plan in plans/slalom-plan.md using the multi-agent workflow"
Assistant: Launching planner agent.

[Planner agent runs, explores codebase, writes plans/detailed-plan.md]

Assistant: Plan written. Committing.
[git add plans/detailed-plan.md && git commit]

Assistant: Launching coder agent for phase 1, step 1 (files: src/foo.ts, src/bar.ts).

[Coder agent modifies 2 files]

Assistant: Code committed. Launching tester agent for phase 1.

[Tester runs tests, writes logs/phase-1-tests.md]

Assistant: Tests committed. Launching reviewer agent for phase 1.

[Reviewer finds 2 issues, writes logs/phase-1-review.md]

Assistant: Review committed. Launching coder agent to fix issues.

[Coder fixes issues]

Assistant: Fixes committed. Moving to phase 2...

[Process repeats for all phases]

Assistant: All phases complete. Summary written to logs/completion-summary.md.
```

## Context Usage Comparison

### Before (Bad):
- Main thread: 150K tokens (exploration, coding, logs, summaries)
- Result: Context exhaustion at 60% completion

### After (Good):
- Main thread: 15K tokens (agent launch messages only)
- Planner agent: 40K tokens (one-time exploration)
- 8 coder agents: 20K tokens each (bounded scope)
- 4 tester agents: 15K tokens each
- 4 reviewer agents: 10K tokens each
- Result: Complete implementation with context to spare

## Troubleshooting

### "Agent used cat instead of Read"
**Cause:** Tool rules not included in agent prompt
**Fix:** Add tool rules to EVERY agent prompt, without exception

### "Context still exhausted"
**Possible causes:**
1. Coder agent scope too large (>3 files) - Reduce scope
2. Logs written to conversation not files - Check all output goes to logs/
3. Main thread too verbose - Enforce 2-sentence limit
4. No commits between agents - Add commit after each agent

### "Agents re-exploring same code"
**Cause:** No upfront planner, or plan insufficient detail
**Fix:** Planner must document exact files/functions. Coder agents should never explore.

### "Work incomplete when stopped"
**Cause:** Infrequent commits
**Fix:** Commit after every single agent completion

## Summary

Effective context management requires:
1. **Mandatory** subagent usage (not optional)
2. **Mandatory** tool enforcement in every agent prompt
3. **Mandatory** commits after each agent
4. **Mandatory** file-based outputs (never conversation)
5. **Mandatory** work chunking (3 files max per coder run)
6. **Mandatory** upfront planning (planner agent first)
7. **Mandatory** brevity in main thread (2 sentences)

Without these mandatory rules, context will exhaust. With them, even large implementations complete successfully.





















