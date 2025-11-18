# context-delta AIアシスタント指示書（フェーズ進行 × doc_instance × PromptCard）
**Version:** Draft v4  

本書は context-delta の AI アシスタントが  
フェーズ（段階進行）を軸としつつ、  
必要な文書（doc_instance）を propose / apply / verify によって  
リーンに生成していくためのルールを定めたものである。

---

# 1. 基本概念

## 1-1. フェーズ（phase）
- プロジェクトを段階的に進めるための単位  
- フェーズごとに  
  - doc_instance を整え  
  - 実装し  
  - 振る舞いを確認する  

## 1-2. doc_type（文書カテゴリ）
- 文書の抽象カテゴリ  
- “すべて埋めるべきチェックリスト”ではない  
例：`usecase`, `api.spec`, `requirements.functional`, など

## 1-3. doc_instance（文書インスタンス）
- 実際に作成・更新する文書の具体例  
例：  
- `api.spec: GET /search`  
- `requirements.functional: 検索機能の要件`

## 1-4. PromptCard
- doc_type/doc_instance を生成・更新するための  
  **テンプレート＋評価規範**  
- 生成指示（instructions）＋Rubric を含む

---

# 2. propose / verify / apply の役割分担

## ✔ delta-propose（段取り）
1. 今のフェーズの目的を理解  
2. 必要な doc_instance 候補を抽出  
3. 各 doc_instance の必要理由を明文化  
4. 対応する PromptCard を選定  
5. PromptCard に渡す **生成指示（instructions）** を明確化  
6. 文書本文は生成しない（あくまで計画）

## ✔ delta-verify（妥当性確認）
- フェーズ意図との整合性  
- doc_instance の過不足  
- 指示の曖昧さの有無  
- scopeの大きさ  
- 既存情報との矛盾

## ✔ delta-apply（実作業）
- PromptCard を使い  
  propose で明確化した指示に従って  
  doc_instance の本文を実生成  
- 変更をリポジトリに反映  
- doc_instance の状態を記録  

---

# 3. “doc_type ではなく doc_instance を作る”原則

- 必要なのは **doc_type 全部を埋めることではない**  
- フェーズごとに必要な **doc_instance だけ** 増やせばよい  
- 同じ doc_type がフェーズごとに何度も登場するのは自然なこと  
  （例：機能ごとに複数の `api.spec` が生まれる）

---

# 4. フェーズと doc_instance の対応例

## Phase 1（検索機能）
- usecase: 検索する  
- requirements.functional: 検索要件  
- api.spec: GET /search  
- ui.map: 検索画面

## Phase 2（注文機能）
- usecase: 注文する  
- requirements.functional: 注文要件  
- api.spec: POST /orders  
- data.model: Order

> 全フェーズ完了後に、プロジェクトに必要だった doc_instance が自然に揃う。

---

# 5. propose／apply の流れ

```
[delta propose]
    ↓  doc_instance決定
    ↓  生成指示決定
[delta verify]
    ↓  妥当性確認
[delta apply]
    ↓  PromptCard実行・文書生成
```

---

# 6. 破綻防止の要点

- propose = 計画（段取り）  
- apply  = 実作業（加工）  
- 1 delta = 1 doc_instance  
- フェーズ目的と一致していること（連続性）  
- drift（上流と下流の乖離）を許さない  
- 曖昧指示はスコープ選択式で明確化  

---

# 7. AIアシスタント行動原則まとめ
1. propose で doc_instance と指示を必ず明確化  
2. apply では propose の指示“だけ”を忠実に作る  
3. verify で連続性・スコープ・矛盾を徹底確認  
4. フェーズ進行に必要な最小の doc_instance のみ生成  
