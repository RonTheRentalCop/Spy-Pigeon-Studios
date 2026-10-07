"""Update assets/showcase.json from the photos in assets/.

    python3 make_showcase.py

New photos are added to the top of the list with empty words. Fill in "by" (the name they'd like
shown), "caption" and "alt" (a description for screen readers) in assets/showcase.json, then commit.
Photos you delete from assets/ are removed from the list. Everything you've written is kept.
"""
import json
from pathlib import Path


ASSETS = Path(__file__).resolve().parent / "assets"
LIST = ASSETS / "showcase.json"
PICTURES = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}


def main():
    ASSETS.mkdir(exist_ok=True)
    try:
        photos = json.loads(LIST.read_text(encoding="utf-8")).get("photos", [])
    except (OSError, ValueError):
        photos = []
    on_disk = sorted((p for p in ASSETS.iterdir() if p.suffix.lower() in PICTURES), key=lambda p: p.stat().st_mtime, reverse=True)
    names = {f"assets/{p.name}" for p in on_disk}
    kept = [photo for photo in photos if photo.get("file") in names]
    listed = {photo["file"] for photo in kept}
    added = [{"file": f"assets/{p.name}", "by": "", "caption": "", "alt": ""} for p in on_disk if f"assets/{p.name}" not in listed]
    LIST.write_text(json.dumps({"photos": added + kept}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(added)} added, {len(photos) - len(kept)} removed, {len(added) + len(kept)} on the wall.")
    if added:
        print("Fill in by, caption and alt for the new ones in assets/showcase.json.")


if __name__ == "__main__":
    main()
