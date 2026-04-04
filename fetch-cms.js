/**
 * fetch-cms.js
 * Pre-build script: fetches data from MicroCMS and writes to Hugo data files.
 * Usage: node fetch-cms.js
 * Required env vars: MICROCMS_SERVICE_ID, MICROCMS_API_KEY
 */

const fs = require('fs');
const path = require('path');

const SERVICE_ID = process.env.MICROCMS_SERVICE_ID;
const API_KEY = process.env.MICROCMS_API_KEY;

if (!SERVICE_ID || !API_KEY) {
  console.warn('[fetch-cms] MICROCMS_SERVICE_ID or MICROCMS_API_KEY not set. Using fallback data.');
}

const BASE_URL = SERVICE_ID ? `https://${SERVICE_ID}.microcms.io/api/v1` : null;

const headers = API_KEY ? { 'X-MICROCMS-API-KEY': API_KEY } : {};

async function fetchEndpoint(endpoint, params = '') {
  if (!BASE_URL) return null;
  const url = `${BASE_URL}/${endpoint}${params ? '?' + params : ''}`;
  console.log(`[fetch-cms] Fetching ${endpoint}...`);
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`${endpoint}: HTTP ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeJson(filePath, data) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[fetch-cms] Wrote ${filePath}`);
}

// Fallback data when CMS is not configured
const FALLBACK_WORKS = { contents: [], totalCount: 0 };
const FALLBACK_PROFILE = {
  name: 'WANYA',
  role: 'イラストレーター・アーティスト',
  description: [
    'こんにちは、WANYAです。イラスト制作、キャラクターデザイン、アート作品の制作を手掛けています。',
    'デジタルイラストを中心に幅広いスタイルで制作し、ご依頼主の想いを丁寧に形にします。',
    'どんな小さなご相談でもお気軽にお声かけください。'
  ],
  stats: [
    { label: '制作実績', value: '100+' },
    { label: '活動歴', value: '3年' },
    { label: '平均制作時間', value: '24時間' }
  ],
  specialties: [
    { emoji: '🎨', title: 'キャラクターデザイン', description: 'オリジナル・二次創作キャラクターを幅広く制作' },
    { emoji: '✨', title: 'Live2Dモデル', description: 'VTuber向けのLive2Dモデル設定・モデリング' },
    { emoji: '🌟', title: 'デフォルメイラスト', description: 'かわいらしいSD・スタンプ用イラスト' }
  ],
  tools: [
    { name: 'Adobe Photoshop', description: 'メインイラスト制作' },
    { name: 'CLIP STUDIO PAINT', description: '線画・カラーリング' },
    { name: 'Live2D Cubism', description: 'Live2Dモデル制作' }
  ],
  achievements: [
    { date: '2022年', title: 'フリーランス活動開始', description: 'イラストレーターとして本格的に活動を開始' },
    { date: '2023年', title: 'Live2Dモデル制作開始', description: 'VTuber向けLive2Dモデル制作をスタート' },
    { date: '2024年', title: '制作実績100件達成', description: '様々なジャンルでの制作実績が100件を突破' },
    { date: '2025年', title: '現在', description: '新しい表現技法の習得に励んでいます' }
  ]
};
const FALLBACK_PRICE = {
  intro: '各種イラスト制作の料金表です。詳細な内容やオプションについては、お気軽にお問い合わせください。',
  note: '※価格は税込み表示です。制作内容により料金が変動する場合があります。',
  sections: [
    { key: 'skeb', title: '🎨 Skeb', items: [
      { name: 'バストアップ', price: 3000, description: '胸から上の構図' },
      { name: '半身', price: 4500, description: '腰から上の構図' },
      { name: '全身', price: 6000, description: '全身構図' },
      { name: '追加キャラクター', price: 2000, description: '1体につき' }
    ]},
    { key: 'illustration', title: '✨ 等身大イラスト', items: [
      { name: 'バストアップ（線画のみ）', price: 8000, description: 'モノクロ線画' },
      { name: 'バストアップ（着色込み）', price: 12000, description: 'フルカラー' },
      { name: '半身（着色込み）', price: 18000, description: '腰から上' },
      { name: '全身（着色込み）', price: 25000, description: '背景シンプル' },
      { name: '複雑な背景', price: 5000, description: '内容により変動' }
    ]},
    { key: 'live2d', title: '🪄 Live2D', items: [
      { name: 'Live2D モデル（標準）', price: 40000, description: '立ち絵＋基本モーション' },
      { name: '表情差分', price: 5000, description: '追加表情ごと' },
      { name: 'モーション追加', price: 8000, description: '内容により変動' }
    ]}
  ],
  options: [
    { icon: '⚡', title: '特急料金', price: '+50%', description: '1週間以内の納期をご希望の場合' },
    { icon: '🔄', title: '追加修正', price: '¥2,000〜', description: '規定回数を超える修正の場合' },
    { icon: '💼', title: '商用利用', price: '+30%', description: '商用利用をご希望の場合' },
    { icon: '🔒', title: '作品非公開', price: '+¥5,000', description: 'ポートフォリオ掲載を希望されない場合' }
  ],
  flow: [
    { title: 'お問い合わせ・見積もり', description: '詳細をお聞かせください。お見積もりをご提示いたします。' },
    { title: '前金お支払い', description: '制作費の50%を前金としてお支払いいただきます。' },
    { title: '制作開始・ラフ提出', description: 'ラフ画を作成し、確認していただきます。' },
    { title: '仕上げ・完成', description: '着色・仕上げを行い、完成品をお渡しします。' },
    { title: '残金お支払い', description: '残り50%をお支払いいただき、完了です。' }
  ]
};

async function main() {
  const dataDir = path.join(__dirname, 'data');

  // Fetch works (list API)
  let works;
  try {
    works = await fetchEndpoint('works', 'limit=100&orders=order');
  } catch (err) {
    console.warn(`[fetch-cms] Works fetch failed: ${err.message}`);
    works = null;
  }
  writeJson(path.join(dataDir, 'works', 'items.json'), works || FALLBACK_WORKS);

  // Fetch profile (object API — single item, no list wrapper)
  let profile;
  try {
    profile = await fetchEndpoint('profile');
  } catch (err) {
    console.warn(`[fetch-cms] Profile fetch failed: ${err.message}`);
    profile = null;
  }
  writeJson(path.join(dataDir, 'about', 'profile.json'), profile || FALLBACK_PROFILE);

  // Fetch price (object API — single item)
  let price;
  try {
    price = await fetchEndpoint('price');
  } catch (err) {
    console.warn(`[fetch-cms] Price fetch failed: ${err.message}`);
    price = null;
  }
  writeJson(path.join(dataDir, 'price', 'price.json'), price || FALLBACK_PRICE);

  console.log('[fetch-cms] Done.');
}

main().catch((err) => {
  console.error('[fetch-cms] Fatal error:', err);
  // Write fallback data so build can proceed
  const dataDir = path.join(__dirname, 'data');
  writeJson(path.join(dataDir, 'works', 'items.json'), FALLBACK_WORKS);
  writeJson(path.join(dataDir, 'about', 'profile.json'), FALLBACK_PROFILE);
  writeJson(path.join(dataDir, 'price', 'price.json'), FALLBACK_PRICE);
  console.log('[fetch-cms] Wrote fallback data. Build can continue.');
});
