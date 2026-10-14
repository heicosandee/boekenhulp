#!/usr/bin/env python3
"""Zoekt voor boeken zonder omslag een cover bij Open Library (openlibrary.org) en bewaart die in covers/.
Gebruik:   python3 tools/haal_covers.py      (daarna: python3 tools/maak_boeken.py)
Controleer het resultaat altijd even met je ogen: soms is het een andere uitgave of een verkeerd boek."""
import csv, json, os, re, time, urllib.parse, urllib.request

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def get(url, binary=False):
    for _ in range(3):
        try:
            d = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "boekenhulp-school/1.0"}), timeout=25).read()
            return d if binary else json.loads(d)
        except Exception:
            time.sleep(1.5)
norm = lambda s: re.sub(r"[^a-z0-9 ]", "", s.lower())
def close(a, b):
    a, b = norm(a), norm(b)
    return a == b or (a.startswith(b) and len(a) <= len(b) + 25)

for r in csv.DictReader(open(os.path.join(root, "boeken.csv"), encoding="utf-8-sig"), delimiter=";"):
    pad = os.path.join(root, "covers", r["id"] + ".jpg")
    if os.path.exists(pad):
        continue
    q = {"title": r["titel"], "limit": 15, "fields": "key,title,cover_i"}
    if r["auteur"]:
        q["author"] = r["auteur"].split()[-1]
    docs = (get("https://openlibrary.org/search.json?" + urllib.parse.urlencode(q)) or {}).get("docs", [])
    kies = next((d for d in docs if d.get("cover_i") and close(d["title"], r["titel"])), None)
    img = kies and get("https://covers.openlibrary.org/b/id/%d-L.jpg" % kies["cover_i"], True)
    if img and len(img) > 4000:
        open(pad, "wb").write(img); print("OK  ", r["id"])
    else:
        print("geen", r["id"])
    time.sleep(0.4)
