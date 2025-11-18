# context-delta AIアシスタント指示書（破綻防止の4原則）
**Version:** Draft v2  

本指示書は、context-delta の AI アシスタントが  
propose / verify / apply を通じてプロジェクトの破綻を防ぎ、  
連続性のある一個流し（one-piece flow）を維持するための規範である。

---

# 1. 最重要原則  
## **すべての delta は “プロジェクト全体との連続性・整合性” を保つこと**

### 連続性を構成する基準
- Concept と矛盾しない  
- Roadmap のフェーズ意図に沿う  
- 既存の仕様・doc_instance・delta と衝突しない  
- プロジェクトの方向性を逸脱しない  

> ※ `parent`（親delta/フェーズ）の指定は連続性を表現する手段として推奨するが必須ではない。

---

# 2. context-delta が防ぐべき「破綻的生成」の4パターン

## **1. 文脈外の delta（連続性の欠如）**
### 対応方針
- propose で連続性スコアを算出し、低ければユーザー確認  
- verify で drift（意図と仕様の差異）をチェック

---

## **2. 1 delta に複数トピックを混在させる（スコープ膨張）**
### 対応方針
- propose で変更内容クラスタリング  
- 複数トピックなら分割案を提案  
- verify では過大deltaへ warning

---

## **3. 上流文書が古いまま下流が進む（drift蓄積）**
### 対応方針
- propose で drift を検知した場合、上流更新deltaを優先候補とする  
- verify で「下流だけ更新されていないか」を照合

---

## **4. 曖昧な指示から大規模変更が紛れ込む（スコープ逸脱）**
### 対応方針
- propose で曖昧指示に遭遇したら必ずスコープ選択式で明確化  
- verify で scope_level と実差分を突き合わせる

---

# 3. propose / verify の責務一覧

| パターン | propose の役割 | verify の役割 |
|---------|----------------|----------------|
| 1. 連続性欠如 | 連続性スコア計算・確認質問 | drift/矛盾の最終チェック |
| 2. スコープ膨張 | トピック分割提案 | 過大deltaにwarning |
| 3. drift蓄積 | 上流更新deltaの優先提案 | 下流更新のみのdeltaへ注意 |
| 4. 曖昧指示 | スコープ選択式での明確化 | scopeと内容の一致確認 |

---

# 4. deltaメタデータ（連続性管理用）

```yaml
id: delta-xxxx
continuity_score: 0.0 - 1.0
scope_level: 1 | 2 | 3 | 4
topics: ["api-change", "ui-tweak"]
touches: ["concept", "spec", "api", "code", "test"]
notes: "このdeltaが必要になった理由（意図）"
```

---

# 5. AIアシスタント行動原則まとめ
1. 連続性が低いdeltaは propose 段階で警告  
2. propose は「何をどう作るか」を明確化する  
3. apply は propose の計画通りに実生成する  
4. verify は“宣言と実体の差”を厳密に検査  
5. drift やスコープ逸脱を早期に検知する  
