#!/usr/bin/env python3
"""Validate and package the public page without reading application source.

No third-party dependencies. Run from any working directory with Python 3.8+.
"""

import argparse
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
from urllib.parse import unquote, urlsplit
import zipfile


ROOT = Path(__file__).resolve().parents[1]
STATIC_FILES = (
    "index.html", "styles.css", "app.js", ".nojekyll",
    "assets/logo.svg", "assets/desktop-demo.jpg",
    "assets/image-workflow.jpg", "assets/video-workflow.jpg",
    "assets/geist-latin.woff2", "assets/Geist-LICENSE.txt",
)
REPOSITORY_FILES = STATIC_FILES + (
    ".github/workflows/pages.yml", ".gitignore", "README.md",
    "MEDIA.md", "tools/build.py",
)
DEMO_IDS = {
    "141-BHLHDrvMQKxPheblWc5odwJA2KXNz",  # English desktop demo
    "1UpFiPM-1mmmjUo2nDyHInA8MW1fe06cS",  # Image demo in the product guide
    "1lzaeUMJtiQKYdeawwIJ8739OYiFgN5tP",  # Video demo
}


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            assert attrs["id"] not in self.ids, "Duplicate HTML id: " + attrs["id"]
            self.ids.add(attrs["id"])
        for attr in ("href", "src"):
            if attr in attrs:
                self.links.append(attrs[attr])
        if attrs.get("target") == "_blank":
            assert "noopener" in attrs.get("rel", "").split(), "Missing noopener"


def checked_source(name):
    source = ROOT / name
    assert source.is_file() and not source.is_symlink(), "Missing/linked file: " + name
    assert ROOT in source.resolve().parents, "Source must stay inside the website directory"
    return source


def validate():
    for name in REPOSITORY_FILES:
        checked_source(name)
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    parser = PageParser()
    parser.feed(html)
    for link in parser.links:
        parts = urlsplit(link)
        if not parts.scheme:
            if parts.path:
                assert unquote(parts.path) in STATIC_FILES, "Unpackaged asset: " + link
            if parts.fragment:
                assert parts.fragment in parser.ids, "Missing anchor: " + link
        else:
            assert parts.scheme == "https", "Expected HTTPS: " + link
            if parts.netloc == "drive.google.com":
                match = re.fullmatch(r"/file/d/([^/]+)/(view|preview)", parts.path)
                assert match and match.group(1) in DEMO_IDS, "Only approved individual demos may be linked"
            else:
                assert link == "https://github.com/Zishan-Shao", "Unexpected external link: " + link
    for name in ("index.html", "styles.css", "app.js"):
        text = (ROOT / name).read_text(encoding="utf-8")
        assert "drive/folders" not in text, "Do not link a Drive folder containing source code"
        assert "github.com/Zishan-Shao/AeroPatch" not in text, "Do not link application source"
        for asset in re.findall(r"assets/[a-zA-Z0-9_.-]+", text):
            assert asset in STATIC_FILES, "Unpackaged asset: " + asset
    js = (ROOT / "app.js").read_text(encoding="utf-8")
    assert set(re.findall(r'id: "([a-zA-Z0-9_-]+)"', js)) == DEMO_IDS, "Check demo IDs"
    print("Validated page links, anchors, demo IDs, and publication allowlist.")


def build():
    output = ROOT / "_site"
    assert not output.is_symlink(), "Build output cannot be a symlink"
    if output.exists():
        shutil.rmtree(output)
    output.mkdir()
    for name in STATIC_FILES:
        dest = output / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(checked_source(name), dest)
    size = sum((output / name).stat().st_size for name in STATIC_FILES)
    print("Built {} public files ({:.2f} MB) in {}".format(len(STATIC_FILES), size / 1_000_000, output))


def export_repository(path):
    path = path.expanduser().resolve()
    assert path.suffix == ".zip", "Export path must end in .zip"
    assert path not in [ROOT / name for name in REPOSITORY_FILES], "Cannot overwrite page source"
    path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(str(path), "w", zipfile.ZIP_DEFLATED) as archive:
        for name in REPOSITORY_FILES:
            archive.write(checked_source(name), arcname=name)
    print("Exported {} website repository files to {}".format(len(REPOSITORY_FILES), path))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Validate without building")
    parser.add_argument("--export", type=Path, help="Create a new-repository ZIP using the publication allowlist")
    args = parser.parse_args()
    validate()
    if not args.check:
        build()
    if args.export:
        export_repository(args.export)


if __name__ == "__main__":
    main()
