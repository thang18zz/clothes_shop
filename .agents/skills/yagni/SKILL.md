---
name: yagni
description: Apply YAGNI rigorously during software planning, implementation, refactoring, review, and debugging. Build only what is justified by the current goal, while preserving correctness, security, data integrity, compatibility, operability, and costly-to-reverse decisions. Use this skill to prevent speculative features, premature abstractions, unnecessary dependencies, over-generalized APIs, infrastructure excess, and accidental under-engineering disguised as simplicity.
---

# YAGNI — Evidence-Driven Minimal Engineering

## Purpose

Apply **You Aren't Gonna Need It (YAGNI)** as an engineering decision rule:

> Do not create behavior, structure, flexibility, infrastructure, or complexity for a hypothetical future need unless current evidence makes it necessary now.

The objective is **minimum sufficient engineering**, not minimum code.

A YAGNI-compliant solution must be:

- sufficient for the current goal;
- correct for the currently supported domain;
- safe for data and users;
- compatible with current contracts;
- testable and diagnosable enough to maintain;
- no more general, configurable, distributed, abstract, or extensible than current evidence requires.

YAGNI MUST NOT be used as an excuse to omit essential engineering.

---

# 1. Core invariant

For every proposed artifact or change, answer:

**What current requirement, observed failure, invariant, contract, operational constraint, or material risk requires this now?**

If no concrete answer exists, do not add it.

This applies to:

- features;
- abstractions;
- classes and interfaces;
- configuration;
- APIs and endpoints;
- database schema;
- dependencies;
- caches;
- queues;
- retries;
- background workers;
- plugin systems;
- microservices;
- generic frameworks;
- performance optimizations;
- compatibility layers;
- migration machinery;
- observability;
- CI/CD additions;
- documentation;
- test scaffolding;
- future-facing extension points.

---

# 2. Evidence hierarchy

Treat evidence in this order.

## Level A — Mandatory current evidence

Strongest justification.

Examples:

- explicit user requirement;
- acceptance criterion;
- current failing test representing intended behavior;
- reproduced bug;
- existing public contract;
- schema or protocol requirement;
- repository instruction;
- security or safety requirement;
- legal/compliance requirement;
- current production constraint;
- current platform limitation;
- data-integrity invariant;
- current deployment requirement.

Changes required by Level A evidence are not speculative.

## Level B — Necessary supporting engineering

Not necessarily user-visible, but required to make Level A behavior correct or sustainable.

Examples:

- validation required to prevent invalid state;
- rollback for a destructive migration;
- locking required to preserve a demonstrated concurrency invariant;
- bounds checks;
- authentication/authorization around a required endpoint;
- minimum logging needed to diagnose a required background process;
- tests protecting changed behavior;
- cleanup required so the requested change does not leave dead or contradictory code.

Level B work is allowed only when its relationship to current requirements is direct.

## Level C — High-confidence near-term constraint

Use sparingly.

Examples:

- a public API being created now whose irreversible shape would otherwise make a known next step prohibitively expensive;
- a data format that will be persisted for years and cannot practically be migrated later;
- a security boundary that is expensive or unsafe to retrofit;
- a hardware/platform constraint already selected for the current release.

Level C requires an explicit cost-of-delay or irreversibility argument.

## Level D — Speculation

Default action: **defer**.

Examples:

- "we might support more databases";
- "maybe this becomes multi-tenant";
- "we may need plugins";
- "this could scale to millions";
- "someone may reuse this class";
- "we may switch cloud providers";
- "future developers may want more options";
- "a design pattern would look cleaner";
- "let's make it generic just in case".

Do not implement Level D work.

---

# 3. Decision algorithm

For every meaningful proposed change:

1. **State the current goal.**
2. **Identify evidence** that requires the change.
3. **Classify the change** as:
   - REQUIRED;
   - SUPPORTING;
   - IRREVERSIBILITY-RISK;
   - SPECULATIVE.
4. If SPECULATIVE:
   - reject or defer it.
5. If REQUIRED or SUPPORTING:
   - find the smallest design that fully satisfies the evidence.
6. If IRREVERSIBILITY-RISK:
   - compare:
     - cost now;
     - cost later;
     - probability of needing it;
     - reversibility;
     - failure severity.
   - add only the minimum structure needed to avoid an unacceptable lock-in or safety risk.
7. Remove incidental complexity introduced by the chosen solution.
8. Verify the result against current requirements.
9. Stop when all current obligations are met.

Do not continue improving merely because improvement is possible.

---

# 4. Minimality test

A change is YAGNI-compliant only if all are true:

- removing it would break a current requirement, invariant, safety property, or required verification;
- there is no materially simpler implementation with equivalent current behavior;
- it does not introduce unused variability;
- it does not create a new concept without a current consumer;
- it does not expand the public surface without need;
- it does not increase operational burden without current benefit;
- it does not add a dependency when existing capabilities are sufficient;
- it does not solve a scale, platform, workflow, or domain that is not currently supported.

If any item fails, simplify or remove the change.
