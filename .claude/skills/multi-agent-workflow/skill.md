# Multi-Agent Workflow Skill - EXECUTION SCRIPT

You are now executing a structured multi-agent workflow. Follow these steps EXACTLY. This is a strict checklist, not a guide.

## RULES (Read First)

1. **NEVER code in main thread** - All work through agents
2. **NEVER read files in main thread** - Agents do all exploration
3. **NEVER write logs in conversation** - All logs go to files
4. **Main thread output: 2 sentences MAX** per step
5. **Commit after EVERY agent** (no exceptions)
6. **All agents use subagent_type="general-purpose"**

## EXECUTION CHECKLIST

### STEP 0: LAUNCH PLANNER AGENT (ALWAYS FIRST)

**DO THIS:**

1. Identify the plan file from user's request (e.g., "plans/slalom-plan.md")
2. Read the planner template:
   ```
   Read tool: /home/user/slalom/.claude/skills/multi-agent-workflow/templates/planner.md
   ```
3. Replace `[plan-file]` in template with actual filename
4. Launch agent:
   ```
   Task tool:
     subagent_type: "general-purpose"
     description: "Create detailed implementation plan"
     prompt: [FULL contents of planner template with [plan-file] replaced]
   ```
5. After agent completes, output to user: "Plan written. Committing."
6. Commit:
   ```bash
   git add plans/detailed-plan.md && git commit -m "Add detailed implementation plan for [feature]"
   ```

### STEP 1: READ THE DETAILED PLAN (MAIN THREAD ONLY)

**DO THIS:**

1. Read plans/detailed-plan.md to see all phases
2. Count total phases
3. Extract each phase into separate variables/memory
4. Do NOT output plan contents to user

**IMPORTANT:** Agents will NOT see the full plan. You will extract and give each agent ONLY their phase.

### STEP 2: EXECUTE EACH PHASE

**FOR EACH PHASE, DO THIS LOOP:**

#### 2.1 LAUNCH CODER AGENT(S)

**DO THIS:**

1. Read the coder template:
   ```
   Read tool: /home/user/slalom/.claude/skills/multi-agent-workflow/templates/coder.md
   ```
2. Extract ONLY Phase N section from detailed-plan.md (that you read in STEP 1)
3. Check how many files this phase/step requires
4. If >3 files: Split into multiple coder runs (3 files max each)
5. Replace `[N]` with phase number, `[X]` with step number in template
6. **CRITICAL:** Replace "from plans/detailed-plan.md" with the actual Phase N content (inline)
7. Launch agent:
   ```
   Task tool:
     subagent_type: "general-purpose"
     description: "Implement phase N step X"
     prompt: [FULL coder template + ONLY Phase N section inline, NO reference to detailed-plan.md]
   ```
8. Output to user: "Launching coder for phase N, step X (files: a.ts, b.ts, c.ts)."
9. After agent completes, output: "Code committed."
10. Commit:
   ```bash
   git add [files modified by agent] && git commit -m "Implement phase N step X"
   ```
11. If more files remain: Repeat 2.1 for remaining files

**WHY:** Agent sees ONLY their phase, not entire plan. Saves context.

#### 2.2 LAUNCH TESTER AGENT

**DO THIS:**

1. Read the tester template:
   ```
   Read tool: /home/user/slalom/.claude/skills/multi-agent-workflow/templates/tester.md
   ```
2. Extract ONLY Phase N section from detailed-plan.md (that you read in STEP 1)
3. Replace `[N]` with phase number in template
4. **CRITICAL:** Replace "from plans/detailed-plan.md" with the actual Phase N content (inline)
5. Launch agent:
   ```
   Task tool:
     subagent_type: "general-purpose"
     description: "Test phase N implementation"
     prompt: [FULL tester template + ONLY Phase N section inline, NO reference to detailed-plan.md]
   ```
6. Output to user: "Launching tester for phase N."
7. After agent completes, output: "Tests committed."
8. Commit:
   ```bash
   git add logs/phase-N-tests.md tests/ && git commit -m "Add tests for phase N"
   ```

**WHY:** Agent sees ONLY their phase, not entire plan. Saves context.

#### 2.3 LAUNCH REVIEWER AGENT

**DO THIS:**

1. Read the reviewer template:
   ```
   Read tool: /home/user/slalom/.claude/skills/multi-agent-workflow/templates/reviewer.md
   ```
2. Extract ONLY Phase N section from detailed-plan.md (that you read in STEP 1)
3. Replace `[N]` with phase number in template
4. **CRITICAL:** Replace "from plans/detailed-plan.md" with the actual Phase N content (inline)
5. Launch agent:
   ```
   Task tool:
     subagent_type: "general-purpose"
     description: "Review phase N implementation"
     prompt: [FULL reviewer template + ONLY Phase N section inline, NO reference to detailed-plan.md]
   ```
6. Output to user: "Launching reviewer for phase N."
7. After agent completes, output: "Review committed."
8. Commit:
   ```bash
   git add logs/phase-N-review.md && git commit -m "Add review for phase N"
   ```

**WHY:** Agent sees ONLY their phase, not entire plan. Saves context.

#### 2.4 FIX ISSUES (IF REVIEWER FOUND ANY)

**DO THIS:**

1. Read logs/phase-N-review.md to check for issues
2. If CRITICAL or MAJOR issues found:
   a. Read the coder template again
   b. Extract ONLY Phase N section from detailed-plan.md (that you read in STEP 1)
   c. Modify template to say "Fix issues from logs/phase-N-review.md for phase N"
   d. **CRITICAL:** Include Phase N content inline, plus the review content inline
   e. Launch agent:
      ```
      Task tool:
        subagent_type: "general-purpose"
        description: "Fix issues from phase N review"
        prompt: [FULL coder template + Phase N section inline + review issues inline]
      ```
   f. Output to user: "Launching coder to fix issues."
   g. After agent completes, output: "Fixes committed."
   h. Commit:
      ```bash
      git add [fixed files] && git commit -m "Fix issues from phase N review"
      ```
3. If no issues or only MINOR issues: Skip to next phase

**WHY:** Agent sees ONLY their phase and specific issues, not entire plan/review. Saves context.

#### 2.5 MOVE TO NEXT PHASE

**DO THIS:**

1. Output to user: "Moving to phase N+1..."
2. Go back to step 2.1 with next phase number
3. If no more phases: Go to STEP 3

### STEP 3: COMPLETION

**DO THIS:**

1. Create completion summary using Write tool:
   ```
   Write tool:
     file_path: logs/completion-summary.md
     content: [Brief summary of what was implemented, phases completed, any notes]
   ```
2. Commit:
   ```bash
   git add logs/completion-summary.md && git commit -m "Add completion summary"
   ```
3. Output to user: "All phases complete. Summary written to logs/completion-summary.md."
4. STOP - Do NOT write lengthy explanation

## TEMPLATE READING INSTRUCTIONS

When instructions say "Read the X template", you MUST:

1. Use Read tool on the template file path
2. Store the FULL contents
3. Replace any placeholders like [N], [X], [plan-file]
4. Use the ENTIRE modified template as the agent prompt

**WRONG:**
```
Prompt: "Implement phase 1 using the coder template"
```

**CORRECT:**
```
Prompt: "# Coder Agent Template

You are the coder agent for a multi-agent implementation workflow.

## Your Task

Implement Phase 1, Step 1 from plans/detailed-plan.md

[... FULL template contents with [N]=1, [X]=1 ...]"
```

## MAIN THREAD OUTPUT RULES

**ALLOWED:**
- "Launching planner agent."
- "Plan written. Committed."
- "Launching coder for phase 1, step 1 (files: foo.ts, bar.ts)."
- "Code committed."

**FORBIDDEN:**
- Explaining what the agent did
- Showing code snippets
- Summarizing agent output
- Discussing architecture
- Anything longer than 2 sentences

## TROUBLESHOOTING

If you catch yourself doing any of these, STOP immediately:

- [ ] Reading files in main thread → Launch agent instead
- [ ] Writing code in main thread → Launch coder agent
- [ ] Exploring codebase in main thread → Planner already did this
- [ ] Writing >2 sentences per step → Delete and write 1 sentence
- [ ] Not committing after agent → Go back and commit
- [ ] Using cat/grep in agents → Remind agents to use Read/Grep tools

## DETECTION

User phrases that trigger this workflow:
- "Implement the plan in plans/[file].md"
- "Use multi-agent workflow"
- "Follow the workflow to implement"

When you see these: Start at STEP 0 immediately.

## CRITICAL REMINDERS

- Every agent gets subagent_type="general-purpose"
- Every agent prompt = FULL template contents (not a reference)
- Commit after EVERY agent (planner, coder, tester, reviewer, fixer)
- Main thread stays under 2 sentences per agent
- All logs go to files, never conversation
- Coder agents: 3 files max per run
