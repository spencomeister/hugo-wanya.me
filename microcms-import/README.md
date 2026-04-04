# MicroCMS インポート用ファイル

## profile（オブジェクト形式API）

### スキーマ設定
MicroCMSで以下のフィールドを作成してください。

| フィールドID | 表示名 | 種類 | 備考 |
|---|---|---|---|
| name | 名前 | テキストフィールド | |
| role | 肩書き | テキストフィールド | |
| image | プロフィール画像 | 画像 | 任意 |
| description | 自己紹介 | リッチエディタ or 繰り返し(テキスト) | |
| stats | 実績数値 | 繰り返し | label(テキスト), value(テキスト) |
| specialties | スキル | 繰り返し | emoji(テキスト), title(テキスト), description(テキスト) |
| tools | 使用ツール | 繰り返し | name(テキスト), description(テキスト) |
| achievements | 経歴 | 繰り返し | date(テキスト), title(テキスト), description(テキスト) |

### インポート
`profile.csv` をMicroCMSの管理画面からインポートしてください。
繰り返しフィールドはJSON文字列で入っています。

---

## price（オブジェクト形式API）

### スキーマ設定

| フィールドID | 表示名 | 種類 | 備考 |
|---|---|---|---|
| intro | 紹介文 | テキストエリア | 任意 |
| note | 注記 | テキストフィールド | 任意 |
| sections | 料金セクション | 繰り返し | 下記参照 |
| options | オプション | 繰り返し | 下記参照 |
| flow | 制作フロー | 繰り返し | 下記参照 |

**sections の繰り返し内フィールド:**
| フィールドID | 種類 | 備考 |
|---|---|---|
| key | テキストフィールド | skeb, illustration, live2d 等 |
| title | テキストフィールド | セクション表示名 |
| items | 繰り返し | name(テキスト), price(数値), description(テキスト) |

**options の繰り返し内フィールド:**
| フィールドID | 種類 |
|---|---|
| icon | テキストフィールド (絵文字) |
| title | テキストフィールド |
| price | テキストフィールド ("+50%" など) |
| description | テキストフィールド |

**flow の繰り返し内フィールド:**
| フィールドID | 種類 |
|---|---|
| title | テキストフィールド |
| description | テキストフィールド |

### インポート
`price.csv` をMicroCMSの管理画面からインポートしてください。
