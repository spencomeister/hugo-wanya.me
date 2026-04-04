# WANYA Portfolio — セットアップガイド

本ドキュメントでは、Cloudflare Pages / Workers、GitHub、MicroCMS に必要な設定をまとめます。

---

## 目次

1. [アーキテクチャ概要](#アーキテクチャ概要)
2. [MicroCMS の設定](#microcms-の設定)
3. [GitHub の設定](#github-の設定)
4. [Cloudflare Pages の設定](#cloudflare-pages-の設定)
5. [Cloudflare Workers の設定](#cloudflare-workers-の設定)
6. [デプロイフロー（全体の流れ）](#デプロイフロー)
7. [ローカル開発](#ローカル開発)
8. [チェックリスト](#チェックリスト)

---

## アーキテクチャ概要

```
┌──────────────┐    Webhook     ┌──────────────────┐   Deploy Hook (POST)   ┌──────────────────┐
│   MicroCMS   │ ─────────────→ │ Cloudflare Worker │ ─────────────────────→ │ Cloudflare Pages │
│  (コンテンツ)  │                │ /api/cms-webhook  │                        │  (ビルド開始)     │
└──────────────┘                └──────────────────┘                        └────────┬─────────┘
                                                                                     │
                                                                                     ▼
                                 ┌──────────────────┐    fetch-cms.js     ┌──────────────┐
                                 │   MicroCMS API   │ ←───ビルド時実行──── │  Hugo Build   │
                                 │   (データ取得)    │                     │  静的サイト生成  │
                                 └──────────────────┘                     └──────────────┘
```

---

## MicroCMS の設定

### 1. サービス作成

- <https://microcms.io> でアカウント作成
- サービスを新規作成（サービスID 例: `wanya-portfolio`）
- APIキー（GET 権限）を控えておく

### 2. API スキーマ定義

#### `works` — リスト形式 API

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
|---|---|---|---|---|
| `title` | タイトル | テキスト | ✅ | 作品名 |
| `description` | 説明 | テキストエリア | | 作品の説明文 |
| `category` | カテゴリ | セレクト | ✅ | `vtuber` / `illustration` / `chibi` / `motion` |
| `tags` | タグ | セレクト（複数選択） | | 選択肢を事前定義、複数選択を有効化 |
| `images` | 画像 | リスト（画像） | ✅ | 複数枚対応（カルーセル用） |
| `order` | 表示順 | 数値 | | ソート用（昇順） |

#### `profile` — オブジェクト形式 API（1件のみ）

| フィールドID | 表示名 | 種類 | 備考 |
|---|---|---|---|
| `name` | 名前 | テキスト | アーティスト名 |
| `role` | 肩書き | テキスト | 例: イラストレーター・アーティスト |
| `image` | プロフィール画像 | 画像 | 任意 |
| `description` | 自己紹介 | リッチエディタ or テキストエリア | |
| `stats` | 実績数値 | 繰り返し | 子: `label`(テキスト), `value`(テキスト) |
| `specialties` | 得意分野 | 繰り返し | 子: `emoji`(テキスト), `title`(テキスト), `description`(テキストエリア) |
| `tools` | 使用ツール | 繰り返し | 子: `name`(テキスト), `description`(テキスト) |
| `achievements` | 経歴 | 繰り返し | 子: `date`(テキスト), `title`(テキスト), `description`(テキストエリア) |

#### `price` — オブジェクト形式 API（1件のみ）

| フィールドID | 表示名 | 種類 | 備考 |
|---|---|---|---|
| `intro` | 導入文 | テキストエリア | 料金ページの冒頭文 |
| `note` | 注意書き | テキスト | 全体の免責事項 |
| `sections` | 料金セクション | 繰り返し | 子: `key`(テキスト), `title`(テキスト), `items`(繰り返し) |
| `sections.items` | 料金項目 | 繰り返し | 子: `name`(テキスト), `price`(数値), `description`(テキスト) |
| `options` | オプション | 繰り返し | 子: `icon`(テキスト), `title`(テキスト), `price`(テキスト), `description`(テキスト) |
| `flow` | ご依頼の流れ | 繰り返し | 子: `title`(テキスト), `description`(テキスト) |

### 3. データインポート

`microcms-import/` フォルダに CSV テンプレートを用意済み:

- `profile.csv` — プロフィール初期データ
- `price.csv` — 料金初期データ

MicroCMS 管理画面 → 対象 API → 「インポート」から CSV をアップロード。

### 4. Webhook 設定

MicroCMS 管理画面 → API設定 → Webhook:

| 項目 | 値 |
|---|---|
| URL | `https://wanya.me/api/cms-webhook` |
| シークレット | 任意の文字列（Worker の `CMS_WEBHOOK_SECRET` と同じ値） |
| トリガー | コンテンツの**公開・更新・削除** |

---

## GitHub の設定

### 1. リポジトリ構成

2つの GitHub リポジトリに分けて管理:

| リポジトリ | 内容 | Cloudflare 連携先 |
|---|---|---|
| `spencomeister/hugo-wanya-me` | Hugo サイト + `fetch-cms.js` | Cloudflare Pages |
| `spencomeister/wrk-wanya-me` | Cloudflare Worker（contact + webhook） | Cloudflare Workers |

GitHub Actions やPAT は不要です。MicroCMS コンテンツ更新時のビルドトリガーは Cloudflare Pages のデプロイフックで直接実行します。

---

## Cloudflare Pages の設定

### 1. プロジェクト作成

Cloudflare Dashboard → Pages → 「Create a project」→ GitHub リポジトリを接続。

### 2. ビルド設定

| 項目 | 値 |
|---|---|
| Framework preset | Hugo |
| Build command | `node fetch-cms.js && hugo` |
| Build output directory | `public` |
| Root directory | `hugo-wanya.me` |

### 3. 環境変数

| 変数名 | 値 | 備考 |
|---|---|---|
| `MICROCMS_SERVICE_ID` | `wanya-portfolio`（実際のサービスID） | MicroCMS サービスID |
| `MICROCMS_API_KEY` | MicroCMS の API キー | **暗号化推奨** |
| `HUGO_VERSION` | `0.159.2` | Hugo Extended のバージョン指定 |

### 4. デプロイフック作成

Cloudflare Dashboard → Pages → `hugo-wanya-me` → Settings → Builds & deployments → **Deploy hooks**:

| 項目 | 値 |
|---|---|
| Deploy hook name | `microcms-update` |
| Branch | `main` |

生成された URL を控える → Worker の `CF_PAGES_DEPLOY_HOOK` に設定。

### 5. カスタムドメイン

Pages → Custom domains → `wanya.me` を追加（DNS レコードを Cloudflare で管理している場合は自動設定）。

---

## Cloudflare Workers の設定

### 1. デプロイ

```bash
cd wrk-wanya.me
npm install
npx wrangler deploy
```

### 2. ルーティング（wrangler.toml に定義済み）

| パターン | ゾーン |
|---|---|
| `wanya.me/api/contact*` | `wanya.me` |
| `wanya.me/api/cms-webhook*` | `wanya.me` |

### 3. 環境変数（Secrets）

Cloudflare Dashboard → Workers → `wrk-wanya-me` → Settings → Variables、
または `wrangler secret put <NAME>` で設定:

| 変数名 | 用途 | 設定方法 |
|---|---|---|
| `RESEND_API_KEY` | Resend メール送信 API キー | Secret |
| `FROM_EMAIL` | 送信元メールアドレス | Secret |
| `TO_EMAIL` | 受信先メールアドレス（カンマ区切りで複数可） | Secret |
| `TURNSTILE_SECRET` | Cloudflare Turnstile シークレットキー | Secret |
| `CMS_WEBHOOK_SECRET` | MicroCMS Webhook 署名検証用シークレット | Secret |
| `CF_PAGES_DEPLOY_HOOK` | Cloudflare Pages デプロイフック URL | Secret |

以下は `wrangler.toml` に定義済み（変更不要）:

| 変数名 | 値 |
|---|---|
| `SITE_NAME` | `WANYA Portfolio` |
| `ALLOWED_ORIGINS` | `https://wanya.me,https://www.wanya.me` |

### 4. Cloudflare Turnstile

Cloudflare Dashboard → Turnstile → サイトを追加:

| 項目 | 値 |
|---|---|
| サイト名 | `wanya.me` |
| ドメイン | `wanya.me` |
| Widget mode | Managed |

取得したキー:

- **Site Key** → `config.toml` の `turnstileSiteKey`（現在: `0x4AAAAAACE58aRI554J7CBc`）
- **Secret Key** → Worker の `TURNSTILE_SECRET`

---

## デプロイフロー

### 通常のコード変更

```
git push → Cloudflare Pages が検知 → hugo ビルド → デプロイ
```

### MicroCMS コンテンツ更新

```
MicroCMS で記事を更新
  ↓
MicroCMS Webhook → POST https://wanya.me/api/cms-webhook
  ↓
Worker が HMAC-SHA256 で署名検証
  ↓
Worker → Cloudflare Pages デプロイフック (POST)
  ↓
Cloudflare Pages: ビルド開始
  ↓
fetch-cms.js: MicroCMS API から最新データ取得
  ↓
Hugo: 静的サイト生成 → デプロイ完了
```

---

## ローカル開発

### Hugo 開発サーバー

```bash
cd hugo-wanya.me
hugo server --disableFastRender --port 1313
```

### MicroCMS データの手動取得

```bash
cd hugo-wanya.me
# 環境変数を設定してから実行
MICROCMS_SERVICE_ID=your-service-id MICROCMS_API_KEY=your-key node fetch-cms.js
```

環境変数未設定でもフォールバックデータで動作します。

### Worker ローカル開発

```bash
cd wrk-wanya.me
npm run dev
```

---

## チェックリスト

- [ ] MicroCMS: サービス作成 & API スキーマ定義（works / profile / price）
- [ ] MicroCMS: テストコンテンツ登録 or CSV インポート
- [ ] MicroCMS: Webhook URL 設定（`https://wanya.me/api/cms-webhook`）
- [ ] GitHub: リポジトリ作成 & コード push
- [ ] Cloudflare Pages: プロジェクト作成 & ビルド設定
- [ ] Cloudflare Pages: 環境変数設定（`MICROCMS_SERVICE_ID`, `MICROCMS_API_KEY`, `HUGO_VERSION`）
- [ ] Cloudflare Pages: デプロイフック作成（`microcms-update`）
- [ ] Cloudflare Pages: カスタムドメイン設定
- [ ] Cloudflare Workers: `npx wrangler deploy` でデプロイ
- [ ] Cloudflare Workers: Secrets 設定（6項目）
- [ ] Cloudflare Turnstile: サイト登録 & キー設定
- [ ] 動作確認: MicroCMS 更新 → サイト自動再ビルド
- [ ] 動作確認: お問い合わせフォーム送信 → メール受信
