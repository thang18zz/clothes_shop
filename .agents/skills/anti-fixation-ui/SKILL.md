---
name: anti-fixation-ui
description: Design and implement user interfaces using anti-fixation, human-centered, task-first reasoning. Prevent generic AI-looking UI by deriving information architecture, interaction, hierarchy, components, and visual language from the actual user goal and context; explore multiple concepts before converging; justify every visible element; preserve accessibility, responsiveness, usability, and product identity; and reject decorative or conventional patterns that do not serve the current task.
---

# Anti-Fixation Human-Centered Generative Design

## Purpose

Use this skill whenever designing, generating, reviewing, refactoring, or implementing a user interface.

The objective is to prevent a common failure mode of generative AI:

> Producing a plausible, polished, but generic interface by copying high-probability UI patterns instead of deriving the interface from the actual user, task, information, constraints, and product identity.

This skill treats UI design as a reasoning problem before it becomes a styling problem.

The agent MUST NOT begin from:

- a component library;
- a favorite layout;
- a common SaaS template;
- an arbitrary visual trend;
- the first plausible concept;
- "modern UI" conventions;
- screenshots remembered from unrelated products.

The agent MUST begin from:

- user goal;
- task;
- context;
- content;
- information priority;
- interaction requirements;
- constraints;
- risk;
- product identity.

The desired outcome is not "different for the sake of being different."

The desired outcome is:

> A UI whose structure and appearance can be explained by the product's actual purpose.

---

# 1. Core invariant

Before creating any meaningful UI element, answer:

**Why does this element need to exist for this user, in this task, in this context?**

If there is no concrete answer, remove it.

A UI is not better because it has more:

- cards;
- gradients;
- sections;
- animations;
- icons;
- charts;
- panels;
- components;
- whitespace;
- "modern" patterns.

A UI is better when it makes the intended task:

- easier to understand;
- easier to perform;
- harder to perform incorrectly;
- easier to recover from;
- more efficient;
- more trustworthy;
- more appropriate to context.

---

# 2. Anti-fixation rule

The first plausible design is a hypothesis, not the answer.

The agent MUST NOT immediately implement the first layout that comes to mind.

For non-trivial UI work, consider at least three structurally distinct concepts internally before high-fidelity design or implementation.

Concepts must differ in information architecture or interaction model, not merely styling.

---

# 3. Required design pipeline

Use this pipeline unless the task is trivial:

```text
GOAL → USER → TASKS → CONTEXT → CONTENT / DATA → INFORMATION PRIORITY → CONSTRAINTS / RISKS → ALTERNATIVE CONCEPTS → CONCEPT SELECTION → INFORMATION ARCHITECTURE → INTERACTION MODEL → STATE MODEL → VISUAL HIERARCHY → DESIGN LANGUAGE → COMPONENTS → IMPLEMENTATION → EVALUATION
```

---

# 4. Anti-generic pattern detector

The following patterns require explicit justification.

## Layout patterns
- dashboard sidebar without a navigation need;
- 3-column feature grid;
- four metric cards by default;
- hero section inside application workflows;
- excessive card nesting;
- card for every piece of content;
- arbitrary right-side insight panel.

## Visual patterns
- purple-blue gradient;
- glassmorphism;
- glow effects;
- excessive rounded-xl / rounded-2xl;
- pill-shaped everything;
- gradient text;
- decorative blobs;
- random sparkle/star icons;
- excessive shadows;
- icon inside every heading.
