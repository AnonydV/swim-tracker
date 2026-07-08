---
name: deployment-notes
description: Notes de deploiement GitHub Pages pour HIPLAN / swim-tracker
metadata:
  type: project
  updated: 2026-07-06
---

# GitHub Pages deployment notes

## 2026-07-06 - Fix duplicate Pages artifacts

Context:
- User reported GitHub Actions deployment failure in `actions/deploy-pages@v4`.
- Error: `Multiple artifacts named "github-pages" were unexpectedly found for this workflow run. Artifact count is 2.`
- Node 20 deprecation warning appeared in the log, but it was not the blocking error.

Root cause:
- `actions/upload-pages-artifact` defaults to artifact name `github-pages`.
- `actions/deploy-pages` also defaults to deploying artifact name `github-pages`.
- If the workflow run ends up with more than one artifact using that same name, deployment fails because Pages expects a single matching artifact.

Change made:
- File: `.github/workflows/deploy.yml`
- Updated `actions/upload-pages-artifact@v3` to `actions/upload-pages-artifact@v5`.
- Updated `actions/deploy-pages@v4` to `actions/deploy-pages@v5`.
- Added a unique artifact name per workflow run:
  `github-pages-${{ github.run_id }}-${{ github.run_attempt }}`
- Passed the same value to `deploy-pages` via `artifact_name`.

Resulting workflow shape:

```yaml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v5
  with:
    name: github-pages-${{ github.run_id }}-${{ github.run_attempt }}
    path: '.'

- name: Deploy to GitHub Pages
  id: deployment
  uses: actions/deploy-pages@v5
  with:
    artifact_name: github-pages-${{ github.run_id }}-${{ github.run_attempt }}
```

Follow-up:
- Commit and push `.github/workflows/deploy.yml`.
- Re-run the GitHub Actions deployment.
- If deployment still fails, check whether another workflow in GitHub creates a Pages artifact in the same run or whether GitHub Pages source is configured correctly under repository Settings > Pages.
