# Промпт для генерации страницы-кейса в Claude Code

Этот файл — готовый промпт. Отредактируйте раздел **ПАРАМЕТРЫ** под свой кейс
(текст, цвета, картинки, какие блоки включить), затем **скопируйте весь файл целиком**
и отправьте в десктоп-версию Claude Code. На выходе получите один самодостаточный
HTML-файл — такой же, как из визуального генератора.

---

## ЗАДАЧА (не менять)

Сгенерируй **один самодостаточный HTML-файл** `case-page.html` со страницей-кейсом.
Жёсткие требования:

1. Всё в одном файле: разметка, `<style>`, `<script>`, изображения (как `data:`-URL, base64). Никаких внешних файлов, кроме Google Fonts.
2. Ванильные HTML/CSS/JS, без фреймворков.
3. Используй **ровно** `<head>`, CSS и два `<script>` из раздела «ШАБЛОН (не менять)» ниже — это фиксированный дизайн по макету. Меняется только контент из «ПАРАМЕТРЫ» и значения 5 цветов в `:root`.
4. Блоки идут строго в порядке: hero → client → goals → tasks → creatives → tools → channels → audience → strategy → results → form → cases. Блок с `enabled: false` **полностью пропускается** (его HTML не выводится).
5. В пользовательском тексте поддержи **жирный**: `**текст**` → `<strong>текст</strong>`. Переносы строк → `<br>`. Экранируй `& < > "`.
6. Каждой секции добавляй класс `reveal` (анимация появления уже в CSS+JS).
7. Картинки, если их дают как путь/URL, **встрой в base64** (`data:image/...;base64,...`). Если картинки нет — используй заглушку, указанную в шаблоне блока.

---

## ИЗОБРАЖЕНИЯ — как задавать

Картинки есть в полях: `hero.image`, `creatives.images`, `results.quoteAvatar`,
`cases[].image`. Указать картинку можно двумя способами:

1. **Ссылкой (URL)** — самый простой:
   `image: https://site.com/photo.jpg`
   В HTML она подставится в `src="..."` (для `<img>`) или в
   `style="background-image:url('...')"` (для фонов hero/кейса).
   Минус: файл будет зависеть от того, что картинка доступна в интернете.

2. **base64 data-URL** — чтобы файл был полностью самодостаточным (картинка внутри):
   `image: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ... (длинная строка)`
   Где взять строку: любой конвертер «image to base64» (например base64-image.de),
   либо команда в терминале — `base64 -w0 photo.jpg` (Linux/Mac) /
   `[Convert]::ToBase64String([IO.File]::ReadAllBytes("photo.jpg"))` (PowerShell).

> Важно: просто **прикрепить картинку в чат недостаточно** для встраивания — Claude её
> «увидит», но не сможет точно воспроизвести её байты в base64. Для вставки картинки в
> файл давай **URL** или **готовую base64-строку**. Если поле картинки пустое — выводится
> заглушка из шаблона.
>
> Самый удобный способ со множеством картинок — собрать текст промптом, а изображения
> добавить во **визуальном генераторе** (`index.html`): drag&drop там сам кодирует их в base64.

---

## ПАРАМЕТРЫ (редактировать под свой кейс)

### Цвета (5 шт.) — подставляются в `:root`
```
c1 (контрастный 1, текст)  = #141414
c2 (контрастный 2, фон)    = #F8F9FF
a1 (акцент 1)              = #F93790
a2 (акцент 2)              = #4E929A
a3 (акцент 3)              = #99D9FC
```

### Hero (обложка) — enabled: true
```
image: (нет — фон будет цветом a2; или путь к картинке)
clientLogo: VERTICAL
tag: Недвижимость
title: Как увеличить количество конверсий в недвижимости вдвое
subtitle: Как увеличить количество конверсий в недвижимости вдвое
stats:
  - value: х3,5   | label: выросло число целевых заявок
  - value: 45%    | label: выросло число целевых заявок
  - value: 4,8ML  | label: выросло число
```

### Клиент — enabled: true
```
title: Клиент
text: B2B-услуги в недвижимости (инвестиционные объекты)
```

### Цели — enabled: true
```
title: Цели
bulletColor: #4760F7
items:
  - Детальное отслеживание пути пользователя от первого контакта до конверсии
  - Рост числа целевых заявок при сохранении стоимости лида
  - Привлечение платёжеспособной аудитории инвесторов
```

### Задачи кампании — enabled: true
```
title: Задачи рекламной кампании
bulletColor: #4760F7
items:
  - Настроить сквозную аналитику от показа до сделки
  - Сегментировать аудиторию и протестировать гипотезы
  - Оптимизировать кампанию под целевое действие
```

### Креативы — enabled: true
```
title: Креативы
images: []        # массив путей/URL; пусто = одна заглушка. Можно несколько.
```

### Инструменты — enabled: true
```
title: Инструменты
chips: [Semantica 360, Hybrid Places, Hybrid Segments, Smart Bid]
highlights:
  - label: Период | value: 13.09.24 – 31.12.24
  - label: Гео    | value: Миллионники + нефтяники
```

### Каналы / Форматы — enabled: true
```
channelsTitle: Каналы
channels: [Desktop web, TV, In-app, Mobile web]
formatsTitle: Форматы
formats: [Banner Ads, Native Ads, Smart TV, Video Ads]
note: РК была запущена рекламным агентством Internet Active с помощью Hybrid Platform по модели Self-service.
noteColor: #F8F9FF
```

### Целевая аудитория — enabled: true
```
title: Целевая аудитория
text: Мы разделили аудиторию на сегменты и применили SmartBid-оптимизацию для ретаргетинга, чтобы выявить самых релевантных пользователей и приблизиться к идеальной модели покупателя.
chips: [Hybrid Segments, Аудиторные сегменты, Hybrid Places]
```

### Стратегия — enabled: true
```
title: Стратегия
paragraphs:
  - В течение трёх месяцев мы проводили эксперимент: разделили аудиторию на несколько сегментов и применили SmartBid-оптимизацию для ретаргетинга.
  - Наша команда обучала ML-модель, способную прогнозировать конверсии, и каждый день приближалась к идеальной модели, которая точно понимала, кто из аудитории совершит нужное действие.
items:
  - Сегментация аудитории и тестирование гипотез
  - SmartBid-оптимизация под целевое действие
```

### Результаты — enabled: true
```
title: Результаты
bulletColor: #4760F7
paragraphs:
  - За три месяца мы не просто увеличили количество заявок, но и привлекли действительно заинтересованную аудиторию, что напрямую повлияло на успешность продаж инвестиционных объектов.
items:
  - Детальное отслеживание пути пользователя от первого контакта до конверсии
  - Снижение стоимости целевого действия при росте объёма
  - Рост доли платёжеспособной аудитории
metrics:                       # 3 карточки
  - label: Reach  | value: 5 562 241
  - label: CTR    | value: 1.08%
  - label: Clicks | value: 127 140
bannersTitle: Баннеры
bannerMetrics:
  - label: CTR    | value: 1.08%
  - label: Clicks | value: 127 140
  - label: Reach  | value: 5 562 241
quoteText: |                   # абзацы разделяй пустой строкой
  Результаты действительно впечатляют! Мы не просто увеличили количество заявок, но и смогли привлечь действительно заинтересованную аудиторию, что напрямую влияет на успешность продаж инвестиционных объектов.

  SmartBid-оптимизация и тщательная работа с аудиториями позволили нам исключить нерелевантные сегменты и сфокусироваться на тех, кто демонстрирует наибольшую заинтересованность.
quoteAuthor: Александр Пестряков
quoteRole: директор по маркетингу апарт-отелей Vertical
quoteAvatar: (нет — будет пустой кружок; или путь к фото)
```

### Форма — enabled: true
```
title: Хотите так же?
subtitle: Оставьте заявку — расскажем, как достичь подобных результатов в вашей нише.
button: Отправить заявку
```

### Кейсы — enabled: true  (слайдер; стрелки появляются, если кейсов больше, чем влезает)
```
title: Кейсы
cards:
  - tag: FMCG | color: #F93790 | tagText: #F8F9FF
    image: (нет — будет градиент; или путь)
    title: +15% к Brand Awareness и X2 конверсий в корзину
    metrics: [ {value: X3,5, label: выросло число целевых заявок},
               {value: 45%,  label: выросло число целевых заявок},
               {value: 4,8ML,label: выросло число} ]
    button: Посмотреть подробнее | url: #
  - tag: Финансы | color: #1467C9 | tagText: #F8F9FF
    image: (нет)
    title: Как увеличить количество конверсий в недвижимости вдвое
    metrics: [ {value: X3,5, label: выросло число целевых заявок},
               {value: 45%,  label: выросло число целевых заявок},
               {value: 4,8ML,label: выросло число} ]
    button: Посмотреть подробнее | url: #
```

---

## ШАБЛОН (не менять)

### Каркас документа
```html
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{hero.title или "Кейс"}}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>/* CSS из блока ниже, c подставленными 5 цветами в :root */</style>
</head>
<body>
<!-- секции включённых блоков по порядку -->
<!-- затем оба <script> -->
</body>
</html>
```

### CSS (вставить целиком в `<style>`, заменив значения 5 переменных в :root)
```css
:root{
  --c1:#141414;--c2:#F8F9FF;--a1:#F93790;--a2:#4E929A;--a3:#99D9FC;
  --muted:#787A81;
  --maxw:1000px;
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;font-family:'Gilroy','Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  background:var(--c2);color:var(--c1);line-height:1.45;-webkit-font-smoothing:antialiased;}
img{max-width:100%;display:block;}
a{color:inherit;}
.container{max-width:var(--maxw);margin:0 auto;padding:0 24px;}
.section{padding:34px 0;}
h1,h2,h3{margin:0;line-height:1.05;font-weight:600;}
h2{font-size:clamp(30px,4.4vw,50px);margin-bottom:30px;}
h3{font-size:clamp(24px,3.4vw,40px);}
p{margin:0 0 16px;}
.muted{color:var(--c1);font-size:clamp(16px,1.7vw,24px);line-height:1.5;}
.reveal{opacity:0;transform:translateY(36px);transition:opacity .8s cubic-bezier(.22,.61,.36,1),transform .8s cubic-bezier(.22,.61,.36,1);}
.reveal.is-visible{opacity:1;transform:none;}
.tags{display:flex;flex-wrap:wrap;gap:20px;}
.chip{display:inline-flex;align-items:center;padding:15px 35px;border:none;
  border-radius:35px;font-size:clamp(16px,1.7vw,24px);font-weight:500;background:#fff;color:var(--c1);}
.bullets{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:20px;}
.bullets li{position:relative;padding-left:26px;font-size:clamp(16px,1.7vw,24px);line-height:1.4;}
.bullets li::before{content:"";position:absolute;left:0;top:.55em;width:10px;height:10px;
  border-radius:50%;background:var(--bullet,#4760F7);transform:translateY(-50%);}
.hero{position:relative;color:#fff;min-height:632px;display:flex;align-items:stretch;
  background:var(--a2);background-size:cover;background-position:center;overflow:hidden;}
.hero__inner{position:relative;z-index:2;width:calc(100% - 48px);max-width:1400px;margin:0 auto;
  display:flex;flex-direction:column;padding:72px 0 64px;gap:56px;}
.hero__top{display:flex;justify-content:space-between;align-items:center;}
.hero__client{font-weight:800;letter-spacing:2px;font-size:clamp(20px,2vw,28px);}
.tag{display:inline-flex;align-items:center;padding:15px 25px;border-radius:25px;
  background:rgba(255,255,255,.13);font-size:clamp(15px,1.6vw,20px);font-weight:600;}
.hero__body{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;flex-wrap:wrap;margin-top:auto;}
.hero__title{max-width:900px;display:flex;flex-direction:column;gap:10px;}
.hero__title h1{font-size:clamp(30px,4.4vw,50px);font-weight:600;line-height:1.1;}
.hero__title p{font-size:clamp(18px,2.2vw,30px);font-weight:600;margin:0;opacity:.95;}
.hero__stats{display:flex;flex-direction:column;gap:10px;text-align:right;align-items:flex-end;width:388px;max-width:100%;}
.hero__stat b{display:block;font-size:clamp(40px,5.4vw,64px);font-weight:600;line-height:1;}
.hero__stat span{display:block;margin-top:6px;font-size:clamp(14px,1.5vw,20px);font-weight:400;opacity:.92;}
.grid-img{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;}
.grid-img img{border-radius:25px;width:100%;object-fit:cover;}
.ph{background:linear-gradient(135deg,#e2e6f5,#cbd2ec);border-radius:25px;min-height:300px;
  display:flex;align-items:center;justify-content:center;color:rgba(20,20,20,.4);font-size:16px;}
.highlights{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-top:28px;}
.highlight{background:var(--a2);color:#fff;border-radius:25px;padding:22px 30px;}
.highlight b{display:block;font-size:clamp(20px,2.2vw,30px);font-weight:600;margin-bottom:8px;}
.highlight span{font-size:clamp(16px,1.7vw,24px);font-weight:500;opacity:.92;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:40px;}
.two-col h3{font-size:clamp(28px,3.8vw,50px);margin-bottom:24px;}
.note{margin-top:30px;background:var(--a3);color:var(--c1);border-radius:25px;
  padding:25px 30px;font-size:clamp(16px,1.7vw,24px);font-weight:500;}
.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:0;}
.metric{background:#fff;border-radius:25px;padding:20px 30px 20px;min-height:200px;
  display:flex;flex-direction:column;justify-content:space-between;}
.metric span{font-size:clamp(20px,2.2vw,30px);font-weight:600;color:var(--c1);}
.metric b{font-size:clamp(28px,4.4vw,56px);font-weight:600;color:var(--a2);text-align:right;line-height:1;white-space:nowrap;}
.banners-title{font-size:clamp(22px,2.4vw,30px);font-weight:600;margin:34px 0 15px;}
.bullets--mt{margin:8px 0 30px;}
.quote{position:relative;background:var(--a3);color:#fff;border-radius:40px;
  padding:44px clamp(24px,4vw,40px) 40px;margin-top:34px;display:flex;flex-direction:column;gap:24px;}
.quote__text{position:relative;font-size:clamp(18px,1.9vw,26px);font-weight:500;line-height:1.45;
  display:flex;flex-direction:column;gap:16px;}
.quote__mark{display:block;width:clamp(30px,3vw,40px);height:auto;color:#fff;}
.quote__mark--end{margin-left:auto;}
.quote__author{display:flex;align-items:center;gap:36px;margin-top:30px;padding-left:27px;}
.quote__avatar{width:98px;height:98px;border-radius:50%;object-fit:cover;background:rgba(255,255,255,.35);flex:0 0 auto;}
.quote__name{font-weight:700;font-size:clamp(18px,2vw,24px);}
.quote__role{font-size:clamp(16px,1.8vw,24px);font-weight:500;opacity:.92;margin-top:4px;}
.formcard{background:#fff;border-radius:40px;padding:clamp(28px,4vw,48px);}
.formcard h2{margin-bottom:12px;}
.formgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:28px;}
.formgrid .full{grid-column:1/-1;}
.formgrid input,.formgrid textarea{font:inherit;width:100%;padding:16px 18px;border-radius:16px;
  border:1px solid rgba(20,20,20,.18);background:var(--c2);font-size:18px;}
.formgrid textarea{min-height:110px;resize:vertical;}
.btn-accent{background:var(--a1);color:#fff;border:none;border-radius:45px;
  padding:16px 36px;font:inherit;font-size:20px;font-weight:600;cursor:pointer;transition:filter .15s ease;}
.btn-accent:hover{filter:brightness(1.06);}
.cases-head{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:30px;}
.cases-head h2{margin:0;}
.cases__nav{display:flex;gap:12px;flex:0 0 auto;}
.cases__arrow{width:48px;height:48px;border-radius:50%;border:1px solid rgba(20,20,20,.16);
  background:#fff;color:var(--c1);cursor:pointer;padding:0;
  display:flex;align-items:center;justify-content:center;transition:background .15s ease,color .15s ease,border-color .15s ease;}
.cases__arrow svg{display:block;}
.cases__arrow:hover{background:var(--a1);color:#fff;border-color:transparent;}
.cases-track{display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;
  scroll-behavior:smooth;padding-bottom:6px;scrollbar-width:none;-ms-overflow-style:none;}
.cases-track::-webkit-scrollbar{display:none;}
.case{flex:0 0 calc((100% - 20px)/2);scroll-snap-align:start;background:#fff;border-radius:25px;
  padding:10px;display:flex;flex-direction:column;gap:20px;transition:transform .25s ease,box-shadow .25s ease;}
.case__img{height:200px;border-radius:18px;background:linear-gradient(135deg,#2b4a6b,#16263b);
  background-size:cover;background-position:center;position:relative;}
.case__tag{position:absolute;top:20px;right:20px;padding:7px 15px;border-radius:25px;
  font-size:14px;font-weight:600;}
.case__title{position:absolute;left:20px;bottom:18px;right:20px;color:#fff;font-weight:600;
  font-size:clamp(16px,1.9vw,22px);line-height:1.2;text-shadow:0 2px 12px rgba(0,0,0,.45);}
.case__body{padding:6px 8px 12px;display:flex;flex-direction:column;gap:22px;flex:1;}
.case__metrics{display:flex;gap:10px;}
.case__metric{flex:1;border:1px solid rgba(20,20,20,.12);border-radius:18px;padding:15px;
  min-height:150px;display:flex;flex-direction:column;justify-content:space-between;gap:10px;}
.case__metric span{font-size:13px;color:var(--c1);line-height:1.25;font-weight:500;}
.case__metric b{font-size:clamp(22px,2.8vw,36px);font-weight:600;line-height:1;white-space:nowrap;align-self:self-end;}
.case__btn{margin-top:auto;align-self:center;background:var(--a1);color:#fff;border:none;
  border-radius:45px;padding:14px 40px;font:inherit;font-size:18px;font-weight:600;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;text-decoration:none;text-align:center;}
@media(max-width:760px){
  .two-col,.metrics,.formgrid{grid-template-columns:1fr;}
  .case{flex-basis:100%;}
  .hero__body{flex-direction:column;align-items:flex-start;}
  .hero__stats{text-align:left;align-items:flex-start;width:100%;}
  .metric{min-height:auto;padding:18px 20px;gap:12px;}
  .metric b{font-size:clamp(24px,7vw,36px);white-space:normal;word-break:break-word;}
  .case__metrics{gap:8px;flex-direction:column}
  .case__metric{min-height:auto;padding:12px 14px;gap:8px;}
  .case__metric span{font-size:11px;}
  .case__metric b{font-size:clamp(18px,5vw,28px);white-space:normal;}
  .cases__arrow{width:42px;height:42px;}
  .case__btn{font-size:16px;}
}
```

### HTML-шаблоны блоков (выводить только включённые, в указанном порядке)

**hero** — если есть image, добавь `style="background-image:url('...')"` к `.hero`:
```html
<section class="hero reveal">
  <div class="hero__inner">
    <div class="hero__top">
      <span class="hero__client">{{clientLogo}}</span>
      <span class="tag">{{tag}}</span>
    </div>
    <div class="hero__body">
      <div class="hero__title">
        <h1>{{title}}</h1>
        <p>{{subtitle}}</p>
      </div>
      <div class="hero__stats">
        <!-- на каждую метрику: -->
        <div class="hero__stat"><b>{{value}}</b><span>{{label}}</span></div>
      </div>
    </div>
  </div>
</section>
```

**Универсальная секция** (client, tools, channels, audience, strategy, results, form, cases оборачиваются так):
```html
<section class="section reveal"><div class="container"> … содержимое … </div></section>
```

**client:** `<h2>{{title}}</h2><p class="muted">{{text}}</p>`

**goals / tasks:**
```html
<h2>{{title}}</h2>
<ul class="bullets" style="--bullet:{{bulletColor}}">
  <li>{{item}}</li>
</ul>
```

**creatives:** на каждый элемент — `<img src="...">`, при отсутствии картинок выведи одну заглушку `<div class="ph">Изображение креатива</div>`:
```html
<h2>{{title}}</h2><div class="grid-img"> … </div>
```

**tools:**
```html
<h2>{{title}}</h2>
<div class="tags"><span class="chip">{{chip}}</span></div>
<div class="highlights">
  <div class="highlight"><b>{{label}}</b><span>{{value}}</span></div>
</div>
```

**channels:**
```html
<div class="two-col">
  <div><h3>{{channelsTitle}}</h3><div class="tags"><span class="chip">{{ch}}</span></div></div>
  <div><h3>{{formatsTitle}}</h3><div class="tags"><span class="chip">{{fmt}}</span></div></div>
</div>
<div class="note" style="color:{{noteColor}}">{{note}}</div>
```

**audience:**
```html
<h2>{{title}}</h2><p class="muted">{{text}}</p>
<div class="tags" style="margin-top:18px"><span class="chip">{{chip}}</span></div>
```

**strategy:**
```html
<h2>{{title}}</h2>
<p class="muted">{{paragraph}}</p>
<ul class="bullets bullets--mt" style="--bullet:#4760F7"><li>{{item}}</li></ul>
```

**results:**
```html
<h2>{{title}}</h2>
<p class="muted">{{paragraph}}</p>
<ul class="bullets bullets--mt" style="--bullet:{{bulletColor}}"><li>{{item}}</li></ul>
<div class="metrics">
  <div class="metric"><span>{{label}}</span><b>{{value}}</b></div>   <!-- 3 шт -->
</div>
<h3 class="banners-title">{{bannersTitle}}</h3>
<div class="metrics"> … bannerMetrics, так же … </div>
<div class="quote">
  <svg class="quote__mark" width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 31.2L8.4 0H19.2L14.4 31.2H0ZM20.4 31.2L28.8 0H39.6L34.8 31.2H20.4Z" fill="currentColor"/></svg>
  <div class="quote__text"><p style="margin:0">{{абзац отзыва}}</p></div>
  <svg class="quote__mark quote__mark--end" width="40" height="31" viewBox="0 0 40 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M39.6 -0.2L31.2 31H20.4L25.2 -0.2H39.6ZM19.2 -0.2L10.8 31H0L4.8 -0.2H19.2Z" fill="currentColor"/></svg>
  <div class="quote__author">
    <!-- если есть фото: <img class="quote__avatar" src="..."> иначе: <span class="quote__avatar"></span> -->
    <div><div class="quote__name">{{quoteAuthor}}</div><div class="quote__role">{{quoteRole}}</div></div>
  </div>
</div>
```

**form:**
```html
<div class="formcard">
  <h2>{{title}}</h2>
  <p class="muted">{{subtitle}}</p>
  <form class="formgrid" onsubmit="event.preventDefault();this.reset();alert('Заявка отправлена!');">
    <input type="text" placeholder="Имя" required>
    <input type="tel" placeholder="Телефон" required>
    <input class="full" type="email" placeholder="E-mail">
    <textarea class="full" placeholder="Комментарий"></textarea>
    <div class="full"><button class="btn-accent" type="submit">{{button}}</button></div>
  </form>
</div>
```

**cases** — `.cases__nav` выводить, только если карточек > 1 (стрелки сами скрываются скриптом, если влезает). У `.case__img` добавляй `style="background-image:url('...')"` если есть image:
```html
<div class="cases">
  <div class="cases-head">
    <h2>{{title}}</h2>
    <div class="cases__nav" style="display:none">
      <button class="cases__arrow" type="button" data-dir="-1" aria-label="Назад"><svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 1.5L2 9l7.5 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <button class="cases__arrow" type="button" data-dir="1" aria-label="Вперёд"><svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 1.5L9 9l-7.5 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </div>
  </div>
  <div class="cases-track">
    <!-- на каждую карточку: -->
    <article class="case">
      <div class="case__img">
        <span class="case__tag" style="background:{{color}};color:{{tagText}}">{{tag}}</span>
        <div class="case__title">{{title}}</div>
      </div>
      <div class="case__body">
        <div class="case__metrics">
          <div class="case__metric"><span>{{label}}</span><b style="color:{{color}}">{{value}}</b></div>
        </div>
        <a class="case__btn" href="{{url}}" target="_blank" rel="noopener">{{button}}</a>
      </div>
    </article>
  </div>
</div>
```

### Скрипт 1 — появление при скролле (вставить перед `</body>`)
```html
<script>
(function(){
  var els=document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){els.forEach(function(e){e.classList.add("is-visible");});return;}
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){en.target.classList.add("is-visible");io.unobserve(en.target);} });
  },{threshold:0.12,rootMargin:"0px 0px -40px 0px"});
  els.forEach(function(e){io.observe(e);});
})();
</script>
```

### Скрипт 2 — слайдер кейсов (вставить перед `</body>`)
```html
<script>
(function(){
  function setup(box){
    var track=box.querySelector(".cases-track");
    var nav=box.querySelector(".cases__nav");
    if(!track) return;
    function sync(){ if(nav){ nav.style.display=(track.scrollWidth-track.clientWidth>4)?"flex":"none"; } }
    box.querySelectorAll(".cases__arrow").forEach(function(btn){
      btn.addEventListener("click",function(){
        track.scrollBy({left:track.clientWidth*Number(btn.getAttribute("data-dir")),behavior:"smooth"});
      });
    });
    sync();
    window.addEventListener("resize",sync);
  }
  document.querySelectorAll(".cases").forEach(setup);
})();
</script>
```

---

## Результат
Сохрани всё в `case-page.html` и открой в браузере. Должна получиться страница-кейс,
идентичная макету: hero с метриками, текстовые блоки с буллетами, чипсы, карточки
результатов, блок-отзыв, форма и слайдер кейсов — с анимацией появления при скролле.
