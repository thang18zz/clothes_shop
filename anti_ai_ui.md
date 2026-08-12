---
name: anti-fixation-ui
description: Design and implement user interfaces using anti-fixation, human-centered, task-first reasoning. Prevent generic AI-looking UI by deriving information architecture, interaction, hierarchy, components, and visual language from the actual user goal and context; explore multiple concepts before converging; justify every visible element; preserve accessibility, responsiveness, usability, and product identity; and reject decorative or conventional patterns that do not serve the current task.
license: MIT
compatibility: opencode
metadata:
  framework: anti-fixation-human-centered-generative-design
  domain: ui-ux
  mode: goal-task-first
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

Meaningful alternatives can include:

- task-first workflow;
- content-first workspace;
- search-first interface;
- command-driven interface;
- progressive disclosure;
- master-detail;
- single-canvas workspace;
- timeline;
- table-centric;
- document-centric;
- conversational;
- wizard;
- direct manipulation.

Bad alternatives:

- blue version;
- purple version;
- same cards with different radius;
- same dashboard with another icon set.

Compare alternatives before converging.

---

# 3. Required design pipeline

Use this pipeline unless the task is trivial:

```text
GOAL
  ↓
USER
  ↓
TASKS
  ↓
CONTEXT
  ↓
CONTENT / DATA
  ↓
INFORMATION PRIORITY
  ↓
CONSTRAINTS / RISKS
  ↓
ALTERNATIVE CONCEPTS
  ↓
CONCEPT SELECTION
  ↓
INFORMATION ARCHITECTURE
  ↓
INTERACTION MODEL
  ↓
STATE MODEL
  ↓
VISUAL HIERARCHY
  ↓
DESIGN LANGUAGE
  ↓
COMPONENTS
  ↓
IMPLEMENTATION
  ↓
EVALUATION
```

Do not reverse this into:

```text
component library
  ↓
cards
  ↓
layout
  ↓
content
```

---

# 4. Goal model

Define the primary user goal as an outcome, not a screen.

Good:

- download the correct file;
- understand current project health;
- compare products;
- resolve an incident;
- edit a document;
- submit a payment;
- monitor a process;
- find an item quickly.

Bad:

- use the dashboard;
- click the button;
- view the page;
- navigate the sidebar.

Determine:

- primary goal;
- secondary goals;
- frequency;
- urgency;
- consequences of failure;
- expertise level;
- interruption level;
- information needed before action;
- information needed after action.

The primary visual hierarchy should reflect the primary goal.

---

# 5. Task decomposition

Break the goal into real tasks.

For each task identify:

- trigger;
- required information;
- decision;
- action;
- feedback;
- completion state;
- failure states;
- recovery path.

Example:

```text
Goal:
Download a video.

Task:
1. Provide URL.
2. System validates URL.
3. System identifies media.
4. User selects format.
5. User understands quality / size tradeoff.
6. User starts download.
7. System reports progress / completion.
8. Failure can be retried or corrected.
```

The UI should mirror the task logic.

Do not insert unrelated marketing structures inside a task flow unless the product actually needs them.

---

# 6. User model

Determine the actual user profile relevant to interaction:

- beginner vs expert;
- occasional vs frequent;
- mobile vs desktop;
- keyboard-heavy vs pointer-heavy;
- consumer vs professional;
- accessibility requirements;
- stressful vs relaxed context;
- high-information vs low-information tolerance;
- technical vocabulary;
- trust requirements.

Do not design for a fictional generic "average user" when the product clearly targets a specific audience.

---

# 7. Context model

A correct interface in one context can be wrong in another.

Consider:

- device;
- viewport;
- input method;
- network conditions;
- time pressure;
- environmental distraction;
- privacy;
- session duration;
- frequency of use;
- consequences of mistakes;
- collaborative vs individual use.

Examples:

A monitoring console used for hours can justify dense information.

A first-time onboarding flow may require strong progressive disclosure.

A destructive administration tool may require explicit confirmation and object context.

---

# 8. Content-first rule

Real content must influence design.

Do not validate a design only with:

```text
Lorem ipsum
Card title
Description
Metric 01
```

Use realistic:

- text length;
- names;
- file names;
- numbers;
- dates;
- errors;
- empty states;
- long values;
- localization expansion;
- user-generated content;
- images;
- tables;
- labels.

A design that only works with ideal placeholder content is incomplete.

---

# 9. Information hierarchy

Rank information before styling:

- PRIMARY;
- SECONDARY;
- SUPPORTING;
- EXCEPTION;
- HIDDEN-UNTIL-NEEDED.

The UI hierarchy must reflect this ranking.

Primary information should not compete with decoration.

Secondary information should not dominate.

Rare configuration should not occupy permanent high-priority space.

Errors and critical warnings may temporarily override normal hierarchy.

---

# 10. Information architecture

Determine how information is grouped and navigated.

Ask:

- What belongs together?
- What must remain visible together?
- What can be deferred?
- What is global?
- What is local to an object?
- What is contextual?
- What must persist across tasks?
- What requires comparison?

Do not create navigation categories just because templates commonly use:

```text
Dashboard
Analytics
Reports
Settings
```

Navigation must arise from the product's information model.

---

# 11. Interaction-first rule

NEVER begin visual styling before the interaction model is established.

Define:

- what users can act on;
- when they can act;
- what state changes;
- what feedback follows;
- what can fail;
- how users recover;
- what is reversible;
- what is destructive;
- what can happen concurrently.

The interaction must still make sense without gradients, shadows, illustrations, or visual effects.

---

# 12. State model

Every interactive UI must account for applicable states.

Inspect:

- initial;
- loading;
- success;
- empty;
- partial data;
- validation error;
- operation error;
- dependency failure;
- permission denied;
- disabled;
- selected;
- focused;
- unsaved;
- saving;
- saved;
- destructive confirmation;
- retry;
- stale data.

Do not design only the happy path.

---

# 13. Breadth-first exploration

For non-trivial interfaces, explore structure before fidelity.

Bad:

```text
prompt
→ one polished mockup
→ implementation
```

Preferred:

```text
problem
→ several low-cost concepts
→ compare
→ select interaction structure
→ refine
→ implement
```

Do not spend large implementation effort before structural decisions are justified.

---

# 14. Concept comparison

Compare concepts against task-relevant criteria such as:

- task completion speed;
- cognitive load;
- discoverability;
- error prevention;
- information density;
- learning cost;
- accessibility;
- mobile suitability;
- keyboard efficiency;
- implementation complexity;
- product identity;
- frequency of primary action;
- consequences of mistakes.

Do not select a concept because it looks more fashionable.

Select the concept that best serves the declared context.

---

# 15. Anti-generic pattern detector

The following patterns require explicit justification.

They are not banned; they are suspicious because generative systems overproduce them.

## Layout patterns

- dashboard sidebar without a navigation need;
- 3-column feature grid;
- four metric cards by default;
- hero section inside application workflows;
- pricing-card layout for non-commerce tasks;
- excessive card nesting;
- card for every piece of content;
- grid of identical rectangular panels;
- arbitrary right-side insight panel;
- generic activity feed;
- permanent search bar without search need.

## Visual patterns

- purple-blue gradient;
- glassmorphism;
- glow effects;
- excessive rounded-xl / rounded-2xl;
- pill-shaped everything;
- gradient text;
- oversized generic headline;
- decorative blobs;
- random sparkle/star icons;
- excessive shadows;
- icon inside every heading;
- decorative analytics charts.

## Content patterns

- "Welcome back";
- "Everything you need in one place";
- "Supercharge your workflow";
- "Powerful. Simple. Fast.";
- generic fake statistics;
- fake testimonials;
- invented recent activity;
- decorative status badges.

For any suspicious pattern ask:

**What user/task evidence requires it?**

If none exists, simplify or replace it.

---

# 16. Card rule

A card is appropriate when it represents a meaningful bounded unit.

Good:

- product;
- file;
- project;
- notification;
- independent summary;
- selectable object.

Bad:

- wrapping every heading and paragraph;
- turning each form field into a card;
- nesting cards for visual depth;
- using cards to avoid hierarchy decisions.

Prefer:

- whitespace;
- alignment;
- headings;
- dividers;
- lists;
- tables;
- semantic grouping;

before introducing another card.

---

# 17. Dashboard rule

A dashboard is justified when users need to monitor or compare multiple important signals simultaneously.

Before using one answer:

- Which decisions are made from it?
- Which metrics support those decisions?
- How frequently are they monitored?
- What action follows abnormal values?
- Which signals deserve first-screen priority?

A metric with no decision consequence may not belong.

---

# 18. Sidebar rule

Use persistent sidebar navigation when:

- multiple peer-level destinations exist;
- frequent switching is expected;
- viewport supports persistence;
- route visibility improves orientation.

Avoid it for:

- a simple one-task tool;
- a short workflow;
- a few destinations that fit naturally elsewhere;
- mobile-first workflows where it adds unnecessary hierarchy.

---

# 19. Form design

Forms should minimize effort and prevent mistakes.

Use:

- clear labels;
- appropriate input types;
- useful defaults;
- contextual help only where needed;
- inline validation;
- preserved input after recoverable errors;
- clear required/optional semantics;
- logical ordering;
- grouped related fields;
- clear action hierarchy.

Do not create multi-step wizards when one screen is simpler.

Do not force one screen when meaningful stages benefit from progressive disclosure.

---

# 20. Action hierarchy

Every screen should communicate:

- primary action;
- secondary actions;
- destructive actions;
- navigation actions.

Avoid several visually equal primary buttons.

Primary emphasis must follow user priority, not developer convenience.

Destructive actions must not be confused with ordinary progress actions.

---

# 21. Progressive disclosure

Hide complexity when it is:

- rarely needed;
- advanced;
- dependent on another choice;
- cognitively expensive when shown early.

Do not hide information required for informed decisions.

Progressive disclosure must preserve discoverability.

---

# 22. Expert and beginner workflows

For high-frequency expert tools, prioritize:

- efficiency;
- keyboard access;
- information density;
- predictable position;
- bulk operations when required;
- search/filter;
- persistent context.

Do not force consumer-style oversized cards and excessive whitespace into professional tools.

For unfamiliar beginner tasks, prioritize:

- orientation;
- clear next action;
- strong labels;
- progressive disclosure;
- examples;
- safe defaults;
- recoverable errors.

Do not make users understand internal architecture before completing their goal.

---

# 23. Visual hierarchy

Only after interaction and structure are decided, use:

- size;
- weight;
- spacing;
- alignment;
- grouping;
- contrast;
- position;
- typography;
- color;

to communicate hierarchy.

Do not rely only on color.

Avoid competing visual anchors.

The primary task should be visually identifiable quickly.

---

# 24. Typography and spacing

Use a restrained typography system appropriate to the product:

- page title;
- section heading;
- body;
- metadata;
- labels;
- code/data where applicable.

Avoid arbitrary font-size proliferation.

Avoid oversized marketing typography inside productivity workflows unless justified.

Use a consistent spacing scale.

Spacing should communicate grouping and hierarchy, not just "premium" emptiness.

---

# 25. Color and visual identity

Color should serve:

- hierarchy;
- brand;
- state;
- semantic status;
- selection;
- focus.

Do not generate gradients merely because the product lacks identity.

Ensure:

- readable contrast;
- semantic consistency;
- status is not color-only.

Derive product identity from:

- audience;
- domain;
- content;
- brand;
- tone;
- seriousness;
- frequency of use;
- product personality.

Identity must remain subordinate to usability.

---

# 26. Component-library rule

Component libraries are implementation tools, not design authorities.

Do not let:

- shadcn;
- Material;
- Bootstrap;
- Chakra;
- Ant Design;
- Tailwind presets;

determine the product architecture.

First decide the interaction and hierarchy.

Then choose or customize components that implement it.

---

# 27. Accessibility

Accessibility is part of correct interaction design.

Check applicable requirements:

- keyboard access;
- logical focus order;
- visible focus;
- semantic structure;
- form labels;
- error association;
- accessible names;
- contrast;
- reduced-motion behavior;
- touch target size;
- zoom/reflow;
- non-color status indicators.

Do not treat accessibility as optional polish.

Do not destroy native semantics merely for decorative effects.

---

# 28. Responsive design

Responsive design is not simply shrinking desktop UI.

For each supported viewport ask:

- What remains primary?
- What can move?
- What can collapse?
- What can become sequential?
- What should remain persistent?
- Is interaction still practical with touch?

Avoid:

- tiny desktop tables squeezed onto phones;
- hidden critical actions;
- horizontally clipped content;
- desktop sidebars forced into mobile without need.

Responsive behavior must preserve task priority.

---

# 29. Empty, loading, and error states

## Empty state

Explain what users can do next.

Use when relevant:

- explanation;
- primary action;
- example;
- import/create action;
- recovery guidance.

Do not manufacture fake data merely to make the screen look populated.

## Loading state

Use feedback appropriate to expected delay:

- immediate response;
- skeleton where layout stability matters;
- real progress when measurable;
- cancellation for long cancellable work.

Do not fake progress.

## Error state

Answer:

- What happened?
- What is affected?
- What can the user do?
- Is their data safe?
- Can they retry?
- Should input change?

Errors should be actionable.

---

# 30. Destructive actions and trust

For destructive actions:

- identify the exact object;
- communicate consequence;
- distinguish reversible from irreversible;
- require confirmation proportional to risk;
- preserve recovery when reasonable.

Do not overuse confirmation dialogs for harmless actions.

For trust-sensitive interfaces, avoid:

- fake precision;
- invented metrics;
- fake analytics;
- ambiguous save state;
- misleading success;
- hidden consequences.

Show uncertainty when the system is uncertain.

---

# 31. AI-specific UI

For AI-enabled products, distinguish generated output from verified system facts when it matters.

Consider:

- generated vs verified status;
- uncertainty;
- editability;
- regeneration;
- provenance;
- user control;
- failure/retry;
- model latency;
- partial streaming;
- unsafe or consequential actions.

Do not visually imply that unverified AI output is authoritative.

---

# 32. Preference alignment

When real user preferences are known, incorporate them before layout generation.

Preferences can include:

- density;
- visual style;
- navigation style;
- interaction mode;
- color;
- typography;
- motion;
- information priority;
- compactness;
- beginner/expert controls.

Do not infer arbitrary preferences from stereotypes.

If a preference conflicts with accessibility or serious usability constraints, preserve usability.

---

# 33. Existing product consistency

When modifying an existing product:

- inspect existing patterns;
- preserve established semantics;
- reuse stable design tokens;
- reuse meaningful components;
- preserve navigation logic;
- avoid introducing an unrelated visual language.

Anti-fixation does NOT mean redesigning everything to look unique.

Consistency with a real product is stronger evidence than novelty.

---

# 34. Novelty rule

Novelty has value only when it improves the task or product identity.

Do not pursue uniqueness at the expense of:

- learnability;
- accessibility;
- predictability;
- efficiency.

Use familiar conventions when the convention itself helps users.

Anti-fixation rejects unjustified convention, not convention itself.

---

# 35. Data visualization and tables

Create a chart only when visual comparison, distribution, trend, composition, or relationship helps answer a real question.

Before adding a chart ask:

- What question does it answer?
- What comparison matters?
- What decision follows?

If a number or table answers better, use that.

Use tables when users need:

- comparison across common fields;
- scanning;
- sorting;
- filtering;
- dense structured data.

Do not convert dense professional data into cards merely to look modern.

---

# 36. Search and navigation

Use search when:

- item count is significant;
- users know what they seek;
- navigation alone becomes inefficient.

Do not place decorative search inputs in every header.

Define search:

- scope;
- query timing;
- empty result behavior;
- ranking;
- filtering;
- reset/clear behavior.

Navigation should reflect users' mental model, not implementation architecture.

---

# 37. Motion

Use motion to communicate:

- transition;
- continuity;
- cause and effect;
- progress;
- spatial relationship.

Do not animate everything.

Avoid motion that:

- delays completion;
- reduces readability;
- distracts from primary actions;
- ignores reduced-motion preferences.

---

# 38. YAGNI integration

When the YAGNI skill is active, ask for every UI element:

**Is this necessary for the current user goal?**

Remove unsupported:

- settings;
- future navigation;
- unused tabs;
- fake analytics;
- fake notifications;
- marketing sections;
- decorative dashboards;
- controls with no behavior.

Do not remove:

- accessibility;
- validation;
- error recovery;
- important feedback;
- security-related interaction;
- required guidance.

YAGNI prevents feature and component inflation.

---

# 39. GOAL integration

When the GOAL skill is active, treat UI as complete only when applicable claims are verified.

Possible UI completion claims:

- primary task is completable;
- information hierarchy is correct;
- empty/loading/error states exist;
- keyboard interaction works;
- responsive behavior works;
- destructive operations are safe;
- accessibility requirements pass;
- implementation matches intended interaction;
- realistic content fits;
- supported states are represented.

GOAL prevents declaring the design finished after producing only the happy path.

---

# 40. Anti-pattern: component-first reasoning

Reject:

```text
We need:
- Navbar
- Sidebar
- Hero
- Cards
- Tabs
- Modal
```

unless derived from real tasks.

Prefer:

```text
User needs to:
1. locate a project;
2. inspect its state;
3. resolve the highest-priority issue.

Therefore:
- project selector;
- state summary;
- prioritized issue list;
- contextual resolution action.
```

Components follow requirements.

---

# 41. Anti-pattern: style-first reasoning

Reject starting with:

```text
Use a dark futuristic aesthetic with glass cards.
```

First decide:

- purpose;
- user;
- context;
- interaction;
- hierarchy.

Then determine whether the aesthetic supports the product.

---

# 42. Anti-pattern: fake sophistication

Do not add complexity to make software appear advanced.

Examples:

- unnecessary dashboards;
- meaningless charts;
- fake AI insights;
- invented system-health indicators;
- animated status dots with no real state;
- fake collaboration avatars;
- fake usage statistics.

The interface must represent actual system capability.

---

# 43. Anti-pattern: excessive minimalism

Anti-fixation also rejects empty "clean" interfaces that remove necessary information.

Do not hide:

- important state;
- consequences;
- context;
- labels;
- recovery paths;
- decision-critical data;

merely to achieve aesthetic minimalism.

Minimum visual clutter is not the same as minimum cognitive effort.

---

# 44. Internal design brief

Before implementation, establish internally:

```text
Primary user:
Primary goal:
Primary task:
Secondary tasks:
Context:
Critical information:
Primary action:
Important states:
Main risks:
Supported devices:
Visual identity:
Accessibility requirements:
```

Do not expose this unless useful.

---

# 45. Internal concept ledger

For non-trivial UI, compare at least three concepts internally.

Example:

| Concept | Strength | Weakness | Best context |
|---|---|---|---|
| task-first | fastest primary action | less overview | frequent execution |
| workspace | strong context | more complexity | expert repeated use |
| search-first | fast retrieval | weak browsing | large content set |

Choose based on evidence, not randomness.

---

# 46. Component justification ledger

For meaningful visible elements verify:

| Element | Purpose | User task | State | Decision |
|---|---|---|---|---|
| search | locate large item set | find item | query/results | keep |
| metric card | no decision | none | static | remove |
| warning | prevent destructive error | delete | confirmation | keep |

Use this internally to prevent visual bloat.

---

# 47. State coverage checklist

Before completion, inspect applicable states:

- [ ] initial;
- [ ] empty;
- [ ] loading;
- [ ] success;
- [ ] partial;
- [ ] invalid input;
- [ ] operation failure;
- [ ] permission failure;
- [ ] disabled;
- [ ] selected/focused;
- [ ] unsaved;
- [ ] saving;
- [ ] saved;
- [ ] destructive confirmation;
- [ ] retry/recovery;
- [ ] responsive layout.

Mark irrelevant states N/A rather than silently ignoring them.

---

# 48. Interaction quality checklist

Verify:

- [ ] primary goal is obvious;
- [ ] primary action is obvious;
- [ ] action hierarchy is clear;
- [ ] feedback follows actions;
- [ ] errors are actionable;
- [ ] recovery exists where needed;
- [ ] destructive actions are safe;
- [ ] repeated workflows are efficient;
- [ ] experts are not slowed unnecessarily;
- [ ] beginners are not forced to understand internal architecture.

---

# 49. Anti-AI-look checklist

Before finalizing ask:

- [ ] Could this interface have been generated for an unrelated SaaS product?
- [ ] Does it contain generic metric cards without task relevance?
- [ ] Is there an unnecessary sidebar?
- [ ] Is there a generic hero inside an application workflow?
- [ ] Are gradients/glows doing identity work without product rationale?
- [ ] Are there fake statistics or fake activity?
- [ ] Are cards being used instead of hierarchy?
- [ ] Was the first plausible concept implemented without alternatives?
- [ ] Did the component library dictate structure?
- [ ] Does realistic content fit?
- [ ] Is the layout derived from actual user decisions?

If several answers indicate generic generation, redesign the structure before polishing.

---

# 50. Falsification pass

Before declaring the design complete, try to prove it wrong.

Ask:

- Can the user identify the primary action quickly?
- Can a first-time user understand what this screen is for?
- Can an expert perform repeated actions efficiently?
- Does it survive empty data?
- Does it survive large data?
- Does it survive long text?
- Does it survive errors?
- Does it work without hover?
- Does it work with keyboard?
- Does it work on supported small viewports?
- Does zoom break it?
- Does it hide consequences?
- Is important state visible?
- Can decorative polish be removed without harming the task?
- Would another information structure be significantly better?

Fix blocking failures.

---

# 51. Stop condition

Stop designing when:

- task structure is coherent;
- required states are handled;
- interface is usable;
- accessibility requirements are met;
- responsive behavior is sufficient;
- product identity is appropriate;
- no unjustified visible element remains;
- remaining ideas are optional polish or speculative features.

Do not continue redesigning merely to make the UI more novel.

---

# 52. Required agent behavior

When this skill is active, the agent MUST:

1. start from goal, not components;
2. establish user/task/context before styling;
3. reason about information architecture before implementation;
4. consider multiple structural concepts for non-trivial UI;
5. justify major visible elements;
6. reject generic high-probability patterns when unsupported;
7. preserve familiar conventions when they genuinely improve usability;
8. account for important interaction states;
9. preserve accessibility;
10. design for supported responsive contexts;
11. use realistic content during evaluation;
12. maintain consistency with an existing product when applicable;
13. ensure visual identity serves the product instead of trend imitation;
14. perform an adversarial/falsification review;
15. stop when the interface is complete rather than maximally decorated.

---

# 53. Decision rule

When uncertain between two designs, prefer the one that:

1. better supports the primary task;
2. reduces cognitive load;
3. exposes necessary information at the right time;
4. prevents costly errors;
5. provides clearer feedback;
6. better fits the user's context;
7. requires less unnecessary UI;
8. remains accessible;
9. better reflects the real product;
10. introduces fewer speculative concepts.

Do not use visual novelty as the tie-breaker unless product identity explicitly requires it.

---

# 54. Summary principle

Use this invariant throughout design:

> Do not make the interface merely look designed.
> Make the interface behave as though someone deeply understood the user, the task, and the product.

The visual result should emerge from that understanding.

---

# 55. Reference basis

This skill is an engineering synthesis rather than a verbatim reproduction of a single publication.

Its conceptual basis combines:

- generative design fixation and design-fixation research;
- divergent-to-convergent concept exploration;
- human-centered design;
- task-centered interaction design;
- preference-aligned generative UI;
- breadth-first UI concept exploration;
- accessibility and usability engineering.

The operational rules above adapt those ideas for coding agents that must reason about, implement, and verify real interfaces.
