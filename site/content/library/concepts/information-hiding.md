---
title: Information Hiding
summary: Draw module boundaries around design decisions likely to change, so each decision lives in one place and the rest of the system cannot depend on it.
topic: software-design
byline: David Parnas · John Ousterhout
origin: source
keywords: [modularity, encapsulation, decomposition, information leakage, temporal decomposition, coupling]
sources:
  - title: On the Criteria To Be Used in Decomposing Systems into Modules
    author: David L. Parnas
    work: Communications of the ACM 15(12)
    publisher: ACM
    year: 1972
    kind: paper
    url: https://doi.org/10.1145/361598.361623
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20260510002131/https://dl.acm.org/doi/10.1145/361598.361623
    note: The DOI resolves to the ACM Digital Library, which refuses automated requests (HTTP 403) but is the canonical record. The Wayback snapshot is of the ACM landing page the DOI resolves to.
  - title: A Philosophy of Software Design
    author: John Ousterhout
    publisher: Yaknyam Press
    year: 2018
    kind: book
    url: https://web.stanford.edu/~ouster/cgi-bin/book.php
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261117232900/https://web.stanford.edu/~ouster/cgi-bin/book.php
    note: Second edition 2021. Information leakage and temporal decomposition are treated in the chapter on information hiding; the author's page describes the editions rather than the content.
relations:
  related: [deep-modules, strategic-programming, refactoring]
---

## The idea

A module should be organized around a decision it keeps secret, not around a step in a process. If a choice is likely to change, such as a data format, an algorithm or an external dependency, put it behind one interface so that changing it touches one module. Modularity is valuable only to the extent that it localizes change.

## What the source says

David Parnas made the argument in a short 1972 paper in Communications of the ACM. He took one small program, a keyword-in-context index, and decomposed it two ways. The first followed the flow of processing: input, shifting, sorting, output, each a module, which is what a flowchart suggests. The second gave each module one design decision to own, such as how lines are stored in memory, and exposed only operations on it.

Both versions work and can behave identically at run time. The difference shows up when things change. In the first decomposition, a change to the storage format ripples through nearly every module, because they all know it. In the second, it stays inside one. Parnas concluded that the criterion for a module boundary should be the hiding of a decision that is difficult or likely to change, and that the processing-step decomposition is almost always the wrong default.

John Ousterhout's *A Philosophy of Software Design* (2018) restates the idea and names its failure modes. Information leakage is when one design decision shows up in several modules, for example two classes that both understand the same file format. Temporal decomposition is Parnas's first design under another name: structuring code by the order in which things happen, which tends to spread one piece of knowledge across a reader, a modifier and a writer. Ousterhout's remedy is usually to merge the modules that share the knowledge, or to pull it into a new module of its own.

## Keel's perspective

This is the oldest idea in the software-design part of the Library and still the most useful question to ask of a boundary: what does this module know that nobody else needs to? If the answer is nothing, the boundary is decorative. If two modules know the same thing, the boundary is in the wrong place.

It matters more with coding agents, not less. An agent working on one file reads the interfaces around it. When decisions are hidden, the agent can make a local change safely. When they leak, a correct-looking edit in one place silently breaks the assumption held in three others.

## When to use it

- Splitting a growing file or service and deciding where the seams go.
- Reviewing a change that had to touch many modules for one reason.
- Wrapping a third-party API, a storage format or a protocol you might replace.
- Noticing that a pipeline's stages each parse or construct the same structure.

## Example

For example, an import feature might be written as three classes: one reads a CSV, one validates rows, one writes records. All three end up knowing the column layout. When a column is renamed, three files change. Reorganized around the decision, one module owns the file format and hands out typed rows; validation and persistence never see a column name, and the rename touches one file.

## Limitations

Hiding has a cost: every boundary is an interface someone must learn, and hiding the wrong thing forces callers to work around it. Parnas's criterion depends on predicting what will change, which is a judgment, not a rule. Encapsulation in the language sense, private fields with getters and setters, is often mistaken for information hiding; a class that exposes its internal representation through accessors hides nothing.
