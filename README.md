# hugo-wanya.me

WANYA ポートフォリオサイトを構築・デプロイするための Hugo プロジェクトです。Cloudflare Pages + Workers + Resend の構成を前提としており、`/api/contact` エンドポイントを通じて問い合わせフォームを処理します。

## ディレクトリ構成

- `config.toml` – サイト設定。ブランド名、メニュー、問い合わせ表示切り替えなどを管理。
- `content/` – 各ページのコンテンツ (Markdown)。
- `layouts/` – テンプレート。`layouts/contact/list.html` が問い合わせページ。
- `static/` – 画像・CSS・JavaScript などの静的アセット。`static/js/contact.js` がフォーム送信ロジック。
- `public/` – `hugo` コマンド実行時に生成されるビルド成果物。Cloudflare Pages ではビルド時に生成されるため Git には含めません。

## ローカル開発

```bash
# 依存ライブラリ不要。Hugo 単体でビルド
cd hugo
hugo server --buildDrafts --buildFuture
```

- 開発サーバーは `http://localhost:1313` で起動。
- `config.toml` の `contactEnabled` を `true` にするとフォーム UI を公開ステージングで確認できます。

## ビルド & デプロイ

1. **Cloudflare Pages**
   - ビルドコマンド: `cd hugo && hugo --minify`
   - 出力ディレクトリ: `hugo/public`
   - 例: `HUGO_VERSION=0.125.5` を環境変数に設定。
2. **Cloudflare Workers (`/api/contact`)**
   - Resend API を呼び出す Worker を作成し、`wrangler secret put RESEND_API_KEY` などで機密情報を登録。
   - Pages Functions もしくは Routes を用いて `/api/contact*` を Worker にマッピング。
3. **Resend**
   - ドメイン認証後、API Key を発行。Workers 側で参照。

## ライセンス

本プロジェクトのライセンスは `LICENSE` ファイルを参照してください。
