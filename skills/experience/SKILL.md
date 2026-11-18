---
name: experience
description: Walks a real user journey through the running product, as the intended user would, and reports the friction they meet in comprehension, feedback, waiting, empty and error states, recovery, keyboard and focus, accessibility and small screens, judged against what the product is for. Reproducible findings come with evidence and the smallest worthwhile improvement. Investigates and recommends; changes the product only when asked to fix.
argument-hint: "[journey, task or user to examine]"
disable-model-invocation: true
---

# Experience

The journey to examine: $ARGUMENTS

Answer one question: what friction does a person meet while trying to complete this task? The answer comes from using the product, not from reading its code, and it is judged against what the product is for, not against generic UX rules.

## Set up

Read `PRODUCT.md`, `DESIGN.md`, `ARCHITECTURE.md` and other adopted decisions when they exist and bear on this journey. They say what is intended; they are not evidence of what happens.

State, briefly, before you start:

- **Who:** the user or role, from the product's documents or the request; if you have to guess, say so.
- **Task:** what they are trying to get done.
- **Start:** where they begin and with what data or account state.
- **Success:** what done looks like for them, and what outcome the product wants it to lead to.
- **Conditions:** device, viewport, input method and anything else that matters here.

Ask only when the journey itself is unclear. Otherwise state your choice and continue.

Use the running product: a local server, a preview deployment, or a simulator, driven through whatever browser or device tools are available. Do not install tools for this. Use test data and test accounts; do not send, pay for, publish or delete anything real, and stop before any step that would.

## Walk

Go through the journey as the user would, through the interface. At each step, note what you saw, what the person would expect, and where they would hesitate, misread or get stuck. Look at what you report; when you could not see something, say so.

Pay attention to what matters for this journey:

- Whether the person understands where they are, what to do next and what happened.
- Affordances, navigation, and steps or decisions that add effort without adding value.
- Feedback and system status while waiting, and loading, empty and error states.
- Recovery: after a failed action, can the person tell what went wrong and get back on track without losing work?
- Keyboard use, focus order and visibility, and what assistive technology would announce.
- Smaller screens and other conditions the intended user actually has.

Go past the happy path where it is relevant and safe: invalid input, an interrupted step, a slow or failed request, going back, a second attempt. A journey that succeeds on the happy path can still fail the person the first time something goes wrong.

Then step back: does the experience help this user reach the outcome the product exists for? A flow can work correctly and still miss its purpose.

## Report

Lead with the journey, the user and the starting state, and whether the person can complete the task. Then the material findings, highest impact on the user first. For each:

- Where it happens and the steps to reproduce it.
- What you observed.
- Why it matters for this user and this product.
- The kind of finding and your confidence.
- The smallest improvement worth making.

Kinds of finding are not interchangeable, so label each one:

- **Reproduced:** you saw it happen and can repeat it.
- **Tool finding:** reported by an accessibility or audit tool. An automated scan catches only part of what matters and does not establish compliance.
- **Hypothesis:** a likely usability problem you reasoned about. Only research with real people would show whether they struggle.
- **Opinion:** an aesthetic or preference judgement.
- **Not checked:** what this walk could not cover.

If the product could not be run, say so first. A source-level or screenshot-level review can still help, but label every finding by what it rests on and do not present it as observed behaviour.

Leave out praise padding and findings you cannot support. Stay on the chosen journey rather than auditing every page; mention anything serious you noticed elsewhere in one line.

## Boundaries

Investigate and recommend. Change the product only when the user asks for fixes, and then verify each fix by walking the same steps again.
