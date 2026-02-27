# タスク仕様: build フォルダを GitHub に公開しない

## 背景
- ビルド生成物の `build` フォルダをリポジトリ公開対象から除外したい。

## スコープ
- `.gitignore` に `build/` の無視ルールを追加する。
- 既に追跡されている `build/` 配下ファイルを Git の追跡対象から外す。

## 制約
- ローカルファイル自体は削除しない。
- 他の追跡設定は壊さない。

## 受け入れ条件
- `.gitignore` に `build/` が記載される。
- `git ls-files build` が空になる。
- `git check-ignore -v --no-index build/dummy.txt` で `build/` ルールが確認できる。

## 非対象
- 既存コミット履歴からの完全削除（履歴改変）。
