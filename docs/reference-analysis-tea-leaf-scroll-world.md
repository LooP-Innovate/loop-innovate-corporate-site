# L∞P Innovate Website v3 — Tea Leaf Reference Architecture Analysis

## Decision Summary

**Recommendation: C — ReferenceとPhase 01をHybrid統合**

`tea-leaf-scroll-world`から採用するのは、6 Scene / 5 transition clipという
Scene grammar、section progressをsegment/local progressへ分解する考え方、posterを
土台にした映像レイヤー、隣接clipのcrossfade、Scene Rail、CSS Variableによる
Progress UIである。

一方、既存L∞P Phase 01のsection-based progress、metadata/duration recovery、
smoothing `0.15`、seek threshold、runtime Reduced Motion監視、Debug UI、GOP最適化は
維持する。Referenceのdocument全体基準、full-page fixed shell、全5動画の一括
`fetch + Blob`、全videoを対象とする常時RAF、失敗を隠すready判定は採用しない。

このPhaseではL∞P本体コードを変更しない。Referenceは次の参照専用shallow cloneへ
隔離した。

```text
references/tea-leaf-scroll-world/
```

- Repository: <https://github.com/amirmushichge/tea-leaf-scroll-world>
- Branch: `main`
- Inspected commit: `57bdceb2bd2bba30cf713822344a45c2aebeff2d`
- Inspection date: 2026-08-19
- Production import: なし

## Repository Architecture

### Relevant structure

```text
tea-leaf-scroll-world/
├─ app/
│  ├─ TeaJourney.tsx       # Scene data、scroll/video engine、UI composition
│  ├─ globals.css          # full-page visual system、responsive、reduced motion
│  ├─ page.tsx             # TeaJourneyのみをrender
│  ├─ layout.tsx           # metadata、font、root layout
│  └─ chatgpt-auth.ts      # L∞Pには不要
├─ public/media/
│  ├─ stills/              # 6 WebP endpoint stills
│  └─ video/               # 5 H.264 transition clips
├─ tests/
│  └─ rendered-html.test.mjs
├─ build/                  # Sites/Vite packaging plugin
├─ db/, drizzle/, examples/d1/
├─ worker/
├─ .openai/hosting.json
├─ package.json
└─ README.md
```

実際のExperienceはほぼ`app/TeaJourney.tsx`と`app/globals.css`の2ファイルに集約
される。`page.tsx`は`TeaJourney`だけを返し、サイト全体が固定型Experienceである。
`db`、Drizzle、ChatGPT Auth、Cloudflare/Vinext、`.openai`、worker、D1 exampleは
starter由来で、Scrollytelling Engineの成立には不要である。

`tests/rendered-html.test.mjs`は削除済みのstarter skeletonを期待しており、
TeaJourneyのtimeline、media、accessibilityを検証していない。Referenceは有用な
挙動ベンチマークだが、現在のtest suiteを根拠にproduction-provenとは扱わない。

### Runtime and media facts

- Next 16.2.6 / React 19.2.6だが、scriptsはVinext/Viteを使用する。
- Transition videoは5本、合計`43,818,118 bytes`（約43.8 MB）。
- 各videoは1600×900、24 CFR、193 frames、約8.041667秒、H.264 High、
  yuv420p、audioなし。
- 各videoは25 keyframes、約0.333秒間隔（GOP 8）。
- Stillは6 WebP、合計`1,480,408 bytes`（約1.48 MB）。

短GOP自体はWeb Scrubbingに適した選択であり、L∞P Phase 01.5のGOP 12方針と
整合する。一方、全videoの圧縮payloadだけで43.8 MBあり、Blob、decoder、GPU
surfaceを加えた実メモリは大幅に増える。

## Core Engine

### Scene and clip definition

`TeaJourney.tsx:5-62`は6 Sceneと5 clipを別配列で定義する。

```text
Origin → Harvest → Air → Fire → Passage → Cup
   clip 1     clip 2   clip 3   clip 4      clip 5
```

各Sceneは`label / kicker / title / body / note / still`を持つ。これはendpointを
Scene、endpoint間の移動をclipとして扱うnode/edge modelであり、L∞Pの
`FIELD / ORDER / DESIGN / BUILD / ADOPT / RETURN`に適している。

ただし、`scenes.length === clips.length + 1`は暗黙の前提で、型やruntime assertion
がない。L∞PではSceneとClipを型付きconfigへ分離し、この不変条件を検証する。

### Runtime lifecycle

Referenceはmount時に次を同じeffect内で開始する。

1. Reduced Motionを一度だけ読む。
2. 通常motionなら5 clipを並列fetchし、Blob URLをvideoへ設定する。
3. scroll/resize listenerを登録する。
4. 全5 videoを走査するRAFを開始する。
5. unmount時にlistener、RAF、作成済みBlob URLをcleanupする。

構造は小さいが、loading、timeline、video controller、UI stateが一つのeffectへ
密結合している。L∞Pでは純粋なtimeline関数とmedia lifecycleを分離する。

## Scroll Timeline

### Reference algorithm

`TeaJourney.tsx:102-115`はdocument全体のprogressを5 clipへ分割する。

```ts
progress = clamp(scrollY / (documentHeight - viewportHeight))
exact = progress * clipCount
segment = min(clipCount - 1, floor(exact))
local = segment === lastSegment ? clamp(exact - segment) : exact - segment
```

5 clipの場合、segment境界はglobal `0 / 20 / 40 / 60 / 80 / 100%`である。
`Math.round(exact)`でactive Sceneを選ぶため、copyの切替は各clip中央で起きる。

`650vh`のtrackから1 viewportを引いたscrollable distanceは約550vhで、1 clipあたり
約110vhになる。この尺は再利用できるが、clip数から計算すべきであり、650という
magic numberへ固定しない。

### Strengths

- Forward、reverse、rail jumpが同じ正規化timelineを使う。
- clip数からactive segmentとsegment-local progressを決定できる。
- `activeRef`によりScene境界を越えた時だけReact stateを更新する。
- endpoint Sceneとtransition clipの関係が明快である。

### Problems for L∞P

- `document.documentElement.scrollHeight`を使うため、後続のWhat We Do、Services、
  FAQ等を追加すると、それらまでScrollytelling progressへ含まれる。
- Rail jumpもdocument全体のmaxScrollへ依存する。
- `.journey-shell { position: fixed }`はtrack終端で解放されず、通常ページを覆う。

### Recommended section-local timeline

Phase 01の`calculateScrollProgress()`を維持し、Scrollytelling sectionの開始位置と
有効距離だけを正規化する。

```text
sectionProgress
  = clamp((scrollY - sectionTop) / (sectionHeight - viewportHeight), 0, 1)

exact         = sectionProgress × clipCount
clipIndex     = min(clipCount - 1, floor(exact))
localProgress = sectionProgress === 1 ? 1 : exact - clipIndex
activeScene   = independently derived from copy switch policy
```

`sectionTop`は配置に依存しないよう、geometry refresh時に
`getBoundingClientRect().top + scrollY`から取得する。`ResizeObserver`、resize、
orientation change時だけ再計測し、毎frame layout readしない。

## Video Architecture

### Multi-video target system

Referenceは各clipへ次のtargetを割り当てる（`TeaJourney.tsx:111-115`）。

```text
past clip    → 1
current clip → localProgress
future clip  → 0
```

このtarget vectorはdeterministicで、reverse scrollやScene jumpでも状態を復元しやすい。
過去clipは終端、未来clipは開始地点へ準備されるため、通常速度の境界通過は自然になる。

欠点は、全5 videoを毎RAFで走査し、非表示videoまでseekすることである。rapid jump時は
複数decoderへ同時seekを投入し、mobileで負荷が大きい。L∞Pではtarget semanticsだけを
採用し、実制御はactive/adjacentへ限定する。

### Recommended controller policy

- active clipは毎frameのsmoothing/seek対象。
- crossfade相手だけを同時に表示・seek可能にする。
- previous/current/next以外はposter-onlyまたはsrc未接続にする。
- segment変更時、過去/未来clipのendpointは一度だけparkする。
- `video.seeking`中は新規seekを連打せず、latest targetだけをpendingとして保持する。
- `seeked`後にpending targetが閾値外なら最新値だけを適用する。
- per-clip metadata、duration、ready、errorを独立管理する。

Referenceの`video.seeking` guardと`0.998 × duration`上限は有用だが、急速入力中に
古いseekへ固定されないようlatest-target coalescingを追加する。

## Transition Architecture

### Reference crossfade

`TeaJourney.tsx:117-124`は各segment終端10%をtransition zoneとする。

```text
fade = clamp((localProgress - 0.9) / 0.1)
current clip opacity = 1 - fade
next clip opacity    = fade
```

次clipはfuture target `0`に置かれているため、「現clip終端」と「次clip開始frame」を
crossfadeする。最終clipでは次videoがなく、active Scene posterへfade outする。

### Evaluation

有用な点：

- Seedance/Genspark動画間の軽い色、露出、構図差を吸収できる。
- Forward/reverseで同じprogress-derived opacityを使える。
- React stateやtime-based animationへ依存しない。

注意点：

- Crossfadeは大きなカメラ位置差を隠せず、double exposureを強めることがある。
- Referenceはraw scrollでopacity、smoothed timeでframeを更新するため、rapid scrub時に
  opacityと映像frameの準備がずれる可能性がある。
- next clipがstart frameへ戻り切っていない場合、途中frameをfade-inし得る。

L∞Pでは`blendStart`をclipごとに設定可能にし、初期値を`0.90`とする。opacityは
timeline progressから`smoothstep`等で算出し、独立したCSS transitionは付けない。
next clipが未readyなら、destination stillへfadeし、黒画面やstale frameを出さない。
最重要なのは生成時に`clip end ≒ destination still ≒ next clip start`を揃えること
であり、crossfadeをasset continuityの代替にはしない。

## Preload Architecture

### Reference fetch/Blob implementation

`TeaJourney.tsx:75-100`は全5 clipを`Promise.all`でfetchし、完全なBlobへ変換後、
`URL.createObjectURL()`を`video.src`へ設定する。

利点：

- download後はnetwork range latencyの影響を受けにくい。
- 完全取得済みclipをローカルobject URLとして扱える。

問題：

- 初期に43.8 MBを全取得する。
- JSXの`preload="auto" / "metadata"`より先にfull fetchするため、選択的preloadに
  ならない。
- Blob payload、browser cache、decoder、full-screen GPU surfaceのメモリが重なる。
- `Promise.all`の1本失敗後も他fetchは継続し、`catch`でも`ready=true`になる。
- AbortControllerがなく、unmount後に完了したfetchがBlob URLを作るとleakし得る。
- Mobile Safariのmemory pressureとinitial waitに不利である。

### Strategy comparison

| Strategy | Strength | Risk | L∞P decision |
|---|---|---|---|
| Direct `src` | HTTP Range、browser cache、単純 | preloadはbrowser hint | **Default** |
| `preload="metadata"` | duration/track情報を小さく取得 | 次frameは未buffer | 全clipの基本値 |
| Adjacent `preload="auto"` | 境界前にbuffer可能 | browserが全取得する場合あり | current/neighborのみ |
| `fetch + Blob` | 完全取得後のlocal seek | full download、memory、abort管理 | 不採用 |
| IntersectionObserver | section接近/離脱を検知 | Scene内部位置は別途必要 | RAF/source lifecycleに採用 |
| Timeline threshold lazy load | 方向を含む先読み | controller設計が必要 | adjacent preloadに採用 |

### Recommended loading state machine

1. SSR/hydrationはFIELD stillまたはvisual fallbackを表示する。
2. Motion preference判定前はvideo `src`を接続しない。
3. Sectionがpreload marginへ入ったら、first clipへdirect URLを接続する。
4. 基本は`preload="metadata"`。
5. current clipと進行方向neighborだけを実buffer対象に昇格する。
6. `localProgress ≈ 0.65`でnext、reverse開始時はpreviousを準備する。
7. Rail jump時はdestination clipとneighborを先に接続し、readyまではstillを表示する。
8. 遠いclipはpause、`removeAttribute("src")`、`load()`でdecoder解放を促す。
9. Errorはclip単位でstill fallbackし、Journey全体を偽のreadyにしない。

Suggested attached-source budget：

- Desktop: previous/current/next、最大3。
- Mobile: current + direction neighbor、最大2。

Phase 01.5で確認したH.264、yuv420p、Fast Start、audioなし、GOP 6–12、Range配信を
維持する。現在の`field-v01.mp4`を5本分保持しても圧縮payloadだけで約24.3 MBに
なるため、全Blob化は不要である。

## Poster Architecture

Referenceは二重fallbackを持つ。

- Stage背面にactive Scene stillを置く。
- 各videoにもfrom Scene stillを`poster`として渡す。

これは次の用途に有効である。

- first paint / perceived performance
- video metadata/decoder待ち
- clip単位のload error
- Reduced Motion
- mobile memory fallback
- stable visual surfaceとlayout shift防止
- OGPとは別だが、検索/共有用画像設計の基礎

L∞Pでも各Sceneにstillを持たせる。First stillは高優先度、遠いstillはlazyとし、
Desktop/portraitで必要ならart directionを用意する。stillはdecorative mediaとして
扱い、情報はcopy layerへ置く。

```text
FIELD  field.webp  + provisional field-v01.mp4
ORDER  order.webp  + order-to-design.mp4
DESIGN design.webp + design-to-build.mp4
BUILD  build.webp  + build-to-adopt.mp4
ADOPT  adopt.webp  + adopt-to-return.mp4
RETURN return.webp
```

上記名称はarchitecture上の例であり、存在しないpathを先に実装して404を発生させない。
現在のFIELD動画は最初の実assetとして維持するが、最終的に
`FIELD → ORDER`のtransitionとして成立するかはend frameを確認して確定する。

## UI Layers

Referenceの視覚stackは概ね次の通りである。

```text
bounded viewport shell
├─ still / video stage
├─ readability shade
├─ scene copy
├─ top/meta chrome
├─ scene rail
└─ progress/footer
```

映像、shade、copy、navigationの責務分離は採用する。ただしReferenceのnegative
z-index階層は壊れやすいため、L∞Pではcomponent内の`isolation:isolate`と正方向の
明示的z-indexを使う。

### Text layer

Scene configに`kicker / title / body / note`のslotを用意する。ただし本Phaseで
本番コピーを確定しない。React state更新はactive Sceneが変わる時だけにし、
opacity/transformはCSS classで切り替える。

### Navigation Rail

ReferenceのRailは`aria-label`と`aria-current="step"`を持ち、Scene endpointへの
jumpという情報構造は良い。L∞Pでは次の修正が必要である。

- Jump targetはsection-local absolute positionにする。
- Reduced Motion時は`behavior: "auto"`にする。
- Desktopはlabel付きRailを候補とする。
- Mobileはcompact counterまたはhorizontal dotsへ簡略化する。
- Touch targetを最低44×44px相当にする。
- `:focus-visible`を明示する。
- visual clutterが強い場合でもDOM順とkeyboard操作を維持する。

### Progress UI

Referenceはrootの`--journey-progress`を書き、CSS `scaleX()`を更新する。Reactを
毎frame再renderしない考え方は採用するが、global rootへ値を残さない。

```text
journeySection.style.setProperty("--loop-progress", normalizedProgress)
```

Progressとblend用CSS VariableはJourney rootへscopeし、unmountで自然に消える。
React stateはactive Scene、ready/error等の離散値だけに使う。

## Performance

### Reference strengths

- passive scroll listener
- active Scene変更時だけReact state更新
- 12ms以下のcurrentTime差をskip
- `video.seeking`中の追撃を抑制
- transform/opacity中心のProgress/Crossfade

### Reference risks

- scroll eventごとにtarget配列を再生成する。
- 常時RAFで全5 videoを走査する。
- hidden videoもseekする。
- 5 full-screen videoへpermanent `will-change`とfilterを適用する。
- section外、収束後、Reduced Motion時もRAFが継続する。
- full Blob loadingによりnetwork/memory budgetを制御できない。

### L∞P performance policy

- smoothingは`0.15`を維持する。Referenceの`0.16`へ変更する理由はない。
- Section外、document hidden、Reduced Motion時はRAFを停止する。
- RAFはtarget変更時に開始し、active seekが収束したら休止可能にする。
- Active clipだけを連続seekし、neighborは境界準備時に限定する。
- Scroll readを一つのframeへcoalesceする。
- Geometry readとstyle writeを分離する。
- `will-change`はcrossfade対象2層だけに一時適用する。
- React debug updateはdevelopmentのみ、現在の80ms throttleを維持できる。
- Per-clip ready/error/durationとattached source数をDebugへ追加する。

## Mobile

Referenceは760px breakpointでcopyを下部へ移し、label/progressを隠すが、次が不足する。

- safe-area inset
- `svh/dvh`
- short landscape viewport
- orientation/address bar変化
- coarse pointer touch target
- per-scene focal point
- mobile decoder/memory budget

L∞P mobile方針：

- H.264/yuv420p/Fast Start/Range/short GOPを維持する。
- Attached sourceを最大2へ抑える。
- 将来の720p `mobileSrc`をconfigで許容するが、UA sniffはしない。
- `position: sticky; top: 0; height: 100svh`を基準にする。
- safe-area insetとorientation changeを処理する。
- `object-fit: cover`とScene別focal pointを使う。
- Phase 01 Labのportrait `contain`規則はproductionへそのまま移さない。
- posterを常に背面へ保持し、decoder release時も黒画面にしない。
- Mobile Safari実機でreverse、rapid jump、orientation、background復帰、memory pressureを
  production gateとして確認する。

## Accessibility

### Reference positives

- video/stillをdecorative mediaとして`aria-hidden`にする。
- Railへ個別`aria-label`と`aria-current`を付ける。
- inactive copyへ`aria-hidden`を設定する。
- Reduced Motion時にvideo fetchを回避する。

### Reference issues

- Reduced Motion判定は初回のみで、OS設定変更をlistenしない。
- Reduced MotionでもRAF、copy transition、smooth rail scrollが残る。
- 18×18pxのRail buttonはtouch targetとして小さい。
- 明示的なfocus-visible styleがない。
- inactive final Sceneのrestart buttonが`aria-hidden`祖先内でもfocus可能になり得る。
- ScrollでSceneが変わるたびにannouncementする設計はないが、逆に全情報をscrollだけに
  依存させるとReduced Motion/static利用者へ届きにくい。

### Recommended behavior

- Phase 01のlive `matchMedia` listenerを維持する。
- Reduced Motion判定前はvideo sourceを接続しない。
- Reduceへ切替時はRAF停止、video pause/release、smooth scroll/transition無効化。
- 6 Sceneをstill + copyの通常document flowとして読めるfallbackにする。
- Scene scroll中に`aria-live`を使わず、過剰announcementを避ける。
- Hidden copy内にfocusable controlを残さず、conditional render、`inert`、tabIndex制御を
  用いる。
- Page本体が単一`<main>`を所有し、Journeyはlabelled `<section>`にする。

## Reduced Motion

Referenceはvideo fetchを停止しCSSでfilmを隠すが、RAFは起動したままであり、runtime
preference changeにも追従しない。L∞P Phase 01の方がcontroller lifecycleは堅牢である。

Hybrid実装では次を採用する。

```text
preference unknown → stillのみ、srcなし
reduce             → still/copy flow、RAFなし、smooth scrollなし
no-preference      → section接近時にactive/adjacent src接続
runtime change     → media windowとRAFを即時再構成
```

## License

### Inspection result

**NO LICENSE FOUND / downstream permissions not granted.**

- HEAD treeに`LICENSE`、`LICENCE`、`COPYING`、`NOTICE`、`COPYRIGHT`なし。
- `package.json`に`license` fieldなし。`private: true`は利用許諾ではない。
- READMEにLicense節、SPDX、利用許諾文なし。
- GitHub公式repository metadataのlicense欄も未設定。
- `public/media`にlicense、credit、provenance sidecarなし。

公開GitHub repositoryであることは、一般的な複製、改変、商用利用、再配布の許可を
意味しない。外部の権利許諾がない限り、具体的なsource code、CSS、copy、WebP、MP4、
OG image、SVGをL∞Pへ転用しない。Attributionだけでは許諾の代わりにならない。

GitHub公式ドキュメントも、licenseがなければdefault copyright lawが適用され、
GitHub上での閲覧・forkを超える複製、配布、派生物作成の一般許諾にはならないと説明
している：<https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository>

許容範囲は、Architecture、Algorithm、Design Pattern、Behaviorを観察し、異なる
命名、構造、code、copy、assetで独立実装することに限定する。直接転用が必要なら、
権利者からcodeとmediaを区別した書面許可、または明示的LICENSE追加を得る。

米国著作権局は、具体的な表現と、idea・procedure・method・system・process・conceptを
区別している：<https://www.copyright.gov/what-is-copyright/>。本提案はこの区別に従い、
具体的表現を複製せず、機能要件と設計原則から独立実装する。

依存packageがMIT/Apache等であっても、repository固有codeとassetへそのlicenseは
伝播しない。これは法的助言ではなく、商用公開時の最終判断は必要に応じ専門家へ確認する。

## Comparison Matrix

| Feature | L∞P Phase 01 | Tea Leaf Reference | Recommended L∞P v3 | Reason |
|---|---|---|---|---|
| Scroll calculation | Section-relative pure helper | Whole-document progress | Section-relative progressを維持 | Corporate sectionsへ自然に接続 |
| Scene timeline | なし、single interval | Global→segment→local | Pure `timeline.ts`として採用 | Scene/clipをdeterministicに制御 |
| Video loading | Direct src + metadata | 全clip fetch + Blob | Direct src + adjacent preload | Range/cache維持、memory抑制 |
| Scrub smoothing | `0.15` | `0.16` | `0.15`維持 | 体感差が小さく変更理由なし |
| Duration handling | Events + mount recovery + ref | RAF内finite check | Phase 01方式をper-clip化 | Event取りこぼしと0秒問題に強い |
| Seek scheduling | Threshold付き毎RAF assignment | Threshold + seeking guard | Threshold + latest-target coalescing | Rapid inputでseek queueを抑える |
| Poster fallback | Hookあり、実poster未設定 | Scene still + video poster | Sceneごとのpermanent still | Loading/error/reduceを一貫表示 |
| Scene transition | なし | 6 Scene / 5 clips | 採用 | L∞P LOOP grammarに合う |
| Crossfade | なし | 各segment終端10% | Configurable adjacent blend | AI動画差を緩和、reverse対称 |
| Reduced Motion | Runtime listener、RAF停止 | Initial check、fetch停止、RAF継続 | Phase 01 lifecycle + static scenes | より堅牢で情報も失わない |
| Mobile | Single video、portrait contain | Full Blob、cover、一律focal | 2 sources、poster、per-scene focal | Safari memory/crop対策 |
| Navigation | なし | Right rail、whole-page jump | Desktop rail / mobile compact | 探索性とclutterを両立 |
| Progress UI | React Debug metrics | Root CSS variable | Scoped `--loop-progress` | React rerenderとglobal汚染を削減 |
| Memory | 1 video | 5 Blob + 5 video layers | Attached 2 mobile / 3 desktop | Decoder/GPU pressureを制限 |
| Performance | 1 RAF、1 video、常時 | 1 RAF、5 video、常時 | Visible/active時だけ、収束後休止 | CPU、seek、batteryを削減 |
| Backward scroll | 実証済みsingle video | Target vectorで全clip復元 | Target semantics + bounded media window | Reverseとmemoryを両立 |
| Scene jump | なし | Whole-page smooth scroll | Section-local jump + destination preload | 後続contentを壊さない |
| Error handling | Text placeholder | ErrorでもJourney ready | Clip単位poster fallback + error state | Failureを隠さず部分劣化 |
| Text layer | なし | Scene config + active copy | Slotのみ定義、copyは後で承認 | Architectureとbrand writingを分離 |
| Testing | Manual browser + build checks | Starter testのみ、Journey testなし | Pure timeline unit + browser integration | Boundary/reverse regressionを自動化 |
| GOP | Optimized GOP 12 | GOP 8 | 6–12をassetごとに維持 | Mobile random seekに適合 |

## Phase 01 Comparison

### Keep from Phase 01

- `lib/motion/scrollProgress.ts`のsection-local pure calculation
- `loadedmetadata / durationchange / loadeddata / canplay`によるduration sync
- Mount後の`HAVE_METADATA` recovery
- finite positive duration validation
- smoothing `0.15`
- seek threshold
- Runtime Reduced Motion listenerとRAF cleanup
- Development-only Debug UIと80ms throttle
- Forward/reverse browser validation knowledge
- H.264/GOP/Range/metadataのasset optimization knowledge

### Add from the Reference as independently implemented patterns

- Scene endpointsとtransition clipsのnode/edge model
- Global-to-segment-to-local timeline
- past/current/future target semantics
- Scene poster/still architecture
- adjacent crossfade
- Scene Rail endpoint mapping
- CSS Variable progress
- media / shade / copy / chromeのlayer separation

### Redesign rather than copy

- full-page fixed → bounded sticky section
- whole-document progress → section-local progress
- all-video RAF → active/adjacent controller
- all-Blob preload → direct URL selective preload
- root CSS variable → component-scoped variable
- parallel unvalidated arrays → typed config + invariant check
- initial-only Reduced Motion → live lifecycle policy

## Recommended Architecture

### Minimal file structure

```text
components/
└─ scrollytelling/
   ├─ LoopJourney.tsx
   ├─ JourneyStage.tsx
   ├─ JourneyOverlay.tsx
   ├─ JourneyDebug.tsx
   ├─ useJourneyEngine.ts
   └─ loop-journey.module.css

lib/
└─ scrollytelling/
   ├─ scene-config.ts
   └─ timeline.ts
```

`SceneCopy / SceneRail / JourneyProgress`は当初`JourneyOverlay`内の小さなpresentational
partsでよい。独立したaccessibility責務やtestが必要になった時だけfile分割する。
過度なcomponent化を避ける。

### Responsibilities

`LoopJourney.tsx`

- labelled Scrollytelling `<section>`を所有
- section geometry、IntersectionObserver、active Scene state
- scoped `--loop-progress`
- Stage、Overlay、Debugのcomposition
- サイト全体の`<main>`は所有しない

`JourneyStage.tsx`

- permanent still base
- 最大2 visible video layers
- video refs、poster、opacity、error fallbackのview

`JourneyOverlay.tsx`

- placeholder-capable copy slots
- Desktop Rail / mobile counter
- progress、Scene count
- focus/aria behavior

`useJourneyEngine.ts`

- Phase 01 metadata recoveryのmulti-clip化
- direct source attachment window
- RAF lifecycle、smoothing、seek coalescing
- Reduced Motion runtime changes
- active/adjacent controller

`JourneyDebug.tsx`

- development-only
- section/global progress、clip/local、target/current/duration、ready/error、
  attached source count、motion、viewport

`scene-config.ts`

- 6 Scene / 5 Clipのtyped config
- copy fieldsはoptional/placeholder
- `clips.length === scenes.length - 1` validation

`timeline.ts`

- pure section progress → clip/local/active Scene/blend
- rail target calculation
- boundary/reverse test対象

### Proposed data model

```ts
type SceneId = "field" | "order" | "design" | "build" | "adopt" | "return";

type JourneyScene = {
  id: SceneId;
  label: string;
  still: string | null;
  focalPoint?: string;
  copy?: {
    kicker?: string;
    title?: string;
    body?: string;
    note?: string;
  };
};

type JourneyClip = {
  id: string;
  from: SceneId;
  to: SceneId;
  src: string | null;
  mobileSrc?: string;
  blendStart?: number;
};
```

Clip pathが未確定なら`null`とし、架空pathを作って404を出さない。`FIELD`以外の
本番copyやassetをこのPhaseで確定しない。

### Bounded page structure

```text
Navigation

<main>
  <LoopJourney />       # relative track
    sticky stage        # section内だけ100svhに固定

  Normal page bridge
  What We Do
  Services
  AI / DX
  Case Studies
  Process
  Pricing
  FAQ
  Contact
</main>

Footer
```

Journey stageは`position: sticky`でsection終端に達した時点で自然にunpinし、通常pageへ
接続する。Referenceのfull-page fixed shellは使わない。

## Video Strategy

6 Scene / 5 transition clip方式を長期architectureとして採用する。

```text
FIELD  → clip 1 → ORDER
ORDER  → clip 2 → DESIGN
DESIGN → clip 3 → BUILD
BUILD  → clip 4 → ADOPT
ADOPT  → clip 5 → RETURN
```

この方式は「状態」をstill/Scene、「変化」をvideo/Clipへ分離でき、L∞Pの循環思想と
整合する。Scene数とclip数の関係も明快で、RailはScene endpoint、scrollはclip edgeを
操作する。

現在の`public/video/field-v01.mp4`は最初の実動画として維持する。Phase 02ではclip 1の
provisional assetとして使えるが、FIELDからORDERへ意味的・視覚的に接続する最終映像かは
別途asset reviewで決める。残り4 clipは`null` + still placeholderでengineを検証する。

## Loading Strategy

**Direct URL + Range + selective adjacent preload**を採用する。

Blob方式は使用しない。初期表示はFIELD still、section接近時にfirst clip metadata、
進行方向に応じてneighborを準備する。Mobileは最大2、Desktopは最大3 sourceへ制限し、
遠いdecoderを解放する。

## Transition Strategy

- Default blend zone: segment終端10%
- Per-clip `blendStart`で調整可能
- Progress-derived reversible opacity
- Current/nextの最大2 video layer
- Next未ready時はdestination stillへfade
- Final clipはRETURN stillへfade
- Copy switch timingはmedia crossfadeから独立
- Asset生成では境界frame matchingを優先

## Mobile Strategy

- Short GOP、H.264、yuv420p、Fast Start、no audio、Range
- 最大2 attached source
- safe area、svh/dvh、orientation remeasure
- Scene別focal point、将来の720p mobile source slot
- compact navigationと44px touch target
- still-first fallback
- Mobile Safari実機testをproduction gate化

## Performance Strategy

- RAFはsection visibleかつmotion allowedかつ未収束時のみ
- Active clipのseekを最優先
- Latest target coalescing
- Scoped CSS variables
- React stateは離散Scene/ready/errorだけ
- Geometry cache + ResizeObserver
- Crossfade対象だけ`will-change`
- Attached sources / decoder budgetをDebug表示
- Timeline boundary、reverse、rapid jumpをunit/browser test化

## Most Valuable Patterns

1. 6 Scene / 5 transition clipのnode/edge model
2. Section progress → segment → local progress
3. Past/current/future target semantics
4. Endpoint still + clip posterのfallback
5. Adjacent clip crossfade
6. Active SceneだけReact state更新
7. Scoped CSS VariableによるProgress UI
8. Scene endpoint Rail
9. Media / shade / copy / chromeのlayer separation

## Patterns To Reject

1. 全5 clipの一括fetch + Blob
2. Whole-document progress
3. Site全体を覆うfixed shell
4. 全5 videoへの常時RAF/seek
5. Errorでも`ready=true`
6. Reduced Motion時も継続するRAF/transition/smooth scroll
7. Rootへ残るglobal CSS progress variable
8. 5 full-screen layerへのpermanent `will-change`/filter
9. 未検証parallel arrays
10. Tea固有copy、color、icon、media、auth、DB、hosting config

## Files To Change in the Next Phase

Architecture承認後、次Phaseで追加予定：

```text
components/scrollytelling/LoopJourney.tsx
components/scrollytelling/JourneyStage.tsx
components/scrollytelling/JourneyOverlay.tsx
components/scrollytelling/JourneyDebug.tsx
components/scrollytelling/useJourneyEngine.ts
components/scrollytelling/loop-journey.module.css
lib/scrollytelling/scene-config.ts
lib/scrollytelling/timeline.ts
```

次Phaseで限定変更予定：

```text
app/page.tsx                 # pageがmainを所有し、LoopJourneyと通常page接続点を配置
app/layout.tsx               # Lab-only metadataを外す段階だけ
app/globals.css              # Journey固有styleは追加せず、global primitiveのみ
```

維持：

```text
public/video/field-v01.mp4
lib/motion/scrollProgress.ts
components/experiments/scroll-video/*  # regression labとして一時維持
```

## Next-phase Acceptance Gates

1. Pure timeline tests: 0、各20%境界、1、reverse、rapid jump。
2. `scenes = clips + 1` invariant failureを明示。
3. FIELD clipで0/25/50/75/100、reverseを再確認。
4. Missing clipは404を発生させずstillへfallback。
5. Section終了後にsticky stageがunpinし、通常contentへ到達可能。
6. Reduced Motionでvideo request/RAF/transition/smooth jumpが停止。
7. Desktop attached source ≤3、mobile ≤2。
8. Console error、hydration error、repeated requestなし。
9. Range 206、duration recovery、GOP特性維持。
10. Rail keyboard/focus/touch targetを確認。
11. Mobile Safariでreverse、rapid scrub、orientation、background復帰を確認。

## Final Recommendation

```text
C — ReferenceとPhase 01をHybrid統合
```

ReferenceはScene grammarとvisual layeringが優れている。一方、L∞P Phase 01は
section境界、duration recovery、Reduced Motion lifecycle、tested reverse control、
GOP/Range knowledgeで優れている。全面置換すると、Corporate Websiteへの接続、mobile
memory、license、error handlingの各面で後退する。

したがって、Referenceの**振る舞いと設計パターンだけを独立実装**し、Phase 01の
controller基盤へScene Timelineを追加するHybridが、最も単純で保守性が高く、
L∞P専用Architectureとして妥当である。
