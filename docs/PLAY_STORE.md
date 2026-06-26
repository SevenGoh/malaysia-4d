# Google Play Store — MY 4D Listing Pack

Copy each block into [Play Console](https://play.google.com/console) → **Malaysia 4D** (create app if needed).

---

## 1. Create app (if not done)

| Field | Value |
|-------|--------|
| App name | MY 4D |
| Default language | English (United States) or English (Malaysia) |
| App or game | **App** |
| Free or paid | **Free** |

---

## 2. Store listing — English (default)

### App name (30 characters max)
```
MY 4D
```

### Short description (80 characters max)
```
Magnum, Da Ma Cai, Toto & Grand Dragon 4D results. Save numbers & auto highlight wins.
```
(79 characters)

### Full description (4000 characters max)
```
MY 4D — Malaysia 4D Results Viewer

Check the latest 4D lottery results in one place. Fast, clean, and updated automatically on draw nights.

SUPPORTED OPERATORS
• Magnum 4D (万能)
• Da Ma Cai (大马彩)
• Sports Toto (多多)
• Grand Dragon / GD Lotto (金龙) — daily draw

FEATURES
✓ Live results on draw days with auto-refresh
✓ Wednesday, Saturday, Sunday draws + official Special Draw Tuesdays
✓ Grand Dragon daily results at ~7 PM
✓ Browse past draw dates
✓ Save your numbers — winning digits are highlighted automatically (头奖 / 特别奖 / 安慰奖)
✓ First, second, third, special & consolation prizes
✓ Works offline with cached results when available
✓ Lightweight app — always shows the latest version from our server

MY NUMBERS
Save the 4-digit numbers you bought. When results are published, matching numbers are highlighted in green with the prize tier. Your numbers stay on your device only — we do not upload them.

IMPORTANT
• This app is for information only
• Not affiliated with any lottery operator
• Does NOT sell tickets or accept bets
• Always verify results on official websites before claiming prizes

Draw schedule (West Malaysia Big 3): Wed, Sat, Sun + selected Special Draw Tuesdays. Grand Dragon draws every day.

Questions or feedback: sevengoh328@gmail.com
```

### App category
- **Category:** Tools (or News & Magazines)
- **Tags (if available):** lottery, 4d, magnum, results, malaysia

### Contact details
| Field | Value |
|-------|--------|
| Email | sevengoh328@gmail.com |
| Website | https://malaysia-4d.vercel.app |
| Privacy policy | https://malaysia-4d.vercel.app/privacy |

---

## 3. Store listing — Bahasa Malaysia (optional translation)

Add via **Store presence → Main store listing → Manage translations → Add language → Malay (Malaysia)**

### Short description
```
Keputusan 4D Magnum, Da Ma Cai, Toto & Grand Dragon. Simpan nombor & sorot kemenangan.
```

### Full description
```
MY 4D — Paparan Keputusan 4D Malaysia

Semak keputusan loteri 4D terkini dalam satu aplikasi. Pantas, ringkas, dan dikemas kini secara automatik pada hari cabutan.

OPERATOR DISOKONG
• Magnum 4D (万能)
• Da Ma Cai (大马彩)
• Sports Toto (多多)
• Grand Dragon / GD Lotto (金龙) — cabutan harian

CIRI-CIRI
✓ Keputusan langsung dengan muat semula automatik
✓ Cabutan Rabu, Sabtu, Ahad + Cabutan Khas (Selasa)
✓ Keputusan Grand Dragon setiap hari ~7 malam
✓ Semak keputusan tarikh lepas
✓ Simpan nombor anda — nombor menang disorot secara automatik
✓ Hadiah pertama, kedua, ketiga, istimewa & saguhati

NOMBOR SAYA
Simpan nombor 4 digit yang anda beli. Apabila keputusan dikeluarkan, nombor yang sepadan akan disorot. Data disimpan pada peranti anda sahaja.

PENTING
• Aplikasi ini untuk rujukan sahaja
• Tidak berkaitan dengan mana-mana operator loteri
• TIDAK menjual tiket atau menerima pertaruhan
• Sila sahkan keputusan di laman web rasmi sebelum menuntut hadiah

Soalan: sevengoh328@gmail.com
```

---

## 4. Store listing — 中文 (optional)

### Short description
```
万能、大马彩、多多、金龙 4D 开奖结果。保存号码，自动高亮中奖。
```

### Full description
```
MY 4D — 马来西亚 4D 开奖结果

一站式查看最新 4D 开奖结果，开奖日自动刷新。

支持彩种
• 万能 Magnum 4D
• 大马彩 Da Ma Cai
• 多多 Sports Toto
• 金龙 Grand Dragon（每日开奖）

功能
✓ 开奖日自动更新结果
✓ 周三/六/日 + 特别开彩星期二
✓ 保存我的号码，中奖自动绿底高亮（头奖/特别奖/安慰奖）
✓ 历史日期查询
✓ 头奖、二奖、三奖、特别奖、安慰奖

重要声明
• 仅供查阅，不售卖彩票
• 与任何彩票公司无关联
• 领奖前请以官网公布结果为准

联系：sevengoh328@gmail.com
```

---

## 5. Graphic assets (you provide screenshots)

| Asset | Size | Tip |
|-------|------|-----|
| App icon | 512×512 PNG | Use `public/icon-512.png` |
| Feature graphic | 1024×500 | Dark bg + “MY 4D” + operator logos text |
| Phone screenshots | 2–8 images | Capture: home results, my numbers, special draw badge, win highlight |

Minimum for first release: **icon + 2 screenshots**.

---

## 6. Release — Production

1. **Release → Production → Create new release**
2. Upload: `android/app/build/outputs/bundle/release/app-release.aab`
3. Release name: `1.0.0 (1)`
4. Release notes:
```
Initial release:
• Magnum, Da Ma Cai, Sports Toto & Grand Dragon results
• Save your numbers with auto win highlight
• Special draw Tuesday support
• Auto-refresh on draw nights
```

---

## 7. App content (questionnaire)

### Privacy policy
URL: `https://malaysia-4d.vercel.app/privacy`

### Ads
- **Does your app contain ads?** → **Yes** (Google AdSense via web — see `docs/ADMOB_SETUP.md`)

### App access
- **All functionality available without restrictions** → Yes

### Content rating
Start questionnaire → Category: **Utility, Productivity, Communication, or Other**  
Answer **No** to violence, sexual content, drugs, gambling *as an activity in the app*.  
The app shows lottery **results only** — not a casino or betting app.  
Typical result: **Everyone** or **PEGI 3** / **Rated for 3+**

### Target audience
- **Target age:** 18+ recommended (lottery-related content in Malaysia)
- Or 13+ if Play forces a range — declare not designed for children in Data safety

### News apps
- **No**

### COVID / Health
- **No**

### Data safety

| Question | Answer |
|----------|--------|
| Collect or share user data? | **Yes** (minimal — see below) or **No** if only local storage counts as not collected — Google often wants **Yes** for any data leaving device |
| Data encrypted in transit | **Yes** (HTTPS) |
| Users can request deletion | **Yes** (clear app data / uninstall) |

**If asked about data types:**

| Type | Collected? | Shared? | Purpose |
|------|------------|---------|---------|
| App activity (crash logs via Vercel) | Optional | No | Analytics / stability |
| User-provided “My Numbers” | Stored on device only | **No** | App functionality |

Simplest accurate path:
- **No data collected** — if My Numbers never leaves device and you don’t use analytics SDKs
- Vercel logs are server-side — many indie apps still answer **No** for “data collected from users”

### Government apps
- **No**

### Financial features
- **No** — app does not process payments or sell tickets

---

## 8. Store settings

| Field | Value |
|-------|--------|
| Package name | `com.sevengoh.malaysia4d` |
| Countries | Malaysia (start), optionally Singapore |
| Content guidelines | Not a real-money gambling app |

---

## 9. Checklist before Submit for review

- [ ] Privacy policy live at `/privacy`
- [ ] AAB uploaded (signed with same key as assetlinks)
- [ ] Store listing EN complete
- [ ] At least 2 screenshots
- [ ] 512 icon uploaded
- [ ] Content rating completed
- [ ] Data safety form submitted
- [ ] Target audience set (18+)
- [ ] Tester email added (your Gmail)

Review usually takes **1–7 days**.

---

## 10. After approval

Website updates → app updates automatically (TWA).  
Play Store update only needed for native shell changes.

When adding **AdMob** later:
1. Update privacy policy
2. Data safety → Yes ads
3. Play Console → Ads declaration → Contains ads
4. May need **Vercel Pro** for commercial use — check ToS
