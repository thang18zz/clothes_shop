---
name: goal
description: Determine whether a software task, feature, program, or release is genuinely complete using an evidence-backed completion assurance case. Decompose the intended goal into functional, quality, operational, safety, and risk claims; require objective evidence for every applicable claim; actively search for counterexamples; and refuse false "done" declarations when critical unknowns, failed gates, unsupported assumptions, regressions, or unresolved material risks remain.
---

# GOAL — Evidence-Based Software Completion

## Purpose

Decide whether software is **actually complete**, not merely implemented.

This skill defines completion as an **assurance claim supported by evidence**.

A program is complete only when:

> Within an explicitly declared scope and context of use, all applicable required behavior and quality obligations are satisfied, the evidence is reproducible and sufficient, critical counterexamples have been sought, no blocking contradiction remains, and no unresolved risk requires additional work before the intended use or release.

This is intentionally stronger than:

- "the code compiles";
- "tests pass";
- "the happy path works";
- "the requested function exists";
- "there are no TODOs";
- "the agent has nothing else to add".

No finite software process can prove metaphysical perfection or eliminate every possible future defect. Therefore this skill uses an operational definition of **comprehensive completion**: all obligations that matter for the declared goal are closed with adequate evidence, and residual risk is explicitly acceptable for that scope.

---

# 1. Theoretical basis

This skill combines two ideas.

## 1.1 Goal Structuring / assurance-case reasoning

Use a Goal Structuring Notation (GSN)-style argument:

- **Goal / Claim** — what must be true;
- **Context** — environment and scope in which it must be true;
- **Strategy** — how the claim is decomposed;
- **Sub-goals** — smaller claims that together establish the parent claim;
- **Evidence / Solution** — observations, tests, analyses, measurements, or artifacts supporting a claim;
- **Assumptions / Justifications** — conditions the argument depends on;
- **Defeaters / Counterarguments** — facts that could invalidate the claim.

A completion claim without evidence is not complete.

## 1.2 Software quality model

Use the SQuaRE family, especially ISO/IEC 25010:2023 product-quality thinking and ISO/IEC 25019:2023 quality-in-use thinking, as a coverage model so the agent does not mistake functional correctness for total product readiness.

The purpose is not to mechanically implement every possible quality attribute. The purpose is to evaluate **every relevant dimension**, mark irrelevant dimensions as N/A with justification, and prevent silent omissions.

---

# 2. Top-level completion claim

For any task, construct this implicit claim:

**G0 — The software is complete for the declared goal, scope, users, environment, and release/use context.**

G0 may be accepted only if every applicable subclaim is supported and no blocking defeater remains.

At minimum inspect:

1. goal and scope;
2. functional behavior;
3. correctness and invariants;
4. failure behavior;
5. interfaces and compatibility;
6. performance and resource use;
7. reliability and recovery;
8. security and privacy;
9. interaction/usability where applicable;
10. maintainability and change safety;
11. deployment/runtime readiness;
12. observability;
13. data and migration integrity;
14. documentation/configuration;
15. verification coverage;
16. unresolved risks and counterexamples.

Do not assume a dimension is irrelevant merely because the user did not mention it.

---

# 3. Completion is a gate, not an average score

Do NOT decide completion by averaging quality scores.

A program with:

- excellent maintainability but broken authentication;
- excellent test coverage but data corruption;
- excellent performance but incorrect results;

is not complete.

Use **hard gates**.

A verdict of COMPLETE requires:

- every BLOCKING applicable gate = PASS;
- no critical claim = UNKNOWN;
- no known high-severity unresolved defect;
- no unsupported critical assumption;
- no required acceptance criterion missing;
- no material regression discovered;
- evidence corresponds to the actual changed artifact/version.

Optional scores may summarize maturity but may never override a failed gate.

---

# 4. Completion states

Use these states internally.

## 4.1 UNDEFINED

The goal or scope is too ambiguous to know what "done" means.

## 4.2 PARTIAL

Some required behavior is not implemented.

## 4.3 IMPLEMENTED

Required behavior appears present, but evidence is incomplete.

## 4.4 VERIFIED

Implementation has evidence showing it conforms to specified requirements in tested conditions.

## 4.5 VALIDATED

Evidence also shows the software solves the intended user/system goal in its declared context.

## 4.6 RELEASE-READY

All applicable completion gates pass, operational requirements are satisfied, release artifacts/configuration are coherent, and no blocking risk remains.

## 4.7 COMPLETE

Use COMPLETE only when RELEASE-READY is appropriate for the user's requested scope.

For a library, local script, prototype, internal tool, or code-only task, "release-ready" must be interpreted according to the actual intended delivery context rather than forcing production deployment requirements.
