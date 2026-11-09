# Work batches

Local issue tracker. Each batch of work is one folder, worked through the main flow: grill → spec (if needed) → tickets → implement.

| Batch                                 | Kind          | Status  | Spec | PRs                 |
| ------------------------------------- | ------------- | ------- | ---- | ------------------- |
| [01-first-version](01-first-version/) | first version | done    | yes  | #1–#14              |
| [02-play-feel](02-play-feel/)         | fixes         | done    | no   | #15–#18             |
| — (outside a batch)                   | fixes, deploy | done    | —    | #19–#22             |
| [03-readability](03-readability/)     | fixes         | done    | no   | #24 (plan), #25–#32 |
| [04-clear-hands](04-clear-hands/)     | fixes         | planned | no   | #33, #34 (plan)     |

Kinds: first version, feature, fixes. Status: planned, in progress, done.

## Naming

- Folder: `NN-<outcome>`, numbered in the order the work starts; the name says what the batch delivers, not "tweaks" or "fixes-2".
- Never renumber a batch once its PRs are merged.

## Inside a batch

- `request.md`: the raw input as given (a list of adjustments, screenshots it points to), unedited apart from ids. Only when the batch starts from such a list.
- `spec.md`: only when the batch needs one (shared rules, new terms, several tickets on the same screens).
- `issues/NN-<slug>.md`: one file per ticket, numbered from 01, with **Blocked by**, **Status** (todo / done) and a checklist. Worked in number order, respecting Blocked by.
- The last ticket syncs design and docs with the app: local boards in `docs/design/`, the online design canvas, the product brief, and this index. Blocked by every other ticket.
- `images/NN-<what>.png`: named after the ticket they belong to. Crop to the app; no desktop, tabs or bookmarks.

## When a batch starts or ends

- Add or update its row above.
- Branch per ticket off `main` (`feat/`, `fix/`); the planning PR uses `plan/<batch>`.
