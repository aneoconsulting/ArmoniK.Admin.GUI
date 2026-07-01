# ArmoniK.Admin.GUI Docs

User documentation for the ArmoniK Admin GUI, built with
[Sphinx](https://www.sphinx-doc.org) and
[MyST](https://myst-parser.readthedocs.io) (Markdown) and published on
[Read the Docs](https://readthedocs.org).

## Setup

> Run these commands from the repository root.

Create and activate a virtual environment:

```bash
python -m venv .venv-doc
source .venv-doc/bin/activate
```

Install the dependencies:

```bash
pip install -r .docs/requirements.txt
```

## Usage

Build the docs locally:

```bash
sphinx-build -M html .docs .docs/build
```

The output can be found in `.docs/build/html/index.html`.

## Structure

- `conf.py` — Sphinx configuration.
- `index.rst` — landing page and table of contents (`toctree`).
- `content/` — the documentation pages, written in Markdown.
- `_static/` — custom CSS and static assets.
