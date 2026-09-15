# Sports legacy archive

Safe backup of the pre–PropShopX sports route tree (moved from `app/sports/` on 2026-09-15).

## Contents

- `app-sports/` — former Next.js routes (`page.tsx`, sport/league subpages, layout)

## Restore

From the repo root:

```bash
# Remove the slim rebuilt sports home first (or merge carefully)
rm -rf app/sports

# Put the legacy tree back
mv _archive/sports-legacy/app-sports app/sports
```

Or restore from git history if this folder was committed.

## Note

Public assets (`public/sports_icons`, league banners) were **not** moved — they remain in `public/` for the new sports home.
