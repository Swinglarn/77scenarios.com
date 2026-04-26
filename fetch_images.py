#!/usr/bin/env python3
"""
Fetch Wikipedia thumbnails for all 77scenarios.com characters.
Saves to ./images/characters/{slug}.jpg
Run from repo root: python3 fetch_images.py
"""

import re
import os
import time
import urllib.request
import urllib.parse
import json

# ── Read character.html ──────────────────────────────────────────────────────
with open('character.html', 'r', encoding='utf-8') as f:
    content = f.read()

people = re.findall(r"\{name:`([^`]+)`,ctx:`([^`]+)`,type:'([^']+)'", content)
print(f"Found {len(people)} characters\n")

def slugify(name):
    return re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', name.lower()))

def wiki_search_title(name, ctx):
    """
    Try to find the best Wikipedia article title for a character.
    Strategy: try exact name first, then name + ctx keyword.
    Returns the Wikipedia page title string or None.
    """
    # Strip parenthetical from ctx for a cleaner keyword
    ctx_clean = re.split(r'[,(]', ctx)[0].strip()

    candidates = [
        name,
        f"{name} ({ctx_clean})",
        f"{name} (character)",
        name.split('/')[0].strip(),  # "Tony Stark / Iron Man" -> "Tony Stark"
    ]

    for query in candidates:
        url = (
            'https://en.wikipedia.org/api/rest_v1/page/summary/'
            + urllib.parse.quote(query.replace(' ', '_'))
        )
        try:
            req = urllib.request.Request(url, headers={'User-Agent': '77scenarios-bot/1.0'})
            with urllib.request.urlopen(req, timeout=8) as r:
                data = json.loads(r.read())
                if data.get('thumbnail', {}).get('source'):
                    return query, data['thumbnail']['source']
        except Exception:
            pass
        time.sleep(0.1)

    # Fallback: Wikipedia opensearch
    search_url = (
        'https://en.wikipedia.org/w/api.php?action=opensearch&search='
        + urllib.parse.quote(name)
        + '&limit=1&format=json'
    )
    try:
        req = urllib.request.Request(search_url, headers={'User-Agent': '77scenarios-bot/1.0'})
        with urllib.request.urlopen(req, timeout=8) as r:
            results = json.loads(r.read())
            if results[1]:
                found_title = results[1][0]
                url = (
                    'https://en.wikipedia.org/api/rest_v1/page/summary/'
                    + urllib.parse.quote(found_title.replace(' ', '_'))
                )
                req2 = urllib.request.Request(url, headers={'User-Agent': '77scenarios-bot/1.0'})
                with urllib.request.urlopen(req2, timeout=8) as r2:
                    data = json.loads(r2.read())
                    if data.get('thumbnail', {}).get('source'):
                        return found_title, data['thumbnail']['source']
    except Exception:
        pass

    return None, None

def download_image(img_url, dest_path):
    """Download image and save as JPEG."""
    try:
        req = urllib.request.Request(img_url, headers={'User-Agent': '77scenarios-bot/1.0'})
        with urllib.request.urlopen(req, timeout=10) as r:
            data = r.read()
        with open(dest_path, 'wb') as f:
            f.write(data)
        return True
    except Exception as e:
        return False

# ── Output directory ─────────────────────────────────────────────────────────
os.makedirs('images/characters', exist_ok=True)

found = []
not_found = []

for i, (name, ctx, type_) in enumerate(people):
    slug = slugify(name)
    dest = f'images/characters/{slug}.jpg'

    # Skip if already downloaded
    if os.path.exists(dest) and os.path.getsize(dest) > 5000:
        print(f"[{i+1}/{len(people)}] SKIP  {slug}")
        found.append(slug)
        continue

    wiki_title, img_url = wiki_search_title(name, ctx)

    if img_url:
        # Request a larger thumbnail (400px wide)
        img_url = re.sub(r'/\d+px-', '/400px-', img_url)
        ok = download_image(img_url, dest)
        if ok:
            size = os.path.getsize(dest)
            print(f"[{i+1}/{len(people)}] OK    {slug}  ({wiki_title}, {size//1024}kb)")
            found.append(slug)
        else:
            print(f"[{i+1}/{len(people)}] FAIL  {slug}  (download error)")
            not_found.append(slug)
    else:
        print(f"[{i+1}/{len(people)}] MISS  {slug}  (no Wikipedia image)")
        not_found.append(slug)

    time.sleep(0.15)  # polite rate limiting

# ── Summary ───────────────────────────────────────────────────────────────────
print(f"\n{'='*60}")
print(f"Done. {len(found)} images saved, {len(not_found)} missing.")
if not_found:
    print(f"\nMissing ({len(not_found)}):")
    for s in not_found:
        print(f"  {s}")
