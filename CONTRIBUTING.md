# Contributing

## Branch workflow (agreed 2026-10-10)

- **No direct pushes to `master`.** All changes land via pull request.
- One feature branch per unit of work, branched off latest `master`:
  `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.
- Keep PRs small and single-purpose. PR description states what changed
  and how it was verified (build / health check / seeded counts).
- Merge via **Squash and merge** to keep `master` history linear.
- `main` is kept as a release pointer; `master` is the working branch
  PRs target.

## Enforcing it (repo admin, one time)

GitHub → repo **Settings → Branches → Add branch protection rule**:

1. Branch name pattern: `master`
2. Check **Require a pull request before merging**
   (recommended: required approvals = 1, dismiss stale approvals on push)
3. Check **Do not allow bypassing the above settings**
4. Save. Direct `git push origin master` will then be rejected for everyone.

## Local flow

```bash
git checkout master && git pull origin master
git checkout -b feat/my-change
# ... work, verify build ...
git add -A && git commit -m "Short summary"
git push -u origin feat/my-change
# open PR: base master <- compare feat/my-change, merge, delete branch
```
