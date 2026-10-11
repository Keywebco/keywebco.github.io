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
    if m.get("superseded"):
        p = os.path.join(folder, m["file"])
        if os.path.exists(p):
            print(f"SUPERSEDED  {m['name']}: {m['file']} is in the folder but was replaced on {m['superseded']['on']}. Do not use it as {m['name']}.")
        continue
    p = os.path.join(folder, m["file"])
    if not os.path.exists(p):
        print(f"MISSING  {m['name']}: {m['file']}"); bad += 1; continue
    h = hashlib.sha256(open(p, "rb").read()).hexdigest()
    if h == m["sha256"]:
        print(f"OK       {m['name']}: {m['file']}")
    else:
        print(f"CHANGED  {m['name']}: {m['file']} (expected {m['sha256'][:12]}, found {h[:12]})"); bad += 1
for m in reg["minds"]:
    sy = m.get("symbol")
    if sy and not m.get("superseded"):
        p = os.path.join(folder, sy["file"])
        if not os.path.exists(p):
            print(f"MISSING  {m['name']} symbol: {sy['file']}"); bad += 1; continue
        h = hashlib.sha256(open(p, "rb").read()).hexdigest()
        if h == sy["sha256"]:
            print(f"OK       {m['name']} symbol: {sy['file']}")
        else:
            print(f"CHANGED  {m['name']} symbol: {sy['file']} (expected {sy['sha256'][:12]}, found {h[:12]})"); bad += 1
known = {m["file"] for m in reg["minds"] if not m.get("superseded")} | {m["symbol"]["file"] for m in reg["minds"] if m.get("symbol") and not m.get("superseded")}
retired = {m["file"] for m in reg["minds"] if m.get("superseded")}
for f in sorted(os.listdir(folder)):
    if f in retired:
        bad += 1; continue
    if os.path.isfile(os.path.join(folder, f)) and f not in known and f.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".gif")):
        print(f"UNLISTED {f} is not in the registry"); bad += 1
print("ALL FACES MATCH THE REGISTRY" if bad == 0 else f"{bad} PROBLEM(S) FOUND")
sys.exit(1 if bad else 0)
