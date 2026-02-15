#!/usr/bin/env python3
"""
成長記録データ管理ツール

Usage:
  python scripts/records_tool.py
  python scripts/records_tool.py gui
  python scripts/records_tool.py list
  python scripts/records_tool.py add --title "タイトル" --description "説明" --image avatar.png --image icon.png
  python scripts/records_tool.py add --title "タイトル" --description "説明" --youtube "https://youtu.be/xxxx"
  python scripts/records_tool.py delete --id 3
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
DEFAULT_DATA_FILE = ROOT_DIR / "public" / "records-data.json"
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".svg", ".avif"}
YOUTUBE_EMBED_PREFIX = "https://www.youtube.com/embed/"


def unique_strings(values: list[str]) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        item = value.strip()
        if not item or item in seen:
            continue
        seen.add(item)
        result.append(item)
    return result


def normalize_image_reference(image_value: Any) -> str:
    if not isinstance(image_value, str):
        return ""
    return image_value.strip().replace("\\", "/").lstrip("/")


def normalize_youtube_url(value: Any) -> str:
    if not isinstance(value, str):
        return ""

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


def normalize_str_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    return [str(item).strip() for item in value if isinstance(item, str) and item.strip()]


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


def image_exists_in_public(public_dir: Path, image_ref: str) -> bool:
    if not image_ref:
        return False
    target = (public_dir / image_ref).resolve()
    try:
        target.relative_to(public_dir.resolve())
    except ValueError:
        return False
    return target.exists() and target.is_file()


def normalize_record(item: Any) -> dict[str, Any] | None:
    if not isinstance(item, dict):
        return None
    if not isinstance(item.get("id"), int):
        return None
    if not isinstance(item.get("title"), str):
        return None
    if not isinstance(item.get("description"), str):
        return None

    legacy_image = normalize_image_reference(item.get("image"))
    legacy_youtube = normalize_youtube_url(item.get("youtubeUrl"))

    images = unique_strings(
        [normalize_image_reference(value) for value in normalize_str_list(item.get("images"))]
        + ([legacy_image] if legacy_image else [])
    )
    youtube_urls = unique_strings(
        [normalize_youtube_url(value) for value in normalize_str_list(item.get("youtubeUrls"))]
        + ([legacy_youtube] if legacy_youtube else [])
    )
    youtube_urls = [url for url in youtube_urls if url]

    if not images and not youtube_urls:
        return None

    return {
        "id": int(item["id"]),
        "title": item["title"].strip(),
        "description": item["description"].strip(),
        "images": images,
        "youtubeUrls": youtube_urls,
    }


def load_records(data_file: Path) -> list[dict[str, Any]]:
    if not data_file.exists():
        return []

    with data_file.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError(f"{data_file} の形式が不正です（配列ではありません）")

    records: list[dict[str, Any]] = []
    for item in data:
        normalized = normalize_record(item)
        if normalized is None:
            continue
        records.append(normalized)

    return records


def save_records(data_file: Path, records: list[dict[str, Any]]) -> None:
    normalized: list[dict[str, Any]] = []
    for item in records:
        record = normalize_record(item)
        if record is not None:
            normalized.append(record)

    normalized.sort(key=lambda x: x["id"])

    data_file.parent.mkdir(parents=True, exist_ok=True)
    with data_file.open("w", encoding="utf-8") as f:
        json.dump(normalized, f, ensure_ascii=False, indent=2)
        f.write("\n")


def next_id(records: list[dict[str, Any]]) -> int:
    if not records:
        return 1
    return max(int(record["id"]) for record in records) + 1


def media_summary(record: dict[str, Any]) -> str:
    images = record.get("images") if isinstance(record.get("images"), list) else []
    youtube_urls = record.get("youtubeUrls") if isinstance(record.get("youtubeUrls"), list) else []
    return f"画像 {len(images)} / 動画 {len(youtube_urls)}"


def print_records(records: list[dict[str, Any]]) -> None:
    if not records:
        print("記録データは空です。")
        return

    print(f"データ件数: {len(records)}")
    print("-" * 100)
    for record in sorted(records, key=lambda r: int(r["id"])):
        description = str(record["description"])
        short_description = description if len(description) <= 40 else f"{description[:40]}..."
        print(
            f'id={record["id"]:>3} | title={record["title"]} | '
            f'{media_summary(record)} | desc={short_description}'
        )


def cmd_list(args: argparse.Namespace) -> int:
    records = load_records(args.data_file)
    print_records(records)
    return 0


def cmd_add(args: argparse.Namespace) -> int:
    records = load_records(args.data_file)

    image_refs = unique_strings([normalize_image_reference(value) for value in (args.image or [])])
    youtube_urls = unique_strings([normalize_youtube_url(value) for value in (args.youtube or [])])

    if not args.title or not args.title.strip():
        print("エラー: --title は必須です。")
        return 1
    if not args.description or not args.description.strip():
        print("エラー: --description は必須です。")
        return 1
    if not image_refs and not youtube_urls:
        print("エラー: --image か --youtube のどちらかを1件以上指定してください。")
        return 1

    for image_ref in image_refs:
        if not image_exists_in_public(PUBLIC_DIR, image_ref):
            print(f"エラー: 画像 '{image_ref}' が public 配下に見つかりません。")
            return 1

    if any(not item for item in youtube_urls):
        print("エラー: --youtube の形式が不正です。YouTube URLを指定してください。")
        return 1

    record = {
        "id": next_id(records),
        "title": args.title.strip(),
        "description": args.description.strip(),
        "images": image_refs,
        "youtubeUrls": youtube_urls,
    }

    records.append(record)
    save_records(args.data_file, records)
    print(f'追加しました: id={record["id"]}, title="{record["title"]}", {media_summary(record)}')
    return 0


def cmd_delete(args: argparse.Namespace) -> int:
    records = load_records(args.data_file)
    target_id = args.id

    new_records = [record for record in records if int(record["id"]) != target_id]
    if len(new_records) == len(records):
        print(f"id={target_id} は見つかりませんでした。")
        return 1

    save_records(args.data_file, new_records)
    print(f"id={target_id} を削除しました。")
    return 0


class RecordsGui:
    def __init__(self, root: tk.Tk, data_file: Path):
        self.root = root
        self.data_file = data_file
        self.public_dir = PUBLIC_DIR
        self.records: list[dict[str, Any]] = []

        self.form_images: list[str] = []
        self.form_youtube_urls: list[str] = []

        self.root.title("成長記録データ管理")
        self.root.geometry("1120x720")
        self.root.minsize(960, 620)

        self._build_ui()
        self.refresh_records()

    def _build_ui(self) -> None:
        wrapper = ttk.Frame(self.root, padding=12)
        wrapper.pack(fill=tk.BOTH, expand=True)

        top_bar = ttk.Frame(wrapper)
        top_bar.pack(fill=tk.X, pady=(0, 10))

        ttk.Label(top_bar, text="データファイル:").pack(side=tk.LEFT)
        ttk.Label(top_bar, text=str(self.data_file), foreground="#555").pack(side=tk.LEFT, padx=(6, 0))
        ttk.Button(top_bar, text="再読み込み", command=self.refresh_records).pack(side=tk.RIGHT)

        main_area = ttk.Panedwindow(wrapper, orient=tk.HORIZONTAL)
        main_area.pack(fill=tk.BOTH, expand=True)

        list_frame = ttk.Frame(main_area, padding=8)
        form_frame = ttk.Frame(main_area, padding=8)
        main_area.add(list_frame, weight=3)
        main_area.add(form_frame, weight=2)

        self.tree = ttk.Treeview(
            list_frame,
            columns=("id", "title", "images", "youtube"),
            show="headings",
            height=22,
        )
        self.tree.heading("id", text="ID")
        self.tree.heading("title", text="タイトル")
        self.tree.heading("images", text="画像")
        self.tree.heading("youtube", text="YouTube")
        self.tree.column("id", width=70, anchor=tk.CENTER)
        self.tree.column("title", width=290, anchor=tk.W)
        self.tree.column("images", width=80, anchor=tk.CENTER)
        self.tree.column("youtube", width=80, anchor=tk.CENTER)

        tree_scroll = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=tree_scroll.set)

        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        tree_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        self.tree.bind("<<TreeviewSelect>>", self.on_select_record)

        ttk.Label(form_frame, text="タイトル").pack(anchor=tk.W)
        self.title_entry = ttk.Entry(form_frame)
        self.title_entry.pack(fill=tk.X, pady=(0, 10))

        ttk.Label(form_frame, text="画像ファイル（public配下）").pack(anchor=tk.W)
        image_entry_row = ttk.Frame(form_frame)
        image_entry_row.pack(fill=tk.X, pady=(0, 6))

        self.image_var = tk.StringVar(value="")
        self.image_combo = ttk.Combobox(image_entry_row, textvariable=self.image_var)
        self.image_combo.pack(side=tk.LEFT, fill=tk.X, expand=True)

        ttk.Button(image_entry_row, text="参照...", command=self.browse_image).pack(side=tk.LEFT, padx=(8, 0))
        ttk.Button(image_entry_row, text="更新", command=self.refresh_image_candidates).pack(side=tk.LEFT, padx=(6, 0))
        ttk.Button(image_entry_row, text="追加", command=self.add_image_from_input).pack(side=tk.LEFT, padx=(6, 0))

        image_list_row = ttk.Frame(form_frame)
        image_list_row.pack(fill=tk.X, pady=(0, 10))

        self.image_listbox = tk.Listbox(image_list_row, height=4)
        self.image_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        image_list_actions = ttk.Frame(image_list_row)
        image_list_actions.pack(side=tk.LEFT, padx=(8, 0), fill=tk.Y)
        ttk.Button(image_list_actions, text="削除", command=self.remove_selected_image).pack(fill=tk.X)
        ttk.Button(image_list_actions, text="クリア", command=self.clear_images).pack(fill=tk.X, pady=(6, 0))

        ttk.Label(form_frame, text="YouTube URL").pack(anchor=tk.W)
        youtube_entry_row = ttk.Frame(form_frame)
        youtube_entry_row.pack(fill=tk.X, pady=(0, 6))

        self.youtube_var = tk.StringVar(value="")
        self.youtube_entry = ttk.Entry(youtube_entry_row, textvariable=self.youtube_var)
        self.youtube_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
        ttk.Button(youtube_entry_row, text="追加", command=self.add_youtube_from_input).pack(side=tk.LEFT, padx=(8, 0))

        youtube_list_row = ttk.Frame(form_frame)
        youtube_list_row.pack(fill=tk.X, pady=(0, 10))

        self.youtube_listbox = tk.Listbox(youtube_list_row, height=4)
        self.youtube_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        youtube_list_actions = ttk.Frame(youtube_list_row)
        youtube_list_actions.pack(side=tk.LEFT, padx=(8, 0), fill=tk.Y)
        ttk.Button(youtube_list_actions, text="削除", command=self.remove_selected_youtube).pack(fill=tk.X)
        ttk.Button(youtube_list_actions, text="クリア", command=self.clear_youtube).pack(fill=tk.X, pady=(6, 0))

        ttk.Label(form_frame, text="説明").pack(anchor=tk.W)
        self.description_text = tk.Text(form_frame, height=9, wrap=tk.WORD)
        self.description_text.pack(fill=tk.BOTH, expand=True, pady=(0, 10))

        button_row = ttk.Frame(form_frame)
        button_row.pack(fill=tk.X, pady=(0, 8))
        ttk.Button(button_row, text="新規追加", command=self.add_record_from_form).pack(side=tk.LEFT)
        ttk.Button(button_row, text="選択行を更新", command=self.update_selected_record).pack(side=tk.LEFT, padx=6)
        ttk.Button(button_row, text="選択行を削除", command=self.delete_selected_record).pack(side=tk.LEFT, padx=6)
        ttk.Button(button_row, text="入力クリア", command=self.clear_form).pack(side=tk.LEFT)

        self.status_var = tk.StringVar(value="")
        ttk.Label(form_frame, textvariable=self.status_var, foreground="#555").pack(anchor=tk.W)

        self.refresh_image_candidates()

    def refresh_records(self) -> None:
        try:
            self.records = load_records(self.data_file)
            self.records.sort(key=lambda x: int(x["id"]))
        except Exception as exc:  # noqa: BLE001
            messagebox.showerror("読み込みエラー", str(exc))
            return

        self.tree.delete(*self.tree.get_children())
        for record in self.records:
            self.tree.insert(
                "",
                tk.END,
                iid=str(record["id"]),
                values=(record["id"], record["title"], len(record.get("images", [])), len(record.get("youtubeUrls", []))),
            )

        self.status_var.set(f"件数: {len(self.records)}")

    def refresh_image_candidates(self) -> None:
        images = list_public_images(self.public_dir)
        self.image_combo["values"] = images
        if not self.image_var.get().strip() and images:
            self.image_var.set(images[0])

    def refresh_form_media_listboxes(self) -> None:
        self.image_listbox.delete(0, tk.END)
        for image in self.form_images:
            self.image_listbox.insert(tk.END, image)

        self.youtube_listbox.delete(0, tk.END)
        for url in self.form_youtube_urls:
            self.youtube_listbox.insert(tk.END, url)

        self.status_var.set(f"編集中メディア: 画像 {len(self.form_images)} / 動画 {len(self.form_youtube_urls)}")

    def add_image_reference(self, image_ref: str) -> bool:
        normalized = normalize_image_reference(image_ref)
        if not normalized:
            messagebox.showwarning("入力不足", "画像ファイル名を入力してください。")
            return False

        if not image_exists_in_public(self.public_dir, normalized):
            messagebox.showwarning(
                "画像が見つかりません",
                "指定した画像が public 配下に見つかりません。",
            )
            return False

        if normalized in self.form_images:
            messagebox.showinfo("重複", "その画像はすでに追加されています。")
            return False

        self.form_images.append(normalized)
        self.refresh_form_media_listboxes()
        return True

    def add_image_from_input(self) -> None:
        if self.add_image_reference(self.image_var.get()):
            self.image_var.set("")

    def browse_image(self) -> None:
        selected = filedialog.askopenfilename(
            title="画像ファイルを選択",
            initialdir=str(self.public_dir),
            filetypes=[
                ("画像ファイル", "*.png *.jpg *.jpeg *.webp *.gif *.bmp *.svg *.avif"),
                ("すべてのファイル", "*.*"),
            ],
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

        self.image_var.set(image_ref)
        self.add_image_from_input()
        self.refresh_image_candidates()

    def remove_selected_image(self) -> None:
        selected = self.image_listbox.curselection()
        if not selected:
            return
        idx = selected[0]
        del self.form_images[idx]
        self.refresh_form_media_listboxes()

    def clear_images(self) -> None:
        self.form_images = []
        self.refresh_form_media_listboxes()

    def add_youtube_reference(self, value: str) -> bool:
        normalized = normalize_youtube_url(value)
        if not value.strip():
            messagebox.showwarning("入力不足", "YouTube URL を入力してください。")
            return False
        if not normalized:
            messagebox.showwarning("入力エラー", "YouTube URL の形式が不正です。")
            return False
        if normalized in self.form_youtube_urls:
            messagebox.showinfo("重複", "そのYouTube URLはすでに追加されています。")
            return False

        self.form_youtube_urls.append(normalized)
        self.refresh_form_media_listboxes()
        return True

    def add_youtube_from_input(self) -> None:
        if self.add_youtube_reference(self.youtube_var.get()):
            self.youtube_var.set("")

    def remove_selected_youtube(self) -> None:
        selected = self.youtube_listbox.curselection()
        if not selected:
            return
        idx = selected[0]
        del self.form_youtube_urls[idx]
        self.refresh_form_media_listboxes()

    def clear_youtube(self) -> None:
        self.form_youtube_urls = []
        self.refresh_form_media_listboxes()

    def on_select_record(self, _event: Any) -> None:
        selected = self.tree.selection()
        if not selected:
            return

        selected_id = int(selected[0])
        record = next((item for item in self.records if int(item["id"]) == selected_id), None)
        if not record:
            return

        self.title_entry.delete(0, tk.END)
        self.title_entry.insert(0, record["title"])

        self.description_text.delete("1.0", tk.END)
        self.description_text.insert("1.0", record["description"])

        self.form_images = list(record.get("images", []))
        self.form_youtube_urls = list(record.get("youtubeUrls", []))
        self.refresh_form_media_listboxes()
        self.status_var.set(f"選択中: id={selected_id}")

    def clear_form(self) -> None:
        self.title_entry.delete(0, tk.END)
        self.image_var.set("")
        self.youtube_var.set("")
        self.description_text.delete("1.0", tk.END)
        self.form_images = []
        self.form_youtube_urls = []
        self.refresh_form_media_listboxes()
        self.tree.selection_remove(*self.tree.selection())
        self.status_var.set("入力をクリアしました。")

    def validate_form(self) -> tuple[str, str] | None:
        title = self.title_entry.get().strip()
        description = self.description_text.get("1.0", tk.END).strip()

        if not title:
            messagebox.showwarning("入力不足", "タイトルを入力してください。")
            return None
        if not description:
            messagebox.showwarning("入力不足", "説明を入力してください。")
            return None
        if not self.form_images and not self.form_youtube_urls:
            messagebox.showwarning("入力不足", "画像またはYouTubeを1件以上追加してください。")
            return None

        for image in self.form_images:
            if not image_exists_in_public(self.public_dir, image):
                messagebox.showwarning("画像が見つかりません", f"public/{image} が見つかりません。")
                return None

        return (title, description)

    def build_record_from_form(self, record_id: int) -> dict[str, Any] | None:
        validated = self.validate_form()
        if validated is None:
            return None

        title, description = validated
        return {
            "id": record_id,
            "title": title,
            "description": description,
            "images": unique_strings(self.form_images),
            "youtubeUrls": unique_strings(self.form_youtube_urls),
        }

    def add_record_from_form(self) -> None:
        record = self.build_record_from_form(next_id(self.records))
        if record is None:
            return

        self.records.append(record)
        save_records(self.data_file, self.records)
        self.refresh_records()
        self.tree.selection_set(str(record["id"]))
        self.tree.focus(str(record["id"]))
        self.status_var.set(f'追加しました: id={record["id"]}')

    def update_selected_record(self) -> None:
        selected = self.tree.selection()
        if not selected:
            messagebox.showinfo("選択なし", "更新するレコードを選択してください。")
            return

        selected_id = int(selected[0])
        record = self.build_record_from_form(selected_id)
        if record is None:
            return

        replaced = False
        for index, item in enumerate(self.records):
            if int(item["id"]) == selected_id:
                self.records[index] = record
                replaced = True
                break

        if not replaced:
            messagebox.showerror("更新エラー", f"id={selected_id} が見つかりません。")
            return

        save_records(self.data_file, self.records)
        self.refresh_records()
        self.tree.selection_set(str(selected_id))
        self.tree.focus(str(selected_id))
        self.status_var.set(f"id={selected_id} を更新しました。")

    def delete_selected_record(self) -> None:
        selected = self.tree.selection()
        if not selected:
            messagebox.showinfo("選択なし", "削除するレコードを選択してください。")
            return

        selected_id = int(selected[0])
        target = next((item for item in self.records if int(item["id"]) == selected_id), None)
        if not target:
            messagebox.showerror("削除エラー", f"id={selected_id} が見つかりません。")
            return

        confirmed = messagebox.askyesno(
            "確認",
            f'id={selected_id}「{target["title"]}」を削除しますか？',
        )
        if not confirmed:
            return

        self.records = [item for item in self.records if int(item["id"]) != selected_id]
        save_records(self.data_file, self.records)
        self.refresh_records()
        self.clear_form()
        self.status_var.set(f"id={selected_id} を削除しました。")


def run_gui(data_file: Path) -> int:
    root = tk.Tk()
    RecordsGui(root, data_file)
    root.mainloop()
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="成長記録データを追加・削除・一覧表示します。")
    parser.add_argument(
        "--data-file",
        type=Path,
        default=DEFAULT_DATA_FILE,
        help=f"データファイルのパス（デフォルト: {DEFAULT_DATA_FILE}）",
    )
    parser.add_argument(
        "command",
        nargs="?",
        choices=("gui", "list", "add", "delete"),
        default="gui",
        help="実行コマンド（省略時: gui）",
    )
    parser.add_argument("--title", help="タイトル")
    parser.add_argument("--description", help="説明文")
    parser.add_argument("--image", action="append", default=[], help="画像ファイル名（public配下）: 複数指定可")
    parser.add_argument("--youtube", action="append", default=[], help="YouTube URL（watch/short/youtu.be対応）: 複数指定可")
    parser.add_argument("--id", type=int, help="削除対象ID")

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "gui":
        return run_gui(args.data_file)
    if args.command == "list":
        return cmd_list(args)
    if args.command == "add":
        if not args.title or not args.description:
            parser.error("add には --title と --description が必要です。")
        return cmd_add(args)
    if args.command == "delete":
        if args.id is None:
            parser.error("delete には --id が必要です。")
        return cmd_delete(args)

    parser.error("不明なコマンドです。")
    return 1


if __name__ == "__main__":
    sys.exit(main())
