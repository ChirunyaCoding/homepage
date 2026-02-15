#!/usr/bin/env python3
"""
SHOPデータ管理ツール（works-data.json）

Usage:
  python scripts/shop_tool.py
  python scripts/shop_tool.py gui
  python scripts/shop_tool.py list
  python scripts/shop_tool.py list --type games
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
import tkinter as tk
from pathlib import Path
from tkinter import filedialog, messagebox, ttk
from typing import Any
from urllib.parse import parse_qs, urlparse


def resolve_root_dir() -> Path:
    if getattr(sys, "frozen", False):
        exe_dir = Path(sys.executable).resolve().parent
        if (exe_dir / "public").exists():
            return exe_dir
        if (exe_dir.parent / "public").exists():
            return exe_dir.parent
        return Path.cwd()
    return Path(__file__).resolve().parents[1]


ROOT_DIR = resolve_root_dir()
PUBLIC_DIR = ROOT_DIR / "public"
DEFAULT_DATA_FILE = ROOT_DIR / "public" / "works-data.json"
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".svg", ".avif"}
YOUTUBE_EMBED_PREFIX = "https://www.youtube.com/embed/"

WORK_TYPE_INFO: dict[str, dict[str, str]] = {
    "games": {"label": "ゲーム", "kind": "game"},
    "tools": {"label": "ツール", "kind": "tool"},
    "modelAssets": {"label": "3Dアセット", "kind": "tool"},
    "blenderAddons": {"label": "Blenderアドオン", "kind": "tool"},
}

COLOR_CLASS_OPTIONS = [
    "from-cyan-400 to-blue-400",
    "from-emerald-400 to-teal-400",
    "from-blue-400 to-indigo-400",
    "from-pink-400 to-rose-400",
    "from-violet-400 to-purple-400",
    "from-amber-400 to-orange-400",
    "from-indigo-400 to-violet-400",
    "from-green-400 to-emerald-400",
    "from-rose-400 to-red-400",
    "from-teal-400 to-cyan-400",
]


def unique_strings(values: list[str]) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        text = value.strip()
        if not text or text in seen:
            continue
        seen.add(text)
        result.append(text)
    return result


def to_text(value: Any, fallback: str = "") -> str:
    return value.strip() if isinstance(value, str) else fallback


def to_number(value: Any, fallback: float = 0) -> float:
    if isinstance(value, (int, float)):
        return float(value)
    return fallback


def to_bool(value: Any, fallback: bool = False) -> bool:
    return bool(value) if isinstance(value, bool) else fallback


def to_string_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    return [to_text(item) for item in value if isinstance(item, str) and to_text(item)]


def split_lines(value: str) -> list[str]:
    values: list[str] = []
    for line in value.splitlines():
        for chunk in line.split(","):
            text = chunk.strip()
            if text:
                values.append(text)
    return unique_strings(values)


def normalize_image_reference(value: str) -> str:
    return value.strip().replace("\\", "/").lstrip("/")


def is_image_file(path: Path) -> bool:
    return path.suffix.lower() in IMAGE_EXTENSIONS


def list_public_images(public_dir: Path) -> list[str]:
    if not public_dir.exists():
        return []
    files = [p.relative_to(public_dir).as_posix() for p in public_dir.rglob("*") if p.is_file() and is_image_file(p)]
    return sorted(files)


def safe_public_target(public_dir: Path, source_name: str) -> Path:
    candidate = public_dir / source_name
    if not candidate.exists():
        return candidate

    stem = candidate.stem
    suffix = candidate.suffix
    counter = 1
    while True:
        next_candidate = public_dir / f"{stem}_{counter}{suffix}"
        if not next_candidate.exists():
            return next_candidate
        counter += 1


def normalize_youtube_url(value: str) -> str:
    raw = value.strip()
    if not raw:
        return ""

    if raw.startswith(YOUTUBE_EMBED_PREFIX):
        video_id = raw.replace(YOUTUBE_EMBED_PREFIX, "").split("?")[0].strip("/")
        return f"{YOUTUBE_EMBED_PREFIX}{video_id}" if video_id else ""

    try:
        parsed = urlparse(raw)
    except ValueError:
        return ""

    host = parsed.netloc.lower().replace("www.", "")
    path = parsed.path.strip("/")

    if host == "youtu.be":
        video_id = path.split("/")[0] if path else ""
        return f"{YOUTUBE_EMBED_PREFIX}{video_id}" if video_id else ""

    if host in {"youtube.com", "m.youtube.com"}:
        if parsed.path == "/watch":
            query = parse_qs(parsed.query)
            video_id = query.get("v", [""])[0]
            return f"{YOUTUBE_EMBED_PREFIX}{video_id}" if video_id else ""

        if parsed.path.startswith("/embed/"):
            video_id = path.replace("embed/", "").split("/")[0]
            return f"{YOUTUBE_EMBED_PREFIX}{video_id}" if video_id else ""

        if parsed.path.startswith("/shorts/"):
            video_id = path.replace("shorts/", "").split("/")[0]
            return f"{YOUTUBE_EMBED_PREFIX}{video_id}" if video_id else ""

    return ""


def blank_works_data() -> dict[str, list[dict[str, Any]]]:
    return {key: [] for key in WORK_TYPE_INFO}


def normalize_game_item(item: Any) -> dict[str, Any] | None:
    if not isinstance(item, dict):
        return None
    item_id = int(to_number(item.get("id"), 0))
    if item_id <= 0:
        return None

    trailer_urls = to_string_list(item.get("trailerUrls"))
    legacy_trailer = to_text(item.get("trailerUrl"))
    if not trailer_urls and legacy_trailer:
        trailer_urls = [legacy_trailer]
    trailer_urls = unique_strings([normalize_youtube_url(url) for url in trailer_urls if normalize_youtube_url(url)])

    return {
        "id": item_id,
        "title": to_text(item.get("title")),
        "description": to_text(item.get("description")),
        "category": to_text(item.get("category")),
        "rating": float(to_number(item.get("rating"), 0)),
        "price": int(to_number(item.get("price"), 0)),
        "image": to_text(item.get("image"), "🎮"),
        "tags": unique_strings(to_string_list(item.get("tags"))),
        "color": to_text(item.get("color"), "from-cyan-400 to-blue-400"),
        "boothUrl": to_text(item.get("boothUrl"), "https://booth.pm/"),
        "trailerUrls": trailer_urls,
        "screenshots": unique_strings(to_string_list(item.get("screenshots"))),
    }


def normalize_tool_item(item: Any) -> dict[str, Any] | None:
    if not isinstance(item, dict):
        return None
    item_id = int(to_number(item.get("id"), 0))
    if item_id <= 0:
        return None

    trailer_urls = to_string_list(item.get("trailerUrls"))
    legacy_trailer = to_text(item.get("trailerUrl"))
    if not trailer_urls and legacy_trailer:
        trailer_urls = [legacy_trailer]
    trailer_urls = unique_strings([normalize_youtube_url(url) for url in trailer_urls if normalize_youtube_url(url)])

    return {
        "id": item_id,
        "title": to_text(item.get("title")),
        "description": to_text(item.get("description")),
        "category": to_text(item.get("category")),
        "price": int(to_number(item.get("price"), 0)),
        "icon": to_text(item.get("icon"), "🛠️"),
        "features": unique_strings(to_string_list(item.get("features"))),
        "color": to_text(item.get("color"), "from-cyan-400 to-blue-400"),
        "boothUrl": to_text(item.get("boothUrl"), "https://booth.pm/"),
        "trailerUrls": trailer_urls,
        "screenshots": unique_strings(to_string_list(item.get("screenshots"))),
        "isNew": to_bool(item.get("isNew"), False),
    }


def normalize_works_data(data: Any) -> dict[str, list[dict[str, Any]]]:
    normalized = blank_works_data()
    if not isinstance(data, dict):
        return normalized

    for type_key, info in WORK_TYPE_INFO.items():
        rows = data.get(type_key)
        if not isinstance(rows, list):
            continue
        if info["kind"] == "game":
            items = [normalize_game_item(item) for item in rows]
        else:
            items = [normalize_tool_item(item) for item in rows]
        normalized[type_key] = [item for item in items if item is not None]
        normalized[type_key].sort(key=lambda x: int(x["id"]))

    return normalized


def load_works_data(data_file: Path) -> dict[str, list[dict[str, Any]]]:
    if not data_file.exists():
        return blank_works_data()

    with data_file.open("r", encoding="utf-8") as f:
        data = json.load(f)

    return normalize_works_data(data)


def save_works_data(data_file: Path, data: dict[str, list[dict[str, Any]]]) -> None:
    normalized = normalize_works_data(data)
    data_file.parent.mkdir(parents=True, exist_ok=True)
    with data_file.open("w", encoding="utf-8") as f:
        json.dump(normalized, f, ensure_ascii=False, indent=2)
        f.write("\n")


def next_id(items: list[dict[str, Any]]) -> int:
    if not items:
        return 1
    return max(int(item["id"]) for item in items) + 1


class ShopGui:
    def __init__(self, root: tk.Tk, data_file: Path):
        self.root = root
        self.data_file = data_file
        self.public_dir = PUBLIC_DIR
        self.works_data = load_works_data(data_file)
        self.public_images: list[str] = []
        self.form_trailer_urls: list[str] = []
        self.form_screenshots: list[str] = []

        self.root.title("SHOPデータ管理")
        self.root.geometry("1280x780")
        self.root.minsize(1080, 680)

        self.type_label_to_key = {info["label"]: key for key, info in WORK_TYPE_INFO.items()}
        self.type_labels = [info["label"] for info in WORK_TYPE_INFO.values()]

        self._build_ui()
        self.refresh_public_images()
        self.refresh_list()

    def _build_ui(self) -> None:
        wrapper = ttk.Frame(self.root, padding=12)
        wrapper.pack(fill=tk.BOTH, expand=True)

        top = ttk.Frame(wrapper)
        top.pack(fill=tk.X, pady=(0, 10))
        ttk.Label(top, text="データファイル:").pack(side=tk.LEFT)
        ttk.Label(top, text=str(self.data_file), foreground="#555").pack(side=tk.LEFT, padx=(6, 0))
        ttk.Button(top, text="再読み込み", command=self.reload_data).pack(side=tk.RIGHT)

        type_row = ttk.Frame(wrapper)
        type_row.pack(fill=tk.X, pady=(0, 10))
        ttk.Label(type_row, text="タイプ").pack(side=tk.LEFT)
        self.type_var = tk.StringVar(value=self.type_labels[0])
        self.type_combo = ttk.Combobox(type_row, state="readonly", textvariable=self.type_var, values=self.type_labels, width=16)
        self.type_combo.pack(side=tk.LEFT, padx=(8, 0))
        self.type_combo.bind("<<ComboboxSelected>>", self.on_type_change)

        main = ttk.Panedwindow(wrapper, orient=tk.HORIZONTAL)
        main.pack(fill=tk.BOTH, expand=True)

        left = ttk.Frame(main, padding=8)
        right = ttk.Frame(main, padding=8)
        main.add(left, weight=3)
        main.add(right, weight=2)

        self.tree = ttk.Treeview(left, columns=("id", "title", "price", "media"), show="headings", height=24)
        self.tree.heading("id", text="ID")
        self.tree.heading("title", text="タイトル")
        self.tree.heading("price", text="価格")
        self.tree.heading("media", text="メディア")
        self.tree.column("id", width=60, anchor=tk.CENTER)
        self.tree.column("title", width=300, anchor=tk.W)
        self.tree.column("price", width=90, anchor=tk.E)
        self.tree.column("media", width=120, anchor=tk.CENTER)

        tree_scroll = ttk.Scrollbar(left, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=tree_scroll.set)
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        tree_scroll.pack(side=tk.LEFT, fill=tk.Y)
        self.tree.bind("<<TreeviewSelect>>", self.on_select_row)

        form = right

        ttk.Label(form, text="タイトル").pack(anchor=tk.W)
        self.title_entry = ttk.Entry(form)
        self.title_entry.pack(fill=tk.X, pady=(0, 8))

        ttk.Label(form, text="カテゴリ表示名").pack(anchor=tk.W)
        self.category_entry = ttk.Entry(form)
        self.category_entry.pack(fill=tk.X, pady=(0, 8))

        common_row = ttk.Frame(form)
        common_row.pack(fill=tk.X, pady=(0, 8))
        ttk.Label(common_row, text="価格").pack(side=tk.LEFT)
        self.price_entry = ttk.Entry(common_row, width=10)
        self.price_entry.pack(side=tk.LEFT, padx=(6, 16))

        ttk.Label(common_row, text="色クラス").pack(side=tk.LEFT)
        self.color_var = tk.StringVar(value=COLOR_CLASS_OPTIONS[0])
        self.color_combo = ttk.Combobox(
            common_row,
            state="readonly",
            textvariable=self.color_var,
            values=COLOR_CLASS_OPTIONS,
        )
        self.color_combo.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(6, 0))

        ttk.Label(form, text="BOOTH URL").pack(anchor=tk.W)
        self.booth_url_entry = ttk.Entry(form)
        self.booth_url_entry.pack(fill=tk.X, pady=(0, 8))

        self.main_visual_label_var = tk.StringVar(value="画像/アイコン")
        ttk.Label(form, textvariable=self.main_visual_label_var).pack(anchor=tk.W)
        self.main_visual_entry = ttk.Entry(form)
        self.main_visual_entry.pack(fill=tk.X, pady=(0, 8))

        extra_row = ttk.Frame(form)
        extra_row.pack(fill=tk.X, pady=(0, 8))
        self.rating_label = ttk.Label(extra_row, text="評価")
        self.rating_label.pack(side=tk.LEFT)
        self.rating_entry = ttk.Entry(extra_row, width=10)
        self.rating_entry.pack(side=tk.LEFT, padx=(6, 16))

        self.is_new_var = tk.BooleanVar(value=False)
        self.is_new_check = ttk.Checkbutton(extra_row, text="NEW", variable=self.is_new_var)
        self.is_new_check.pack(side=tk.LEFT)

        self.extra_list_label_var = tk.StringVar(value="タグ/機能（改行区切り）")
        ttk.Label(form, textvariable=self.extra_list_label_var).pack(anchor=tk.W)
        self.extra_list_text = tk.Text(form, height=4, wrap=tk.WORD)
        self.extra_list_text.pack(fill=tk.X, pady=(0, 8))

        ttk.Label(form, text="説明").pack(anchor=tk.W)
        self.description_text = tk.Text(form, height=5, wrap=tk.WORD)
        self.description_text.pack(fill=tk.X, pady=(0, 8))

        trailer_entry_row = ttk.Frame(form)
        trailer_entry_row.pack(fill=tk.X)
        ttk.Label(trailer_entry_row, text="YouTube URL").pack(side=tk.LEFT)
        self.trailer_input_var = tk.StringVar(value="")
        self.trailer_input = ttk.Entry(trailer_entry_row, textvariable=self.trailer_input_var)
        self.trailer_input.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(8, 0))
        ttk.Button(trailer_entry_row, text="追加", command=self.add_trailer_url).pack(side=tk.LEFT, padx=(8, 0))

        trailer_list_row = ttk.Frame(form)
        trailer_list_row.pack(fill=tk.X, pady=(4, 8))
        self.trailer_listbox = tk.Listbox(trailer_list_row, height=3)
        self.trailer_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        trailer_actions = ttk.Frame(trailer_list_row)
        trailer_actions.pack(side=tk.LEFT, padx=(8, 0))
        ttk.Button(trailer_actions, text="削除", command=self.remove_trailer_url).pack(fill=tk.X)
        ttk.Button(trailer_actions, text="クリア", command=self.clear_trailer_urls).pack(fill=tk.X, pady=(6, 0))

        screenshot_entry_row = ttk.Frame(form)
        screenshot_entry_row.pack(fill=tk.X)
        ttk.Label(screenshot_entry_row, text="スクショ/画像").pack(side=tk.LEFT)
        self.screenshot_input_var = tk.StringVar(value="")
        self.screenshot_input = ttk.Combobox(screenshot_entry_row, textvariable=self.screenshot_input_var)
        self.screenshot_input.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(8, 0))
        ttk.Button(screenshot_entry_row, text="参照...", command=self.browse_screenshot).pack(side=tk.LEFT, padx=(8, 0))
        ttk.Button(screenshot_entry_row, text="追加", command=self.add_screenshot).pack(side=tk.LEFT, padx=(6, 0))

        screenshot_list_row = ttk.Frame(form)
        screenshot_list_row.pack(fill=tk.X, pady=(4, 8))
        self.screenshot_listbox = tk.Listbox(screenshot_list_row, height=3)
        self.screenshot_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        screenshot_actions = ttk.Frame(screenshot_list_row)
        screenshot_actions.pack(side=tk.LEFT, padx=(8, 0))
        ttk.Button(screenshot_actions, text="削除", command=self.remove_screenshot).pack(fill=tk.X)
        ttk.Button(screenshot_actions, text="クリア", command=self.clear_screenshots).pack(fill=tk.X, pady=(6, 0))

        button_row = ttk.Frame(form)
        button_row.pack(fill=tk.X, pady=(8, 4))
        ttk.Button(button_row, text="新規追加", command=self.add_item).pack(side=tk.LEFT)
        ttk.Button(button_row, text="選択行を更新", command=self.update_item).pack(side=tk.LEFT, padx=6)
        ttk.Button(button_row, text="選択行を削除", command=self.delete_item).pack(side=tk.LEFT, padx=6)
        ttk.Button(button_row, text="入力クリア", command=self.clear_form).pack(side=tk.LEFT, padx=6)

        self.status_var = tk.StringVar(value="")
        ttk.Label(form, textvariable=self.status_var, foreground="#555").pack(anchor=tk.W, pady=(2, 0))

        self.update_dynamic_labels()

    def reload_data(self) -> None:
        self.works_data = load_works_data(self.data_file)
        self.refresh_list()
        self.status_var.set("再読み込みしました。")

    def get_selected_type_key(self) -> str:
        label = self.type_var.get()
        return self.type_label_to_key.get(label, "games")

    def is_game_type(self) -> bool:
        type_key = self.get_selected_type_key()
        return WORK_TYPE_INFO[type_key]["kind"] == "game"

    def update_dynamic_labels(self) -> None:
        if self.is_game_type():
            self.main_visual_label_var.set("ゲーム画像/絵文字")
            self.extra_list_label_var.set("タグ（改行区切り）")
            self.rating_entry.configure(state="normal")
            self.rating_label.configure(foreground="")
            self.is_new_var.set(False)
            self.is_new_check.configure(state="disabled")
        else:
            self.main_visual_label_var.set("アイコン/絵文字")
            self.extra_list_label_var.set("機能（改行区切り）")
            self.rating_entry.configure(state="disabled")
            self.rating_label.configure(foreground="#888")
            self.is_new_check.configure(state="normal")

    def on_type_change(self, _event: Any = None) -> None:
        self.update_dynamic_labels()
        self.refresh_list()
        self.clear_form()

    def refresh_public_images(self) -> None:
        self.public_images = list_public_images(self.public_dir)
        self.screenshot_input["values"] = self.public_images

    def refresh_list(self) -> None:
        type_key = self.get_selected_type_key()
        items = self.works_data.get(type_key, [])

        self.tree.delete(*self.tree.get_children())
        for item in sorted(items, key=lambda x: int(x["id"])):
            media = f"V{len(item.get('trailerUrls', []))} / S{len(item.get('screenshots', []))}"
            self.tree.insert(
                "",
                tk.END,
                iid=str(item["id"]),
                values=(item["id"], item.get("title", ""), item.get("price", 0), media),
            )

        info = WORK_TYPE_INFO[type_key]["label"]
        self.status_var.set(f"{info}: {len(items)}件")

    def refresh_media_listboxes(self) -> None:
        self.trailer_listbox.delete(0, tk.END)
        for value in self.form_trailer_urls:
            self.trailer_listbox.insert(tk.END, value)

        self.screenshot_listbox.delete(0, tk.END)
        for value in self.form_screenshots:
            self.screenshot_listbox.insert(tk.END, value)

    def set_color_value(self, color: str) -> None:
        color_text = color.strip()
        if not color_text:
            self.color_var.set(COLOR_CLASS_OPTIONS[0])
            return

        values = list(self.color_combo.cget("values"))
        if color_text not in values:
            values.append(color_text)
            self.color_combo.configure(values=values)
        self.color_var.set(color_text)

    def on_select_row(self, _event: Any = None) -> None:
        selected = self.tree.selection()
        if not selected:
            return
        item_id = int(selected[0])
        type_key = self.get_selected_type_key()
        item = next((row for row in self.works_data.get(type_key, []) if int(row["id"]) == item_id), None)
        if item is None:
            return

        self.title_entry.delete(0, tk.END)
        self.title_entry.insert(0, item.get("title", ""))

        self.category_entry.delete(0, tk.END)
        self.category_entry.insert(0, item.get("category", ""))

        self.price_entry.delete(0, tk.END)
        self.price_entry.insert(0, str(item.get("price", 0)))

        self.set_color_value(item.get("color", ""))

        self.booth_url_entry.delete(0, tk.END)
        self.booth_url_entry.insert(0, item.get("boothUrl", ""))

        self.main_visual_entry.delete(0, tk.END)
        if self.is_game_type():
            self.main_visual_entry.insert(0, item.get("image", ""))
            self.rating_entry.configure(state="normal")
            self.rating_entry.delete(0, tk.END)
            self.rating_entry.insert(0, str(item.get("rating", 0)))
            self.rating_entry.configure(state="normal")
            self.is_new_var.set(False)
            extra_values = item.get("tags", [])
        else:
            self.main_visual_entry.insert(0, item.get("icon", ""))
            self.rating_entry.configure(state="normal")
            self.rating_entry.delete(0, tk.END)
            self.rating_entry.configure(state="disabled")
            self.is_new_var.set(bool(item.get("isNew", False)))
            extra_values = item.get("features", [])

        self.extra_list_text.delete("1.0", tk.END)
        self.extra_list_text.insert("1.0", "\n".join(extra_values if isinstance(extra_values, list) else []))

        self.description_text.delete("1.0", tk.END)
        self.description_text.insert("1.0", item.get("description", ""))

        self.form_trailer_urls = list(item.get("trailerUrls", []))
        self.form_screenshots = list(item.get("screenshots", []))
        self.refresh_media_listboxes()
        self.status_var.set(f"選択中: id={item_id}")

    def clear_form(self) -> None:
        self.title_entry.delete(0, tk.END)
        self.category_entry.delete(0, tk.END)
        self.price_entry.delete(0, tk.END)
        self.price_entry.insert(0, "0")
        self.set_color_value(COLOR_CLASS_OPTIONS[0])
        self.booth_url_entry.delete(0, tk.END)
        self.booth_url_entry.insert(0, "https://booth.pm/")
        self.main_visual_entry.delete(0, tk.END)
        self.rating_entry.configure(state="normal")
        self.rating_entry.delete(0, tk.END)
        if not self.is_game_type():
            self.rating_entry.configure(state="disabled")
        self.is_new_var.set(False)
        self.extra_list_text.delete("1.0", tk.END)
        self.description_text.delete("1.0", tk.END)
        self.trailer_input_var.set("")
        self.screenshot_input_var.set("")
        self.form_trailer_urls = []
        self.form_screenshots = []
        self.refresh_media_listboxes()
        self.tree.selection_remove(*self.tree.selection())

    def _parse_price(self) -> int | None:
        raw = self.price_entry.get().strip()
        if not raw:
            return 0
        try:
            return int(raw)
        except ValueError:
            messagebox.showwarning("入力エラー", "価格は整数で入力してください。")
            return None

    def _parse_rating(self) -> float | None:
        raw = self.rating_entry.get().strip()
        if not raw:
            return 0.0
        try:
            return float(raw)
        except ValueError:
            messagebox.showwarning("入力エラー", "評価は数値で入力してください。")
            return None

    def build_item_from_form(self, item_id: int) -> dict[str, Any] | None:
        title = self.title_entry.get().strip()
        description = self.description_text.get("1.0", tk.END).strip()
        category = self.category_entry.get().strip()
        color = self.color_var.get().strip() or COLOR_CLASS_OPTIONS[0]
        booth_url = self.booth_url_entry.get().strip() or "https://booth.pm/"
        main_visual = self.main_visual_entry.get().strip()
        extra_values = split_lines(self.extra_list_text.get("1.0", tk.END))

        if not title:
            messagebox.showwarning("入力不足", "タイトルを入力してください。")
            return None
        if not description:
            messagebox.showwarning("入力不足", "説明を入力してください。")
            return None
        if not category:
            messagebox.showwarning("入力不足", "カテゴリ表示名を入力してください。")
            return None

        price = self._parse_price()
        if price is None:
            return None

        trailer_urls = unique_strings(self.form_trailer_urls)
        screenshots = unique_strings(self.form_screenshots)

        if self.is_game_type():
            rating = self._parse_rating()
            if rating is None:
                return None
            return {
                "id": item_id,
                "title": title,
                "description": description,
                "category": category,
                "rating": rating,
                "price": price,
                "image": main_visual or "🎮",
                "tags": extra_values,
                "color": color,
                "boothUrl": booth_url,
                "trailerUrls": trailer_urls,
                "screenshots": screenshots,
            }

        return {
            "id": item_id,
            "title": title,
            "description": description,
            "category": category,
            "price": price,
            "icon": main_visual or "🛠️",
            "features": extra_values,
            "color": color,
            "boothUrl": booth_url,
            "trailerUrls": trailer_urls,
            "screenshots": screenshots,
            "isNew": bool(self.is_new_var.get()),
        }

    def add_item(self) -> None:
        type_key = self.get_selected_type_key()
        items = self.works_data[type_key]
        item = self.build_item_from_form(next_id(items))
        if item is None:
            return

        items.append(item)
        save_works_data(self.data_file, self.works_data)
        self.refresh_list()
        self.tree.selection_set(str(item["id"]))
        self.tree.focus(str(item["id"]))
        self.status_var.set(f"追加しました: id={item['id']}")

    def update_item(self) -> None:
        selected = self.tree.selection()
        if not selected:
            messagebox.showinfo("選択なし", "更新する項目を選択してください。")
            return
        selected_id = int(selected[0])
        type_key = self.get_selected_type_key()
        items = self.works_data[type_key]

        item = self.build_item_from_form(selected_id)
        if item is None:
            return

        found = False
        for idx, row in enumerate(items):
            if int(row["id"]) == selected_id:
                items[idx] = item
                found = True
                break
        if not found:
            messagebox.showerror("更新エラー", f"id={selected_id} が見つかりません。")
            return

        save_works_data(self.data_file, self.works_data)
        self.refresh_list()
        self.tree.selection_set(str(selected_id))
        self.tree.focus(str(selected_id))
        self.status_var.set(f"更新しました: id={selected_id}")

    def delete_item(self) -> None:
        selected = self.tree.selection()
        if not selected:
            messagebox.showinfo("選択なし", "削除する項目を選択してください。")
            return
        selected_id = int(selected[0])
        type_key = self.get_selected_type_key()
        items = self.works_data[type_key]
        target = next((row for row in items if int(row["id"]) == selected_id), None)
        if target is None:
            messagebox.showerror("削除エラー", f"id={selected_id} が見つかりません。")
            return

        confirmed = messagebox.askyesno("確認", f'id={selected_id}「{target.get("title", "")}」を削除しますか？')
        if not confirmed:
            return

        self.works_data[type_key] = [row for row in items if int(row["id"]) != selected_id]
        save_works_data(self.data_file, self.works_data)
        self.refresh_list()
        self.clear_form()
        self.status_var.set(f"削除しました: id={selected_id}")

    def add_trailer_url(self) -> None:
        raw = self.trailer_input_var.get().strip()
        if not raw:
            messagebox.showwarning("入力不足", "YouTube URL を入力してください。")
            return

        normalized = normalize_youtube_url(raw)
        if not normalized:
            messagebox.showwarning("入力エラー", "YouTube URL の形式が不正です。")
            return
        if normalized in self.form_trailer_urls:
            messagebox.showinfo("重複", "そのURLはすでに追加されています。")
            return

        self.form_trailer_urls.append(normalized)
        self.trailer_input_var.set("")
        self.refresh_media_listboxes()

    def remove_trailer_url(self) -> None:
        selected = self.trailer_listbox.curselection()
        if not selected:
            return
        del self.form_trailer_urls[selected[0]]
        self.refresh_media_listboxes()

    def clear_trailer_urls(self) -> None:
        self.form_trailer_urls = []
        self.refresh_media_listboxes()

    def _add_screenshot_value(self, value: str) -> None:
        text = value.strip()
        if not text:
            messagebox.showwarning("入力不足", "スクショ値を入力してください。")
            return
        normalized = normalize_image_reference(text) if any(ext in text.lower() for ext in IMAGE_EXTENSIONS) else text
        if normalized in self.form_screenshots:
            messagebox.showinfo("重複", "その値はすでに追加されています。")
            return
        self.form_screenshots.append(normalized)
        self.screenshot_input_var.set("")
        self.refresh_media_listboxes()

    def add_screenshot(self) -> None:
        self._add_screenshot_value(self.screenshot_input_var.get())

    def browse_screenshot(self) -> None:
        selected = filedialog.askopenfilename(
            title="スクリーンショット画像を選択",
            initialdir=str(self.public_dir),
            filetypes=[("画像ファイル", "*.png *.jpg *.jpeg *.webp *.gif *.bmp *.svg *.avif"), ("すべてのファイル", "*.*")],
        )
        if not selected:
            return

        selected_path = Path(selected).resolve()
        public_root = self.public_dir.resolve()
        try:
            image_ref = selected_path.relative_to(public_root).as_posix()
        except ValueError:
            target = safe_public_target(self.public_dir, selected_path.name)
            try:
                shutil.copy2(selected_path, target)
            except Exception as exc:  # noqa: BLE001
                messagebox.showerror("コピーエラー", f"画像のコピーに失敗しました:\n{exc}")
                return
            image_ref = target.relative_to(self.public_dir).as_posix()
            messagebox.showinfo("画像をコピーしました", f"public/{image_ref} にコピーしました。")

        self._add_screenshot_value(image_ref)
        self.refresh_public_images()

    def remove_screenshot(self) -> None:
        selected = self.screenshot_listbox.curselection()
        if not selected:
            return
        del self.form_screenshots[selected[0]]
        self.refresh_media_listboxes()

    def clear_screenshots(self) -> None:
        self.form_screenshots = []
        self.refresh_media_listboxes()


def run_gui(data_file: Path) -> int:
    root = tk.Tk()
    ShopGui(root, data_file)
    root.mainloop()
    return 0


def cmd_list(args: argparse.Namespace) -> int:
    works = load_works_data(args.data_file)
    if args.type:
        type_key = args.type
        if type_key not in WORK_TYPE_INFO:
            print(f"未対応タイプ: {type_key}")
            return 1
        print(f"[{type_key}] {WORK_TYPE_INFO[type_key]['label']}")
        for row in works[type_key]:
            print(f'  id={row["id"]} | {row["title"]} | JPY {row["price"]}')
        return 0

    for type_key, info in WORK_TYPE_INFO.items():
        print(f"{type_key:14} {info['label']:12} {len(works[type_key])}件")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="SHOPデータ（works-data.json）を管理します。")
    parser.add_argument(
        "--data-file",
        type=Path,
        default=DEFAULT_DATA_FILE,
        help=f"データファイルのパス（デフォルト: {DEFAULT_DATA_FILE}）",
    )
    parser.add_argument(
        "command",
        nargs="?",
        choices=("gui", "list"),
        default="gui",
        help="実行コマンド（省略時: gui）",
    )
    parser.add_argument("--type", choices=tuple(WORK_TYPE_INFO.keys()), help="list時に対象タイプを指定")
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    if args.command == "gui":
        return run_gui(args.data_file)
    if args.command == "list":
        return cmd_list(args)
    parser.error("不明なコマンドです。")
    return 1


if __name__ == "__main__":
    sys.exit(main())
