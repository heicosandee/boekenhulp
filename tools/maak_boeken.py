#!/usr/bin/env python3
"""Zet boeken.csv om naar books.js (de database die de website gebruikt).

Gebruik:   python3 tools/maak_boeken.py
Omslagen:  leg een plaatje neer als covers/<id>.jpg (of .png); die wordt automatisch gebruikt.
"""
import csv, json, os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
boeken = []
with open(os.path.join(root, "boeken.csv"), encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f, delimiter=";"):
        if not r["id"].strip():
            continue
        omslag = next((f"covers/{r['id']}{e}" for e in (".jpg", ".png", ".webp") if os.path.exists(os.path.join(root, "covers", r["id"] + e))), None)
        boeken.append(dict(
            id=r["id"].strip(), titel=r["titel"].strip(), auteur=r["auteur"].strip(),
            niveau=int(r["niveau"]), dikte=int(r["dikte"]), plaatjes=int(r["plaatjes"]), serie=r["serie"].strip() in ("1", "ja", "x"),
            genres=r["genres"].split(), themas=r["themas"].split(), omschrijving=r["omschrijving"].strip(), omslag=omslag))
with open(os.path.join(root, "books.js"), "w", encoding="utf-8") as f:
    f.write("// Gegenereerd door tools/maak_boeken.py uit boeken.csv. Niet met de hand aanpassen.\nwindow.BOEKEN = " + json.dumps(boeken, ensure_ascii=False, indent=1) + ";\n")
print(len(boeken), "boeken,", sum(1 for b in boeken if b["omslag"]), "met omslag")
