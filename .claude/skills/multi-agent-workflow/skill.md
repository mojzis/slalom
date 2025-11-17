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
     description: "Create high-level implementation plan"
     prompt: [FULL contents of planner template with [plan-file] replaced]
   ```
5. After agent completes, output to user: "Plan written. Committing."
6. Commit:
   ```bash
   git add plans/detailed-plan.md && git commit -m "Add high-level implementation plan for [feature]"
   ```

**IMPORTANT:** This plan should be HIGH-LEVEL (brief phases, not detailed steps).

### STEP 1: SPLIT PLAN INTO PHASE FILES (MAIN THREAD ONLY)

**DO THIS:**

1. Read plans/detailed-plan.md
2. Identify all phases (usually marked with ## Phase 1, ## Phase 2, etc.)
3. For each phase N, create a separate file:
   ```
   Write tool:
     file_path: plans/phase-N.md
     content: [ONLY Phase N section from detailed-plan.md]
   ```
4. Count total phases
5. Commit all phase files:
   ```bash
   git add plans/phase-*.md && git commit -m "Split plan into phase files"
   ```
6. Output to user: "Split into N phases. Committed."
7. Do NOT output plan contents to user

**IMPORTANT:** These phase files are HIGH-LEVEL. Detailing happens per-phase later.

### STEP 2: EXECUTE EACH PHASE

**FOR EACH PHASE N, DO THIS FULL CYCLE:**

#### 2.1 LAUNCH PHASE DETAILER AGENT (NEW!)

**DO THIS:**

1. Read the phase-detailer template:
   ```
   Read tool: /home/user/slalom/.claude/skills/multi-agent-workflow/templates/phase-detailer.md
   ```
2. Replace `[N]` with phase number in template
3. Replace `[N-1]` and `[N+1]` with appropriate numbers (or remove if N=1 or last phase)
4. Launch agent:
   ```
   Task tool:
     subagent_type: "general-purpose"
     description: "Create detailed plan for phase N"
     prompt: [FULL phase-detailer template with [N], [N-1], [N+1] replaced]
   ```
5. Output to user: "Detailing phase N."
6. After agent completes, output: "Phase N detailed. Committing."
7. Commit:
   ```bash
   git add plans/phase-N-detailed.md && git commit -m "Add detailed plan for phase N"
   ```

**WHY:** Agent reads high-level phase-N.md + neighbor phases + previous summary, creates detailed actionable plan.

#### 2.2 LAUNCH CODER AGENT(S)

**DO THIS:**

1. Read the coder template:
   ```
   Read tool: /home/user/slalom/.claude/skills/multi-agent-workflow/templates/coder.md
   ```
2. Replace `[N]` with phase number in template
3. **CRITICAL:** Change template to read `plans/phase-[N]-detailed.md` (not phase-[N].md)
4. Check how many files phase-N-detailed.md requires (can peek if needed)
5. If >3 files: Split into multiple coder runs (3 files max each)
6. Launch agent:
   ```
   Task tool:
     subagent_type: "general-purpose"
     description: "Implement phase N"
     prompt: [FULL coder template with [N] replaced and detailed plan reference]
   ```
7. Output to user: "Coding phase N (files: a.ts, b.ts, c.ts)."
8. After agent completes, output: "Code committed."
9. Commit:
   ```bash
   git add [files modified by agent] && git commit -m "Implement phase N"
   ```
10. If more files remain: Repeat 2.2 for remaining files

**WHY:** Agent reads plans/phase-N-detailed.md (specific steps, not high-level).

#### 2.3 LAUNCH TESTER AGENT

**DO THIS:**

1. Read the tester template:
   ```
   Read tool: /home/user/slalom/.claude/skills/multi-agent-workflow/templates/tester.md
   ```
2. Replace `[N]` with phase number in template
3. **CRITICAL:** Change template to read `plans/phase-[N]-detailed.md` (not phase-[N].md)
4. Launch agent:
   ```
   Task tool:
     subagent_type: "general-purpose"
     description: "Test phase N implementation"
     prompt: [FULL tester template with [N] replaced and detailed plan reference]
   ```
5. Output to user: "Testing phase N."
6. After agent completes, output: "Tests committed."
7. Commit:
   ```bash
   git add logs/phase-N-tests.md tests/ && git commit -m "Add tests for phase N"
   ```

**WHY:** Agent reads plans/phase-N-detailed.md to know what to test.

#### 2.4 LAUNCH REVIEWER AGENT

**DO THIS:**

1. Read the reviewer template:
   ```
   Read tool: /home/user/slalom/.claude/skills/multi-agent-workflow/templates/reviewer.md
   ```
2. Replace `[N]` with phase number in template
3. **CRITICAL:** Change template to read `plans/phase-[N]-detailed.md` (not phase-[N].md)
4. Launch agent:
   ```
   Task tool:
     subagent_type: "general-purpose"
     description: "Review phase N implementation"
     prompt: [FULL reviewer template with [N] replaced and detailed plan reference]
   ```
5. Output to user: "Reviewing phase N."
6. After agent completes, output: "Review committed."
7. Commit:
   ```bash
   git add logs/phase-N-review.md && git commit -m "Add review for phase N"
   ```

**WHY:** Agent reads plans/phase-N-detailed.md to verify against plan.

#### 2.5 FIX ISSUES (IF REVIEWER FOUND ANY)

**DO THIS:**

1. Read logs/phase-N-review.md to check for issues
2. If CRITICAL or MAJOR issues found:
   a. Read the coder template again
   b. Replace [N] with phase number
   c. Change template to read `plans/phase-[N]-detailed.md`
   d. Modify the task line to say "Fix issues from logs/phase-N-review.md for Phase [N]"
   e. Launch agent:
      ```
      Task tool:
        subagent_type: "general-purpose"
        description: "Fix issues from phase N review"
        prompt: [FULL coder template modified for fixes]
      ```
   f. Output to user: "Fixing issues in phase N."
   g. After agent completes, output: "Fixes committed."
   h. Commit:
      ```bash
      git add [fixed files] && git commit -m "Fix issues from phase N review"
      ```
3. If no issues or only MINOR issues: Skip to 2.6

**WHY:** Agent reads both plans/phase-N-detailed.md and logs/phase-N-review.md.

#### 2.6 LAUNCH PHASE FINALIZER AGENT (NEW!)

**DO THIS:**

1. Read the phase-finalizer template:
   ```
   Read tool: /home/user/slalom/.claude/skills/multi-agent-workflow/templates/phase-finalizer.md
   ```
2. Replace `[N]` with phase number in template
3. Launch agent:
   ```
   Task tool:
     subagent_type: "general-purpose"
     description: "Finalize phase N"
     prompt: [FULL phase-finalizer template with [N] replaced]
   ```
4. Output to user: "Finalizing phase N."
5. After agent completes, output: "Phase N complete. Committed and pushed."
6. Commit:
   ```bash
   git add logs/phase-N-summary.md && git commit -m "Finalize phase N with summary"
   git push -u origin [branch-name]
   ```

**WHY:** Agent verifies completion, runs smoke tests, commits, pushes, writes summary for next phase.

#### 2.7 MOVE TO NEXT PHASE

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
     content: [Brief summary of all phases completed]
   ```
2. Commit:
   ```bash
   git add logs/completion-summary.md && git commit -m "Add completion summary"
   git push -u origin [branch-name]
   ```
3. Output to user: "All phases complete. Summary in logs/completion-summary.md."
4. STOP - Do NOT write lengthy explanation

## TEMPLATE READING INSTRUCTIONS

When instructions say "Read the X template", you MUST:

1. Use Read tool on the template file path
2. Store the FULL contents
3. Replace any placeholders like [N], [X], [plan-file], [N-1], [N+1]
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

Implement Phase 1 from plans/phase-1-detailed.md

[... FULL template contents with [N]=1 ...]"
```

## MAIN THREAD OUTPUT RULES

**ALLOWED:**
- "Launching planner agent."
- "Plan written. Committing."
- "Split into 5 phases. Committed."
- "Detailing phase 1."
- "Phase 1 detailed. Committing."
- "Coding phase 1 (files: foo.ts, bar.ts)."
- "Code committed."
- "Testing phase 1."
- "Tests committed."
- "Reviewing phase 1."
- "Review committed."
- "Finalizing phase 1."
- "Phase 1 complete. Committed and pushed."
- "Moving to phase 2..."

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
- [ ] Exploring codebase in main thread → Detailer/planner already did this
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
- Commit after EVERY agent (planner, detailer, coder, tester, reviewer, fixer, finalizer)
- Push after EVERY phase (in finalizer step)
- Main thread stays under 2 sentences per agent
- All logs go to files, never conversation
- Coder agents: 3 files max per run
- Phase detailer uses NEIGHBOR CONTEXT (phase N-1 summary, phase N+1 plan)
- Execution agents read DETAILED plans (phase-N-detailed.md), not high-level (phase-N.md)
