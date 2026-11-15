"""Injecte l'en-tête et le pied de page communs dans toutes les pages HTML.

Usage (depuis la racine du site) :  python tools/build_partials.py

Chaque page contient des marqueurs :
    <!-- @header --> ... <!-- /@header -->
    <!-- @footer --> ... <!-- /@footer -->
Le contenu entre les marqueurs est remplacé par partials/header.html et
partials/footer.html. Le lien de la page courante reçoit aria-current="page".
Modifiez les partials, relancez le script : toutes les pages sont à jour.
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTIALS = {name: (ROOT / "partials" / f"{name}.html").read_text(encoding="utf-8") for name in ("header", "footer")}


def render(name: str, page: str) -> str:
    html = PARTIALS[name]
    if name == "header":
        html = html.replace(f'<a href="{page}">', f'<a href="{page}" aria-current="page">', 1)
    return html


def main() -> None:
    for path in sorted(ROOT.glob("*.html")):
        src = path.read_text(encoding="utf-8")
        out = src
        for name in PARTIALS:
            pattern = re.compile(rf"(<!-- @{name} -->\n).*?(\s*<!-- /@{name} -->)", re.S)
            out = pattern.sub(lambda m: m.group(1) + render(name, path.name).rstrip("\n") + "\n" + m.group(2).lstrip(), out)
        if out != src:
            path.write_text(out, encoding="utf-8", newline="\n")
            print(f"mis à jour : {path.name}")


if __name__ == "__main__":
    main()
