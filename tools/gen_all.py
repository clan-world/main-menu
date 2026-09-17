#!/usr/bin/env python3
"""Generate every asset in tools/art-manifest.json via Codex image_gen (tools/gen_one.sh).
Skips assets that already exist in art/raw. Runs N jobs in parallel.
Usage: python3 tools/gen_all.py [--jobs 4] [--only name1,name2]
"""
import json, subprocess, sys, os, argparse
from concurrent.futures import ThreadPoolExecutor

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument("--jobs", type=int, default=4)
ap.add_argument("--only", default="")
ap.add_argument("--force", action="store_true")
a = ap.parse_args()
items = json.load(open(os.path.join(root, "tools/art-manifest.json")))
only = set(filter(None, a.only.split(",")))
todo = [i for i in items if (not only or i["name"] in only) and (a.force or not os.path.exists(f"{root}/art/raw/{i['name']}.png"))]

def run(i):
    r = subprocess.run([f"{root}/tools/gen_one.sh", i["name"], i["size"], i["prompt"]], capture_output=True, text=True)
    return i["name"], r.returncode, (r.stdout + r.stderr).strip().splitlines()[-1:] 

with ThreadPoolExecutor(a.jobs) as ex:
    for name, code, tail in ex.map(run, todo):
        print(("OK  " if code == 0 else "FAIL"), name, tail, flush=True)
