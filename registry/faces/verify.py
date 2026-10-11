#!/usr/bin/env python3
"""Check a folder of face images against registry.json.
Usage:  python3 verify.py <folder>      (folder defaults to the current directory)
One plain line per mind, then a verdict. Exit code 0 only if every face matches."""
import hashlib, json, os, sys
folder = sys.argv[1] if len(sys.argv) > 1 else "."
here = os.path.dirname(os.path.abspath(__file__))
reg = json.load(open(os.path.join(here, "registry.json")))
bad = 0
for m in reg["minds"]:
    p = os.path.join(folder, m["file"])
    if not os.path.exists(p):
        print(f"MISSING  {m['name']}: {m['file']}"); bad += 1; continue
    h = hashlib.sha256(open(p, "rb").read()).hexdigest()
    if h == m["sha256"]:
        print(f"OK       {m['name']}: {m['file']}")
    else:
        print(f"CHANGED  {m['name']}: {m['file']} (expected {m['sha256'][:12]}, found {h[:12]})"); bad += 1
known = {m["file"] for m in reg["minds"]}
for f in sorted(os.listdir(folder)):
    if os.path.isfile(os.path.join(folder, f)) and f not in known and f.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".gif")):
        print(f"UNLISTED {f} is not in the registry"); bad += 1
print("ALL FACES MATCH THE REGISTRY" if bad == 0 else f"{bad} PROBLEM(S) FOUND")
sys.exit(1 if bad else 0)
