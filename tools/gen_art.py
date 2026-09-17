#!/usr/bin/env python3
"""Generate raw Clan World art with the Codex CLI's built-in image_gen tool.

Claude Code has no native image generator, so this branch drives the
authenticated Codex CLI on the same box non-interactively (`codex exec`).
Prompts live in tools/art_prompts.json; raw outputs land in $OUT (default
/tmp/cw-art/raw). tools/build_assets.py then crops/slices/optimises them
into public/art.

Usage: python3 tools/gen_art.py [name ...]      # default: all
"""
import json, os, subprocess, sys, concurrent.futures as cf

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.environ.get('OUT', '/tmp/cw-art/raw')
PROMPTS = json.load(open(os.path.join(HERE, 'art_prompts.json')))
SIZE = {'square': '1024x1024', 'landscape': '1536x1024', 'portrait': '1024x1536'}

def gen(name):
    spec = PROMPTS[name]
    dest = os.path.join(OUT, f'{name}.png')
    work = os.path.join(OUT, 'work', name)
    os.makedirs(work, exist_ok=True)
    alpha = 'Request a fully transparent background (PNG with alpha) and preserve the alpha channel. ' if spec['transparent'] else ''
    task = (
        f'Use the built-in image_gen tool exactly once to generate ONE image at size {SIZE[spec["size"]]}. {alpha}'
        f'Then copy the resulting PNG from ~/.codex/generated_images to {dest} (overwrite if it exists). '
        f'Do not write any other files and do not edit the image. Finish by printing the destination path.\n\n'
        f'image_gen prompt (use verbatim):\n{spec["prompt"]}'
    )
    cmd = ['codex', 'exec', '--skip-git-repo-check', '-s', 'workspace-write', '-C', work, task]
    log = open(os.path.join(work, 'codex.log'), 'w')
    r = subprocess.run(cmd, stdout=log, stderr=subprocess.STDOUT, timeout=900)
    ok = r.returncode == 0 and os.path.exists(dest)
    print(('ok   ' if ok else 'FAIL ') + name, flush=True)
    return ok

if __name__ == '__main__':
    names = sys.argv[1:] or list(PROMPTS)
    os.makedirs(OUT, exist_ok=True)
    with cf.ThreadPoolExecutor(max_workers=4) as ex:
        res = list(ex.map(gen, names))
    sys.exit(0 if all(res) else 1)
