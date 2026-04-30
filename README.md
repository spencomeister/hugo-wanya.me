# hugo-wanya.me

WANYA ポートフォリオサイトの Hugo プロジェクトです。  
MicroCMS でコンテンツを管理し、Cloudflare Pages でホスティングします。

## アーキテクチャ

```
MicroCMS (コンテンツ管理)
  │  Webhook
  ▼
Cloudflare Worker (/api/cms-webhook)
  │  Deploy Hook
  ▼
Cloudflare Pages ビルド開始
  │  fetch-cms.js (MicroCMS API からデータ取得)
  ▼
Hugo 静的サイト生成 → デプロイ
```

お問い合わせフォームは Cloudflare Worker (`/api/contact`) + Resend で処理します。

## ディレクトリ構成

```
hugo-wanya.me/
├── config.toml              # サイト設定（ブランド名・メニュー・Turnstile キーなど）
├── fetch-cms.js             # ビルド前に MicroCMS からデータを取得するスクリプト
├── content/                 # 各ページの Markdown（フロントマターのみ）
│   ├── _index.md
│   ├── about/_index.md
│   ├── works/_index.md
│   ├── price/_index.md
│   ├── guidelines/_index.md
│   └── contact/_index.md
├── layouts/                 # Hugo テンプレート
│   ├── _default/baseof.html
│   ├── index.html
│   ├── about/list.html
│   ├── works/list.html
│   ├── price/list.html
│   ├── guidelines/list.html
│   ├── contact/list.html
│   └── partials/
├── data/                    # fetch-cms.js が書き出す JSON / YAML
│   ├── about/profile.json
│   ├── price/price.json
│   └── works/
│       ├── items.json       # MicroCMS から取得した作品一覧
│       └── categories.yaml  # カテゴリ定義（手動管理）
├── static/                  # CSS / JS / 画像
│   ├── css/
│   ├── js/
│   └── images/
└── microcms-import/         # MicroCMS 初期インポート用 CSV テンプレート
```

## ローカル開発

Hugo 単体で動作します（依存ライブラリ不要）。

```bash
# 開発サーバー起動
hugo server --disableFastRender --port 1313
```

MicroCMS データを手動取得してから起動する場合：

```bash
MICROCMS_SERVICE_ID=your-service-id MICROCMS_API_KEY=your-key node fetch-cms.js
hugo server --disableFastRender --port 1313
```

環境変数を設定しなくてもフォールバックデータ（空データ）で起動できます。

## Worksカテゴリ

`data/works/categories.yaml` で管理します（手動編集）。

| slug | 表示名 | 用途 |
|---|---|---|
| `vtuber` | VTuber | Live2Dモデル・配信向け素材 |
| `illustration` | キャラクターイラスト | 等身/半身カラーイラスト |
| `chibi` | デフォルメ | SDキャラクター・アイコン |
| `stamp` | 配信用スタンプ | 静止画・アニメーションスタンプ |
| `motion` | 動画・モーション | モーショングラフィックスや動画演出 |

MicroCMS の works API では `category` フィールドに上記 slug をセレクト値として登録してください。

## Cloudflare Pages ビルド設定

| 項目 | 値 |
|---|---|
| Build command | `node fetch-cms.js && hugo` |
| Build output directory | `public` |
| Root directory | `hugo-wanya.me` |

### 必要な環境変数

| 変数名 | 内容 |
|---|---|
| `MICROCMS_SERVICE_ID` | MicroCMS サービスID |
| `MICROCMS_API_KEY` | MicroCMS API キー（GET権限）|
| `HUGO_VERSION` | 使用する Hugo のバージョン（例: `0.147.0`）|

## Cloudflare Workers

別リポジトリ `wrk-wanya.me` で管理。以下の2エンドポイントを提供します。

| パス | 役割 |
|---|---|
| `/api/contact` | お問い合わせフォーム処理（Resend 経由でメール送信） |
| `/api/cms-webhook` | MicroCMS Webhook 受信 → Pages デプロイフック実行 |

詳細なセットアップ手順は `SETUP.md` を参照してください。

## ライセンス

`LICENSE` ファイルを参照してください。
