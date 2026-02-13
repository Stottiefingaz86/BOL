#!/usr/bin/env python3
"""Add My Feed to sub nav on all sport pages."""
import os
import glob

base = os.path.dirname(os.path.abspath(__file__))
sports_dir = os.path.join(base, 'app', 'sports')

# Find all .tsx files with the sub nav pattern
files = glob.glob(os.path.join(sports_dir, '**', 'page.tsx'), recursive=True)

# Skip my-feed page (already updated)
skip = os.path.join(sports_dir, 'my-feed', 'page.tsx')

count = 0
for filepath in sorted(files):
    if filepath == skip:
        continue
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Check if file has the sub nav pattern
    if "sports_icons/all sports.svg" not in content:
        continue
    
    # Skip if already has My Feed in sub nav
    if "sports_icons/my-feed.svg" in content:
        print(f"  SKIP (already has My Feed): {os.path.relpath(filepath, base)}")
        continue
    
    original = content
    
    # 1. Add My Feed item to the sub nav array (before All Sports)
    old_nav = "{ icon: '/sports_icons/all sports.svg', label: 'All Sports' },"
    new_nav = "{ icon: '/sports_icons/my-feed.svg', label: 'My Feed' },\n                  { icon: '/sports_icons/all sports.svg', label: 'All Sports' },"
    content = content.replace(old_nav, new_nav, 1)  # Replace first occurrence only
    
    # 2. Add My Feed route to sportRoutes (before All Sports)
    old_routes = "'All Sports': '/sports',"
    new_routes = "'My Feed': '/sports/my-feed',\n                          'All Sports': '/sports',"
    content = content.replace(old_routes, new_routes, 1)  # Replace first occurrence only
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        count += 1
        print(f"  Updated: {os.path.relpath(filepath, base)}")
    else:
        print(f"  NO CHANGE: {os.path.relpath(filepath, base)}")

print(f"\nDone! Updated {count} files.")
