# context-delta オペレーションチェックリスト（現行仕様）

## 1. 初期化/更新
- [ ] `delta init` で prompts/promptcards を展開（LANG に応じて ja/en）
- [ ] `delta update` でテンプレートを更新し、各アシスタント先へ再同期

## 2. カスタムプロンプト配布
- [ ] 必要なプロンプトは propose / apply / verify / archive / list / delete の 6 本のみ
- [ ] 配布先: `.claude/`、`.cursor/`、`.github/`、`context-delta/commands/`、`$CODEX_HOME`（なければ `~/.codex/prompts/`）

## 3. PromptCard
- [ ] PromptCard は Markdown（`.md`）で `doc_type` を含む
- [ ] `delta card sync` 後に `promptcards/index.json` を更新（doc_type/promptcard_id/mode/path）
- [ ] 最小 doc_type セット（req.usdm / spec.api / design.arch_overview / test.plan / ops.runbook / delta.summary）を維持

## 4. delta フロー運用
- [ ] propose → apply → verify → archive の順で 1 delta = 1 目的を維持
- [ ] `delta list` で未アーカイブを確認、不要なものは `delta delete`
- [ ] `--delta-id` 省略時は直近の未アーカイブ delta をデフォルト対象とする運用を確認

## 5. アーカイブ
- [ ] `delta archive` で summary.md / apply.patch / doc_instances.json のエッセンスのみを保存
- [ ] 未完タスクや別目的が混ざる場合はアーカイブせず、新しい delta を切る
