#!/usr/bin/env python3
"""Convert one Apple DocC JSON page (HIG) to Markdown. Usage: docc2md.py page.json > page.md"""
import json
import sys


def inline(nodes, refs):
    out = []
    for n in nodes or []:
        t = n.get("type")
        if t == "text":
            out.append(n.get("text", ""))
        elif t == "codeVoice":
            out.append("`" + n.get("code", "") + "`")
        elif t == "emphasis":
            out.append("*" + inline(n.get("inlineContent"), refs) + "*")
        elif t == "strong":
            out.append("**" + inline(n.get("inlineContent"), refs) + "**")
        elif t == "reference":
            ref = refs.get(n.get("identifier", ""), {})
            title = ref.get("title") or inline(ref.get("titleInlineContent"), refs) or n.get("identifier", "")
            out.append(title)
        elif t == "image":
            pass
        elif "inlineContent" in n:
            out.append(inline(n["inlineContent"], refs))
    return "".join(out)


def cell_text(cell, refs):
    parts = []
    for b in cell:
        s = block(b, refs, 0).strip()
        if s:
            parts.append(s.replace("\n", " "))
    return " ".join(parts).replace("|", "\\|")


def table(rows, refs):
    lines = []
    for i, row in enumerate(rows):
        lines.append("| " + " | ".join(cell_text(c, refs) for c in row) + " |")
        if i == 0:
            lines.append("|" + " --- |" * len(row))
    return "\n".join(lines) + "\n"


def block(b, refs, depth):
    t = b.get("type")
    if t == "heading":
        return "#" * min(b.get("level", 2) + 0, 6) + " " + b.get("text", "") + "\n"
    if t == "paragraph":
        return inline(b.get("inlineContent"), refs) + "\n"
    if t in ("unorderedList", "orderedList"):
        lines = []
        for i, item in enumerate(b.get("items", [])):
            body = "\n".join(block(c, refs, depth + 1).strip() for c in item.get("content", []))
            marker = "- " if t == "unorderedList" else f"{i + 1}. "
            lines.append("  " * depth + marker + body.replace("\n", "\n" + "  " * (depth + 1)))
        return "\n".join(lines) + "\n"
    if t == "aside":
        name = b.get("name") or b.get("style", "Note").title()
        body = " ".join(block(c, refs, depth).strip() for c in b.get("content", []))
        return f"> **{name}:** {body}\n"
    if t == "table":
        return table(b.get("rows", []), refs)
    if t == "codeListing":
        return "```" + (b.get("syntax") or "") + "\n" + "\n".join(b.get("code", [])) + "\n```\n"
    if t == "tabNavigator":
        out = []
        for tab in b.get("tabs", []):
            inner = "\n".join(block(c, refs, depth) for c in tab.get("content", []))
            if inner.strip():
                out.append(f"**{tab.get('title', '')}**\n\n{inner}")
        return "\n".join(out)
    if t == "row":
        out = []
        for col in b.get("columns", []):
            out.append("\n".join(block(c, refs, depth) for c in col.get("content", [])))
        return "\n".join(out)
    if t == "termList":
        out = []
        for item in b.get("items", []):
            term = inline(item.get("term", {}).get("inlineContent"), refs)
            definition = " ".join(block(c, refs, depth).strip() for c in item.get("definition", {}).get("content", []))
            out.append(f"- **{term}**: {definition}")
        return "\n".join(out) + "\n"
    if t in ("links", "small", "video", "thematicBreak"):
        if t == "small":
            return inline(b.get("inlineContent"), refs) + "\n"
        return ""
    if "content" in b:
        return "\n".join(block(c, refs, depth) for c in b["content"])
    return ""


def convert(doc):
    refs = doc.get("references", {})
    out = ["# " + doc.get("metadata", {}).get("title", ""), ""]
    abstract = inline(doc.get("abstract"), refs)
    if abstract:
        out += [abstract, ""]
    platforms = doc.get("metadata", {}).get("platforms") or []
    if platforms:
        out += ["Availability: " + ", ".join(f"{p.get('name')} {p.get('introducedAt', '')}+" for p in platforms), ""]
    for sec in doc.get("primaryContentSections", []):
        if sec.get("kind") == "declarations":
            for decl in sec.get("declarations", []):
                code = "".join(t.get("text", "") for t in decl.get("tokens", []))
                out += ["```swift", code, "```", ""]
        for b in sec.get("content", []):
            s = block(b, refs, 0)
            if s.strip():
                out += [s.rstrip(), ""]
    for sec in doc.get("topicSections", []):
        out += ["### " + sec.get("title", ""), ""]
        for ident in sec.get("identifiers", []):
            ref = refs.get(ident, {})
            frag = "".join(t.get("text", "") for t in ref.get("fragments", [])) or ref.get("title", "")
            abstract = inline(ref.get("abstract"), refs)
            out.append(f"- `{frag}`" + (f": {abstract}" if abstract else ""))
        out.append("")
    text = "\n".join(out)
    while "\n\n\n" in text:
        text = text.replace("\n\n\n", "\n\n")
    return text


if __name__ == "__main__":
    print(convert(json.load(open(sys.argv[1]))))
