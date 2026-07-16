#!/usr/bin/env python3
"""Final data update per CATATAN UPDATE 2026 doc (gdoc 16BHgxfZ...).

Reverses the earlier partial update: the 4 finished pondok stay VISIBLE in the
table (status 'selesai' -> red) and ON the map (faded green dots). Reconciles
penerima order/galon/status/coords + stats(home & penerima) to the brief.

Idempotent: matched by name, re-running yields the same end state.
Reads creds from .dev.vars. Source: gdoc + spreadsheet DATA DISTRIBUSI AIR 2026.
"""
import json, os, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env = {}
with open(os.path.join(ROOT, ".dev.vars")) as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k] = v.strip().strip('"')

URL = env["SUPABASE_URL"].rstrip("/")
KEY = env["SUPABASE_SERVICE_ROLE_KEY"]
HDR = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}


def req(method, path, body=None, prefer="return=representation"):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(URL + path, data=data, method=method,
                               headers={**HDR, "Prefer": prefer})
    with urllib.request.urlopen(r) as resp:
        raw = resp.read().decode()
        return json.loads(raw) if raw else None


def patch_by_name(name, body):
    q = urllib.parse.quote(name)
    return req("PATCH", f"/rest/v1/penerima?name=eq.{q}", body)


# --- 1. The 4 finished pondok: visible + selesai + on map (faded) --- #
# order 18-21 per brief; coords restored/kept so dots show on the map.
selesai = [
    ("PP KI Ageng Wonokusumo", 18, 6, -7.925, 110.670),
    ("PP Baitul Jannah Darussalam", 19, 6, -7.958, 110.612),
    ("PP Assalafiyah Darussalam", 20, 5, -7.950, 110.590),
    ("PP Al-Hikmah Gubuk Rubuh", 21, 8, -7.958, 110.548),
]
for name, so, gal, lat, lng in selesai:
    patch_by_name(name, {
        "sort_order": so, "galon": gal, "status": "selesai",
        "lat": lat, "lng": lng, "is_published": True,
    })
    print(f"selesai + on-map: {name} sort={so} galon={gal}")

# --- 2. Stats: home + penerima -> brief section 2 values --- #
# Kabupaten 1, Lembaga Penerima 21, Galon/Distribusi 1446, Kecamatan 9.
stat_values = {
    "Kabupaten": 1, "Kabupaten Aktif": 1,
    "Lembaga Penerima": 21,
    "Galon/Distribusi": 1446,
    "Kecamatan": 9, "Kecamatan Terjangkau": 9,
}
for label, num in stat_values.items():
    q = urllib.parse.quote(label)
    req("PATCH", f"/rest/v1/stats?label=eq.{q}", {"num": num})
    print(f"stat: {label} -> {num}")

print("DONE")
