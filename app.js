/* =========================================================
   Генератор HTML-страниц (кейс) — ванильный JS
   - схема блоков -> форма
   - состояние -> генерация одного HTML-файла
   - превью в iframe + скачивание
   ========================================================= */

/* ---------- Палитра ---------- */
const COLORS = [
  { key: 'c1', name: 'Контрастный 1 (текст)', value: '#141414' },
  { key: 'c2', name: 'Контрастный 2 (фон)',   value: '#F8F9FF' },
  { key: 'a1', name: 'Акцент 1', value: '#F93790' },
  { key: 'a2', name: 'Акцент 2', value: '#4E929A' },
  { key: 'a3', name: 'Акцент 3', value: '#99D9FC' },
];

/* ---------- Схема блоков ----------
   Типы полей: text, textarea, image, images, list, grouplist
*/
const SCHEMA = [
  {
    id: 'hero', name: 'Hero (обложка)', enabled: true,
    fields: [
      { key: 'image', type: 'image', label: 'Фоновое изображение' },
      { key: 'clientLogo', type: 'text', label: 'Логотип клиента (текст)', default: 'VERTICAL' },
      { key: 'tag', type: 'text', label: 'Тег (отрасль)', default: 'Недвижимость' },
      { key: 'title', type: 'textarea', label: 'Заголовок',
        default: 'Как увеличить количество конверсий в недвижимости вдвое' },
      { key: 'subtitle', type: 'text', label: 'Подзаголовок',
        default: 'Как увеличить количество конверсий в недвижимости вдвое' },
      { key: 'stats', type: 'grouplist', label: 'Метрики', itemLabel: 'Метрика',
        item: [
          { key: 'value', type: 'text', label: 'Значение', default: '' },
          { key: 'label', type: 'text', label: 'Подпись', default: '' },
        ],
        default: [
          { value: 'х3,5', label: 'выросло число целевых заявок' },
          { value: '45%', label: 'выросло число целевых заявок' },
          { value: '4,8ML', label: 'выросло число' },
        ] },
    ],
  },
  {
    id: 'client', name: 'Клиент', enabled: true,
    fields: [
      { key: 'title', type: 'text', label: 'Заголовок', default: 'Клиент' },
      { key: 'text', type: 'textarea', label: 'Текст',
        default: 'B2B-услуги в недвижимости (инвестиционные объекты)' },
    ],
  },
  {
    id: 'goals', name: 'Цели', enabled: true,
    fields: [
      { key: 'title', type: 'text', label: 'Заголовок', default: 'Цели' },
      { key: 'bulletColor', type: 'color', label: 'Цвет маркера списка', default: '#4760F7' },
      { key: 'items', type: 'list', label: 'Список', itemLabel: 'Пункт', multiline: true,
        default: [
          'Детальное отслеживание пути пользователя от первого контакта до конверсии',
          'Рост числа целевых заявок при сохранении стоимости лида',
          'Привлечение платёжеспособной аудитории инвесторов',
        ] },
    ],
  },
  {
    id: 'tasks', name: 'Задачи кампании', enabled: true,
    fields: [
      { key: 'title', type: 'text', label: 'Заголовок', default: 'Задачи рекламной кампании' },
      { key: 'bulletColor', type: 'color', label: 'Цвет маркера списка', default: '#4760F7' },
      { key: 'items', type: 'list', label: 'Список', itemLabel: 'Пункт', multiline: true,
        default: [
          'Настроить сквозную аналитику от показа до сделки',
          'Сегментировать аудиторию и протестировать гипотезы',
          'Оптимизировать кампанию под целевое действие',
        ] },
    ],
  },
  {
    id: 'creatives', name: 'Креативы', enabled: true,
    fields: [
      { key: 'title', type: 'text', label: 'Заголовок', default: 'Креативы' },
      { key: 'images', type: 'images', label: 'Изображения креативов', default: [''] },
    ],
  },
  {
    id: 'tools', name: 'Инструменты', enabled: true,
    fields: [
      { key: 'title', type: 'text', label: 'Заголовок', default: 'Инструменты' },
      { key: 'chips', type: 'list', label: 'Инструменты (теги)', itemLabel: 'Тег',
        default: ['Semantica 360', 'Hybrid Places', 'Hybrid Segments', 'Smart Bid'] },
      { key: 'highlights', type: 'grouplist', label: 'Параметры', itemLabel: 'Параметр',
        item: [
          { key: 'label', type: 'text', label: 'Название', default: '' },
          { key: 'value', type: 'text', label: 'Значение', default: '' },
        ],
        default: [
          { label: 'Период', value: '13.09.24 – 31.12.24' },
          { label: 'Гео', value: 'Миллионники + нефтяники' },
        ] },
    ],
  },
  {
    id: 'channels', name: 'Каналы / Форматы', enabled: true,
    fields: [
      { key: 'channelsTitle', type: 'text', label: 'Заголовок (левый)', default: 'Каналы' },
      { key: 'channels', type: 'list', label: 'Каналы', itemLabel: 'Канал',
        default: ['Desktop web', 'TV', 'In-app', 'Mobile web'] },
      { key: 'formatsTitle', type: 'text', label: 'Заголовок (правый)', default: 'Форматы' },
      { key: 'formats', type: 'list', label: 'Форматы', itemLabel: 'Формат',
        default: ['Banner Ads', 'Native Ads', 'Smart TV', 'Video Ads'] },
      { key: 'note', type: 'textarea', label: 'Примечание',
        default: 'РК была запущена рекламным агентством Internet Active с помощью Hybrid Platform по модели Self-service.' },
      { key: 'noteColor', type: 'color', label: 'Цвет текста примечания', default: '#F8F9FF' },
    ],
  },
  {
    id: 'audience', name: 'Целевая аудитория', enabled: true,
    fields: [
      { key: 'title', type: 'text', label: 'Заголовок', default: 'Целевая аудитория' },
      { key: 'text', type: 'textarea', label: 'Текст',
        default: 'Мы разделили аудиторию на сегменты и применили SmartBid-оптимизацию для ретаргетинга, чтобы выявить самых релевантных пользователей и приблизиться к идеальной модели покупателя.' },
      { key: 'chips', type: 'list', label: 'Сегменты (теги)', itemLabel: 'Сегмент',
        default: ['Hybrid Segments', 'Аудиторные сегменты', 'Hybrid Places'] },
    ],
  },
  {
    id: 'strategy', name: 'Стратегия', enabled: true,
    fields: [
      { key: 'title', type: 'text', label: 'Заголовок', default: 'Стратегия' },
      { key: 'paragraphs', type: 'list', label: 'Абзацы', itemLabel: 'Абзац', multiline: true,
        default: [
          'В течение трёх месяцев мы проводили эксперимент: разделили аудиторию на несколько сегментов и применили SmartBid-оптимизацию для ретаргетинга.',
          'Наша команда обучала ML-модель, способную прогнозировать конверсии, и каждый день приближалась к идеальной модели, которая точно понимала, кто из аудитории совершит нужное действие.',
        ] },
      { key: 'items', type: 'list', label: 'Ключевые шаги', itemLabel: 'Шаг', multiline: true,
        default: [
          'Сегментация аудитории и тестирование гипотез',
          'SmartBid-оптимизация под целевое действие',
        ] },
    ],
  },
  {
    id: 'results', name: 'Результаты', enabled: true,
    fields: [
      { key: 'title', type: 'text', label: 'Заголовок', default: 'Результаты' },
      { key: 'paragraphs', type: 'list', label: 'Абзацы', itemLabel: 'Абзац', multiline: true,
        default: [
          'За три месяца мы не просто увеличили количество заявок, но и привлекли действительно заинтересованную аудиторию, что напрямую повлияло на успешность продаж инвестиционных объектов.',
        ] },
      { key: 'bulletColor', type: 'color', label: 'Цвет маркера списка', default: '#4760F7' },
      { key: 'items', type: 'list', label: 'Список (после текста)', itemLabel: 'Пункт', multiline: true,
        default: [
          'Детальное отслеживание пути пользователя от первого контакта до конверсии',
          'Снижение стоимости целевого действия при росте объёма',
          'Рост доли платёжеспособной аудитории',
        ] },
      { key: 'metrics', type: 'grouplist', label: 'Метрики', itemLabel: 'Метрика',
        item: [
          { key: 'label', type: 'text', label: 'Подпись', default: '' },
          { key: 'value', type: 'text', label: 'Значение', default: '' },
        ],
        default: [
          { label: 'Reach', value: '5 562 241' },
          { label: 'CTR', value: '1.08%' },
          { label: 'Clicks', value: '127 140' },
        ] },
      { key: 'bannersTitle', type: 'text', label: 'Подзаголовок (доп. блок)', default: 'Баннеры' },
      { key: 'bannerMetrics', type: 'grouplist', label: 'Метрики (доп.)', itemLabel: 'Метрика',
        item: [
          { key: 'label', type: 'text', label: 'Подпись', default: '' },
          { key: 'value', type: 'text', label: 'Значение', default: '' },
        ],
        default: [
          { label: 'CTR', value: '1.08%' },
          { label: 'Clicks', value: '127 140' },
          { label: 'Reach', value: '5 562 241' },
        ] },
      { key: 'quoteText', type: 'textarea', label: 'Отзыв (текст)',
        default: 'Результаты действительно впечатляют! Мы не просто увеличили количество заявок, но и смогли привлечь действительно заинтересованную аудиторию, что напрямую влияет на успешность продаж инвестиционных объектов. В нашей сфере важно не просто собрать лиды, а найти тех, кто действительно готов к инвестициям. Именно поэтому подход, основанный на глубоком анализе сегментов и ML-моделях, оказался таким эффективным.\n\nSmartBid-оптимизация и тщательная работа с аудиториями позволили нам исключить нерелевантные сегменты и сфокусироваться на тех, кто демонстрирует наибольшую заинтересованность. Это значит, что каждый вложенный рубль работал на реальную конверсию, а не просто увеличивал охваты.\n\nПодход с детальным анализом сегментов, автоматизацией ретаргетинга и постоянным тестированием креативов показал свою эффективность. Мы убедились, что глубокая аналитика и постоянная оптимизация дают куда более устойчивый и прогнозируемый рост конверсий, чем разовые рекламные кампании.' },
      { key: 'quoteAuthor', type: 'text', label: 'Автор отзыва', default: 'Александр Пестряков' },
      { key: 'quoteRole', type: 'text', label: 'Должность',
        default: 'директор по маркетингу апарт-отелей Vertical' },
      { key: 'quoteAvatar', type: 'image', label: 'Фото автора' },
    ],
  },
  {
    id: 'form', name: 'Форма', enabled: true,
    fields: [
      { key: 'title', type: 'text', label: 'Заголовок', default: 'Хотите так же?' },
      { key: 'subtitle', type: 'textarea', label: 'Подзаголовок',
        default: 'Оставьте заявку — расскажем, как достичь подобных результатов в вашей нише.' },
      { key: 'button', type: 'text', label: 'Кнопка', default: 'Отправить заявку' },
    ],
  },
  {
    id: 'cases', name: 'Другие кейсы', enabled: true,
    fields: [
      { key: 'title', type: 'text', label: 'Заголовок', default: 'Кейсы' },
      { key: 'cards', type: 'grouplist', label: 'Карточки кейсов', itemLabel: 'Кейс',
        item: [
          { key: 'image', type: 'image', label: 'Изображение' },
          { key: 'tag', type: 'text', label: 'Тег', default: '' },
          { key: 'color', type: 'color', label: 'Цвет кейса (метрики и тег)', default: '#F93790' },
          { key: 'tagText', type: 'color', label: 'Цвет текста тега', default: '#F8F9FF' },
          { key: 'title', type: 'text', label: 'Заголовок', default: '' },
          { key: 'm1', type: 'text', label: 'Метрика 1 — значение', default: '' },
          { key: 'l1', type: 'text', label: 'Метрика 1 — подпись', default: '' },
          { key: 'm2', type: 'text', label: 'Метрика 2 — значение', default: '' },
          { key: 'l2', type: 'text', label: 'Метрика 2 — подпись', default: '' },
          { key: 'm3', type: 'text', label: 'Метрика 3 — значение', default: '' },
          { key: 'l3', type: 'text', label: 'Метрика 3 — подпись', default: '' },
          { key: 'button', type: 'text', label: 'Кнопка (текст)', default: '' },
          { key: 'url', type: 'text', label: 'Ссылка кнопки', default: '#' },
        ],
        default: [
          { image: '', tag: 'FMCG', color: '#F93790', tagText: '#F8F9FF',
            title: '+15% к Brand Awareness и X2 конверсий в корзину: как работает эффективный brandformance',
            m1: 'X3,5', l1: 'выросло число целевых заявок', m2: '45%', l2: 'выросло число целевых заявок выросло число',
            m3: '4,8ML', l3: 'выросло число', button: 'Посмотреть подробнее', url: '#' },
          { image: '', tag: 'Финансы', color: '#1467C9', tagText: '#F8F9FF',
            title: 'Как увеличить количество конверсий в недвижимости вдвое',
            m1: 'X3,5', l1: 'выросло число целевых заявок', m2: '45%', l2: 'выросло число целевых заявок выросло число',
            m3: '4,8ML', l3: 'выросло число', button: 'Посмотреть подробнее', url: '#' },
        ] },
    ],
  },
];

/* ---------- Состояние ---------- */
const state = { colors: {}, blocks: {} };

function buildDefaultState() {
  COLORS.forEach(c => state.colors[c.key] = c.value);
  SCHEMA.forEach(block => {
    const b = { enabled: block.enabled, name: block.name };
    block.fields.forEach(f => {
      b[f.key] = deepDefault(f);
    });
    state.blocks[block.id] = b;
  });
}
function deepDefault(field) {
  if (field.type === 'list') return (field.default || []).slice();
  if (field.type === 'images') return (field.default || []).slice();
  if (field.type === 'grouplist') return (field.default || []).map(o => Object.assign({}, o));
  if (field.type === 'image') return field.default || '';
  return field.default || '';
}

/* ---------- Утилиты ---------- */
function el(tag, attrs, children) {
  const node = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    if (k === 'class') node.className = attrs[k];
    else if (k === 'html') node.innerHTML = attrs[k];
    else if (k.startsWith('on') && typeof attrs[k] === 'function') node.addEventListener(k.slice(2), attrs[k]);
    else node.setAttribute(k, attrs[k]);
  }
  (children || []).forEach(c => { if (c != null) node.append(c); });
  return node;
}
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function nl2br(s) { return esc(s).replace(/\n/g, '<br>'); }
/* Текст с поддержкой жирного: **жирный** -> <strong> и переносов строк */
function rich(s) { return nl2br(s).replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>'); }
function debounce(fn, ms) { let t; return function () { clearTimeout(t); t = setTimeout(() => fn.apply(this, arguments), ms); }; }

function readFileAsDataURL(file, cb) {
  const r = new FileReader();
  r.onload = () => cb(r.result);
  r.readAsDataURL(file);
}

/* =========================================================
   РЕНДЕР ФОРМЫ
   ========================================================= */
const blocksRoot = document.getElementById('blocksRoot');
const colorsGrid = document.getElementById('colorsGrid');

function renderColors() {
  colorsGrid.innerHTML = '';
  COLORS.forEach(c => {
    const hex = el('span', { class: 'color-item__hex' }, [state.colors[c.key]]);
    const input = el('input', {
      type: 'color', value: state.colors[c.key],
      oninput: e => { state.colors[c.key] = e.target.value; hex.textContent = e.target.value; schedulePreview(); },
    });
    colorsGrid.append(el('div', { class: 'color-item' }, [
      input,
      el('div', { class: 'color-item__meta' }, [
        el('span', { class: 'color-item__name' }, [c.name]),
        hex,
      ]),
    ]));
  });
}

function renderBlocks() {
  blocksRoot.innerHTML = '';
  SCHEMA.forEach(block => {
    const data = state.blocks[block.id];

    const toggle = el('label', { class: 'toggle', title: 'Добавить блок на страницу',
      onclick: e => e.stopPropagation() }, [
      el('input', { type: 'checkbox', ...(data.enabled ? { checked: 'checked' } : {}),
        onchange: e => { data.enabled = e.target.checked; card.classList.toggle('is-off', !data.enabled); schedulePreview(); } }),
      el('span', { class: 'toggle__track' }),
    ]);

    const body = el('div', { class: 'card__body' });
    block.fields.forEach(f => body.append(renderField(block.id, f)));

    const nameInput = el('input', {
      type: 'text', class: 'card__name', value: data.name,
      title: 'Нажмите, чтобы переименовать блок',
      onclick: e => e.stopPropagation(),
      onkeydown: e => { if (e.key === 'Enter') e.target.blur(); },
      oninput: e => { data.name = e.target.value; },
    });

    const head = el('div', { class: 'card__head' }, [
      toggle,
      nameInput,
      el('span', { class: 'card__chev', html: '&#9662;' }),
    ]);
    head.addEventListener('click', e => {
      if (e.target === nameInput) return;
      card.classList.toggle('is-collapsed');
    });

    const card = el('fieldset', { class: 'card' + (data.enabled ? '' : ' is-off') }, [head, body]);
    blocksRoot.append(card);
  });
}

/* Рендер одного поля по типу */
function renderField(blockId, field) {
  const data = state.blocks[blockId];
  const type = field.type;

  if (type === 'text' || type === 'textarea') {
    const control = type === 'textarea'
      ? el('textarea', { oninput: e => { data[field.key] = e.target.value; schedulePreview(); } }, [])
      : el('input', { type: 'text', oninput: e => { data[field.key] = e.target.value; schedulePreview(); } });
    if (type === 'textarea') control.value = data[field.key]; else control.value = data[field.key];
    return el('div', { class: 'field' }, [el('label', {}, [field.label]), control]);
  }

  if (type === 'color') {
    const hex = el('span', { class: 'color-item__hex' }, [data[field.key]]);
    const input = el('input', { type: 'color', value: data[field.key],
      oninput: e => { data[field.key] = e.target.value; hex.textContent = e.target.value; schedulePreview(); } });
    return el('div', { class: 'field' }, [
      el('label', {}, [field.label]),
      el('div', { class: 'color-item' }, [input, el('div', { class: 'color-item__meta' }, [hex])]),
    ]);
  }

  if (type === 'image') {
    return el('div', { class: 'field' }, [
      el('label', {}, [field.label]),
      imageControl(() => data[field.key], v => { data[field.key] = v; schedulePreview(); }),
    ]);
  }

  if (type === 'images') {
    const wrap = el('div', { class: 'field' }, [el('label', {}, [field.label])]);
    const listBox = el('div', { class: 'list' });
    const redraw = () => {
      listBox.innerHTML = '';
      data[field.key].forEach((src, i) => {
        listBox.append(el('div', { class: 'list__item' }, [
          imageControl(() => data[field.key][i], v => { data[field.key][i] = v; schedulePreview(); }),
          el('button', { class: 'btn--del', type: 'button', title: 'Удалить',
            onclick: () => { data[field.key].splice(i, 1); redraw(); schedulePreview(); } }, ['✕']),
        ]));
      });
    };
    redraw();
    const add = el('div', { class: 'add-row' }, [
      el('button', { class: 'btn--mini', type: 'button',
        onclick: () => { data[field.key].push(''); redraw(); } }, ['+ Добавить изображение']),
    ]);
    wrap.append(listBox, add);
    return wrap;
  }

  if (type === 'list') {
    const wrap = el('div', { class: 'field' }, [el('label', {}, [field.label])]);
    const listBox = el('div', { class: 'list' });
    const redraw = () => {
      listBox.innerHTML = '';
      data[field.key].forEach((val, i) => {
        const control = field.multiline
          ? el('textarea', { oninput: e => { data[field.key][i] = e.target.value; schedulePreview(); } }, [])
          : el('input', { type: 'text', oninput: e => { data[field.key][i] = e.target.value; schedulePreview(); } });
        control.value = val;
        listBox.append(el('div', { class: 'list__item' }, [
          el('div', { class: 'field' }, [control]),
          el('button', { class: 'btn--del', type: 'button', title: 'Удалить',
            onclick: () => { data[field.key].splice(i, 1); redraw(); schedulePreview(); } }, ['✕']),
        ]));
      });
    };
    redraw();
    wrap.append(listBox, el('div', { class: 'add-row' }, [
      el('button', { class: 'btn--mini', type: 'button',
        onclick: () => { data[field.key].push(''); redraw(); schedulePreview(); } }, ['+ ' + (field.itemLabel || 'Добавить')]),
    ]));
    return wrap;
  }

  if (type === 'grouplist') {
    const wrap = el('div', { class: 'field' }, [el('label', {}, [field.label])]);
    const listBox = el('div', { class: 'list' });
    const redraw = () => {
      listBox.innerHTML = '';
      data[field.key].forEach((obj, i) => {
        const sub = el('div', { class: 'subgroup' }, [
          el('div', { class: 'subgroup__head' }, [
            el('span', { class: 'subgroup__title' }, [(field.itemLabel || 'Элемент') + ' ' + (i + 1)]),
            el('button', { class: 'btn--del', type: 'button',
              onclick: () => { data[field.key].splice(i, 1); redraw(); schedulePreview(); } }, ['Удалить']),
          ]),
        ]);
        field.item.forEach(sf => {
          if (sf.type === 'image') {
            sub.append(el('div', { class: 'field' }, [
              el('label', {}, [sf.label]),
              imageControl(() => obj[sf.key], v => { obj[sf.key] = v; schedulePreview(); }),
            ]));
          } else {
            const control = sf.type === 'textarea'
              ? el('textarea', { oninput: e => { obj[sf.key] = e.target.value; schedulePreview(); } }, [])
              : el('input', { type: 'text', oninput: e => { obj[sf.key] = e.target.value; schedulePreview(); } });
            control.value = obj[sf.key] != null ? obj[sf.key] : '';
            sub.append(el('div', { class: 'field' }, [el('label', {}, [sf.label]), control]));
          }
        });
        listBox.append(sub);
      });
    };
    redraw();
    wrap.append(listBox, el('div', { class: 'add-row' }, [
      el('button', { class: 'btn--mini', type: 'button',
        onclick: () => {
          const blank = {}; field.item.forEach(sf => blank[sf.key] = '');
          data[field.key].push(blank); redraw(); schedulePreview();
        } }, ['+ ' + (field.itemLabel || 'Добавить')]),
    ]));
    return wrap;
  }

  return el('div', {});
}

/* Контрол загрузки изображения (drag&drop + клик) */
function imageControl(get, set) {
  const wrap = el('div', { class: 'imgfield' });
  const preview = el('div', { class: 'imgfield__preview' });
  const img = el('img', {});
  const del = el('button', { class: 'btn--del', type: 'button', title: 'Удалить',
    onclick: () => { set(''); refresh(); } }, ['✕']);
  preview.append(img, del);

  const input = el('input', { type: 'file', accept: 'image/*', style: 'display:none' });
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file) readFileAsDataURL(file, d => { set(d); refresh(); });
  });
  const drop = el('div', { class: 'imgfield__drop' }, ['Перетащите изображение или нажмите для выбора']);
  drop.addEventListener('click', () => input.click());
  drop.addEventListener('dragover', e => { e.preventDefault(); });
  drop.addEventListener('drop', e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) readFileAsDataURL(file, d => { set(d); refresh(); });
  });

  function refresh() {
    const v = get();
    if (v) { img.src = v; preview.classList.add('has-img'); drop.style.display = 'none'; }
    else { preview.classList.remove('has-img'); drop.style.display = ''; }
  }
  wrap.append(preview, drop, input);
  refresh();
  return wrap;
}

/* =========================================================
   ГЕНЕРАЦИЯ ВЫХОДНОГО HTML
   ========================================================= */
function generatedCSS() {
  const c = state.colors;
  return `
:root{
  --c1:${c.c1};--c2:${c.c2};--a1:${c.a1};--a2:${c.a2};--a3:${c.a3};
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

/* появление при скролле */
.reveal{opacity:0;transform:translateY(36px);transition:opacity .8s cubic-bezier(.22,.61,.36,1),transform .8s cubic-bezier(.22,.61,.36,1);}
.reveal.is-visible{opacity:1;transform:none;}

/* теги/чипсы */
.tags{display:flex;flex-wrap:wrap;gap:20px;}
.chip{display:inline-flex;align-items:center;padding:15px 35px;border:none;
  border-radius:35px;font-size:clamp(16px,1.7vw,24px);font-weight:500;background:#fff;color:var(--c1);}

/* списки-буллеты */
.bullets{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:20px;}
.bullets li{position:relative;padding-left:26px;font-size:clamp(16px,1.7vw,24px);line-height:1.4;}
.bullets li::before{content:"";position:absolute;left:0;top:.55em;width:10px;height:10px;
  border-radius:50%;background:var(--bullet,#4760F7);transform:translateY(-50%);}

/* hero — контейнер 1400px, верстка по макету */
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

/* creatives */
.grid-img{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;}
.grid-img img{border-radius:25px;width:100%;object-fit:cover;}
.ph{background:linear-gradient(135deg,#e2e6f5,#cbd2ec);border-radius:25px;min-height:300px;
  display:flex;align-items:center;justify-content:center;color:rgba(20,20,20,.4);font-size:16px;}

/* tools highlights (период/гео) */
.highlights{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-top:28px;}
.highlight{background:var(--a2);color:#fff;border-radius:25px;padding:22px 30px;}
.highlight b{display:block;font-size:clamp(20px,2.2vw,30px);font-weight:600;margin-bottom:8px;}
.highlight span{font-size:clamp(16px,1.7vw,24px);font-weight:500;opacity:.92;}

/* two columns */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:40px;}
.two-col h3{font-size:clamp(28px,3.8vw,50px);margin-bottom:24px;}
.note{margin-top:30px;background:var(--a3);color:var(--c1);border-radius:25px;
  padding:25px 30px;font-size:clamp(16px,1.7vw,24px);font-weight:500;}

/* metrics */
.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:0;}
.metric{background:#fff;border-radius:25px;padding:20px 30px 20px;min-height:200px;
  display:flex;flex-direction:column;justify-content:space-between;}
.metric span{font-size:clamp(20px,2.2vw,30px);font-weight:600;color:var(--c1);}
.metric b{font-size:clamp(28px,4.4vw,56px);font-weight:600;color:var(--a2);text-align:right;line-height:1;white-space:nowrap;}
.banners-title{font-size:clamp(22px,2.4vw,30px);font-weight:600;margin:34px 0 15px;}
.bullets--mt{margin:8px 0 30px;}

/* quote */
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

/* form */
.formcard{background:#fff;border-radius:40px;padding:clamp(28px,4vw,48px);}
.formcard h2{margin-bottom:12px;}
.formgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:28px;}
.formgrid .full{grid-column:1/-1;}
.formgrid input,.formgrid textarea{font:inherit;width:100%;padding:16px 18px;border-radius:16px;
  border:1px solid rgba(20,20,20,.18);background:var(--c2);font-size:18px;}
.formgrid textarea{min-height:110px;resize:vertical;}
.field-wrap{display:flex;flex-direction:column;gap:6px;}
.form-err{color:#E5484D;font-size:13px;font-weight:500;min-height:1em;}
.formgrid .is-invalid{border-color:#E5484D;}
.phone-row{display:flex;gap:8px;}
.phone-cc{flex:0 0 auto;width:auto;font:inherit;font-size:18px;padding:16px 10px;border-radius:16px;
  border:1px solid rgba(20,20,20,.18);background:var(--c2);color:var(--c1);cursor:pointer;}
.phone-row input{flex:1;min-width:0;}
.btn-accent{background:var(--a1);color:#fff;border:none;border-radius:45px;
  padding:16px 36px;font:inherit;font-size:20px;font-weight:600;cursor:pointer;transition:filter .15s ease;}
.btn-accent:hover{filter:brightness(1.06);}

/* cases — слайдер */
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
.case__metric b{font-size:clamp(22px,2.8vw,36px);font-weight:600;line-height:1;white-space:nowrap;align-self: self-end;}
.case__btn{margin-top:auto;align-self:center;background:var(--a1);color:#fff;border:none;
  border-radius:45px;padding:14px 40px;font:inherit;font-size:18px;font-weight:600;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;text-decoration:none;text-align:center;}

@media(max-width:760px){
  .two-col,.metrics,.formgrid{grid-template-columns:1fr;}
  .case{flex-basis:100%;}
  .hero__body{flex-direction:column;align-items:flex-start;}
  .hero__stats{text-align:left;align-items:flex-start;width:100%;}
  /* метрики компактнее на мобильных */
  .metric{min-height:auto;padding:18px 20px;gap:12px;}
  .metric b{font-size:clamp(24px,7vw,36px);white-space:normal;word-break:break-word;}
  .case__metrics{gap:8px;flex-direction:column}
  .case__metric{min-height:auto;padding:12px 14px;gap:8px;}
  .case__metric span{font-size:11px;}
  .case__metric b{font-size:clamp(18px,5vw,28px);white-space:normal;}
  .cases__arrow{width:42px;height:42px;}
  .case__btn{font-size:16px;}
}
`;
}

/* ---- рендеры блоков выходной страницы ---- */
function on(id) { return state.blocks[id].enabled; }
function bg(src) { return src ? `style="background-image:url('${src}')"` : ''; }

/* SVG-кавычки из макета (fill наследует цвет текста блока) */
const QUOTE_MARK_UP = '<svg class="quote__mark" width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 31.2L8.4 0H19.2L14.4 31.2H0ZM20.4 31.2L28.8 0H39.6L34.8 31.2H20.4Z" fill="currentColor"/></svg>';
const QUOTE_MARK_DOWN = '<svg class="quote__mark quote__mark--end" width="40" height="31" viewBox="0 0 40 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M39.6 -0.2L31.2 31H20.4L25.2 -0.2H39.6ZM19.2 -0.2L10.8 31H0L4.8 -0.2H19.2Z" fill="currentColor"/></svg>';

/* Шевроны стрелок слайдера */
const CHEVRON_LEFT = '<svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 1.5L2 9l7.5 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHEVRON_RIGHT = '<svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 1.5L9 9l-7.5 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const SECTION = {
  hero(d) {
    const stats = (d.stats || []).filter(s => s.value || s.label).map(s =>
      `<div class="hero__stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('');
    return `
<section class="hero reveal" ${bg(d.image)}>
  <div class="hero__inner">
    <div class="hero__top">
      <span class="hero__client">${esc(d.clientLogo)}</span>
      ${d.tag ? `<span class="tag">${esc(d.tag)}</span>` : ''}
    </div>
    <div class="hero__body">
      <div class="hero__title">
        <h1>${rich(d.title)}</h1>
        ${d.subtitle ? `<p>${rich(d.subtitle)}</p>` : ''}
      </div>
      ${stats ? `<div class="hero__stats">${stats}</div>` : ''}
    </div>
  </div>
</section>`;
  },
  client(d) {
    return section(`<h2>${esc(d.title)}</h2><p class="muted">${rich(d.text)}</p>`);
  },
  goals(d) { return bulletsSection(d); },
  tasks(d) { return bulletsSection(d); },
  creatives(d) {
    const slots = (d.images && d.images.length) ? d.images : [''];
    const inner = slots.map(s => s
      ? `<img src="${s}" alt="">`
      : `<div class="ph">Изображение креатива</div>`).join('');
    return section(`<h2>${esc(d.title)}</h2><div class="grid-img">${inner}</div>`);
  },
  tools(d) {
    const chips = (d.chips || []).filter(Boolean).map(c => `<span class="chip">${esc(c)}</span>`).join('');
    const hl = (d.highlights || []).filter(h => h.label || h.value).map(h =>
      `<div class="highlight"><b>${esc(h.label)}</b><span>${esc(h.value)}</span></div>`).join('');
    return section(`<h2>${esc(d.title)}</h2>
      <div class="tags">${chips}</div>
      ${hl ? `<div class="highlights">${hl}</div>` : ''}`);
  },
  channels(d) {
    const col = (title, arr) => `<div><h3>${esc(title)}</h3><div class="tags">${
      (arr || []).filter(Boolean).map(c => `<span class="chip">${esc(c)}</span>`).join('')}</div></div>`;
    const noteStyle = d.noteColor ? ` style="color:${esc(d.noteColor)}"` : '';
    return section(`<div class="two-col">${col(d.channelsTitle, d.channels)}${col(d.formatsTitle, d.formats)}</div>
      ${d.note ? `<div class="note"${noteStyle}>${rich(d.note)}</div>` : ''}`);
  },
  audience(d) {
    const chips = (d.chips || []).filter(Boolean).map(c => `<span class="chip">${esc(c)}</span>`).join('');
    return section(`<h2>${esc(d.title)}</h2><p class="muted">${rich(d.text)}</p>
      ${chips ? `<div class="tags" style="margin-top:18px">${chips}</div>` : ''}`);
  },
  strategy(d) {
    const paras = (d.paragraphs || []).filter(Boolean).map(p => `<p class="muted">${rich(p)}</p>`).join('');
    const items = (d.items || []).filter(Boolean);
    const bStyle = d.bulletColor ? ` style="--bullet:${esc(d.bulletColor)}"` : '';
    const list = items.length ? `<ul class="bullets bullets--mt"${bStyle}>${
      items.map(i => `<li>${rich(i)}</li>`).join('')}</ul>` : '';
    return section(`<h2>${esc(d.title)}</h2>${paras}${list}`);
  },
  results(d) {
    const paras = (d.paragraphs || []).filter(Boolean).map(p => `<p class="muted">${rich(p)}</p>`).join('');
    const items = (d.items || []).filter(Boolean);
    const bStyle = d.bulletColor ? ` style="--bullet:${esc(d.bulletColor)}"` : '';
    const bullets = items.length
      ? `<ul class="bullets bullets--mt"${bStyle}>${items.map(i => `<li>${rich(i)}</li>`).join('')}</ul>` : '';
    const cards = arr => `<div class="metrics">${(arr || []).filter(m => m.value || m.label).map(m =>
      `<div class="metric"><span>${esc(m.label)}</span><b>${esc(m.value)}</b></div>`).join('')}</div>`;
    const banners = (d.bannerMetrics || []).filter(m => m.value || m.label).length
      ? `<h3 class="banners-title">${esc(d.bannersTitle)}</h3>${cards(d.bannerMetrics)}` : '';
    const paragraphs = String(d.quoteText || '').split(/\n\s*\n/).filter(p => p.trim());
    const quote = d.quoteText ? `
      <div class="quote">
        ${QUOTE_MARK_UP}
        <div class="quote__text">${paragraphs.map(p => `<p style="margin:0">${rich(p)}</p>`).join('')}</div>
        ${QUOTE_MARK_DOWN}
        <div class="quote__author">
          ${d.quoteAvatar ? `<img class="quote__avatar" src="${d.quoteAvatar}" alt="">` : `<span class="quote__avatar"></span>`}
          <div><div class="quote__name">${esc(d.quoteAuthor)}</div><div class="quote__role">${esc(d.quoteRole)}</div></div>
        </div>
      </div>` : '';
    return section(`<h2>${esc(d.title)}</h2>${paras}${bullets}${cards(d.metrics)}${banners}${quote}`);
  },
  form(d) {
    return section(`
      <div class="formcard">
        <h2>${esc(d.title)}</h2>
        <p class="muted">${nl2br(d.subtitle)}</p>
        <form class="formgrid" novalidate>
          <div class="field-wrap"><input type="text" name="name" placeholder="Имя*" autocomplete="name" required><span class="form-err"></span></div>
          <div class="field-wrap"><div class="phone-row"><select class="phone-cc" name="phone_cc" aria-label="Код страны"></select><input type="tel" name="phone" inputmode="tel" placeholder="(___) ___-__-__" autocomplete="tel" required></div><span class="form-err"></span></div>
          <div class="field-wrap full"><input type="email" name="email" inputmode="email" placeholder="E-mail*" autocomplete="email" required><span class="form-err"></span></div>
          <textarea class="full" placeholder="Комментарий"></textarea>
          <div class="full"><button class="btn-accent" type="submit">${esc(d.button)}</button></div>
        </form>
      </div>`);
  },
  cases(d) {
    const cards = (d.cards || []).map(c => {
      const accent = c.color || '#F93790';
      const tagText = c.tagText || '#F8F9FF';
      const metrics = [[c.m1, c.l1], [c.m2, c.l2], [c.m3, c.l3]].filter(m => m[0]).map(m =>
        `<div class="case__metric"><span>${esc(m[1] || '')}</span><b style="color:${esc(accent)}">${esc(m[0])}</b></div>`).join('');
      const href = c.url ? esc(c.url) : '#';
      return `
      <article class="case">
        <div class="case__img" ${bg(c.image)}>
          ${c.tag ? `<span class="case__tag" style="background:${esc(accent)};color:${esc(tagText)}">${esc(c.tag)}</span>` : ''}
          ${c.title ? `<div class="case__title">${esc(c.title)}</div>` : ''}
        </div>
        <div class="case__body">
          ${metrics ? `<div class="case__metrics">${metrics}</div>` : ''}
          ${c.button ? `<a class="case__btn" href="${href}" target="_blank" rel="noopener">${esc(c.button)}</a>` : ''}
        </div>
      </article>`;
    }).join('');
    // Стрелки рендерим при >1 кейса; реальная видимость зависит от переполнения (JS) —
    // так слайдер работает и на мобильных, где виден один слайд.
    const nav = (d.cards || []).length > 1 ? `<div class="cases__nav" style="display:none">
      <button class="cases__arrow" type="button" data-dir="-1" aria-label="Назад">${CHEVRON_LEFT}</button>
      <button class="cases__arrow" type="button" data-dir="1" aria-label="Вперёд">${CHEVRON_RIGHT}</button>
    </div>` : '';
    return section(`<div class="cases">
      <div class="cases-head"><h2>${esc(d.title)}</h2>${nav}</div>
      <div class="cases-track">${cards}</div>
    </div>`);
  },
};

function section(inner) { return `<section class="section reveal"><div class="container">${inner}</div></section>`; }
function bulletsSection(d) {
  const items = (d.items || []).filter(Boolean);
  const style = d.bulletColor ? ` style="--bullet:${esc(d.bulletColor)}"` : '';
  return section(`<h2>${esc(d.title)}</h2><ul class="bullets"${style}>${
    items.map(i => `<li>${rich(i)}</li>`).join('')}</ul>`);
}

const REVEAL_SCRIPT = [
  '<script>',
  '(function(){',
  '  var els=document.querySelectorAll(".reveal");',
  '  if(!("IntersectionObserver" in window)){els.forEach(function(e){e.classList.add("is-visible");});return;}',
  '  var io=new IntersectionObserver(function(entries){',
  '    entries.forEach(function(en){ if(en.isIntersecting){en.target.classList.add("is-visible");io.unobserve(en.target);} });',
  '  },{threshold:0.12,rootMargin:"0px 0px -40px 0px"});',
  '  els.forEach(function(e){io.observe(e);});',
  '})();',
  '<\/script>',
].join('\n');

const CASES_SCRIPT = [
  '<script>',
  '(function(){',
  '  function setup(box){',
  '    var track=box.querySelector(".cases-track");',
  '    var nav=box.querySelector(".cases__nav");',
  '    if(!track) return;',
  '    function sync(){ if(nav){ nav.style.display=(track.scrollWidth-track.clientWidth>4)?"flex":"none"; } }',
  '    box.querySelectorAll(".cases__arrow").forEach(function(btn){',
  '      btn.addEventListener("click",function(){',
  '        track.scrollBy({left:track.clientWidth*Number(btn.getAttribute("data-dir")),behavior:"smooth"});',
  '      });',
  '    });',
  '    sync();',
  '    window.addEventListener("resize",sync);',
  '  }',
  '  document.querySelectorAll(".cases").forEach(setup);',
  '})();',
  '<\/script>',
].join('\n');

const FORM_SCRIPT = [
  '<script>',
  '(function(){',
  '  var reEmail=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;',
  '  var reName=/^[A-Za-zА-Яа-яЁё]+(?:[ -][A-Za-zА-Яа-яЁё]+)*$/;',
  '  var COUNTRIES=[',
  '    {f:"🇷🇺",c:"Россия",d:"7",n:10,x:10,m:"ru"},',
  '    {f:"🇰🇿",c:"Казахстан",d:"7",n:10,x:10,m:"ru"},',
  '    {f:"🇺🇦",c:"Украина",d:"380",n:9,x:9},',
  '    {f:"🇧🇾",c:"Беларусь",d:"375",n:9,x:9},',
  '    {f:"🇺🇸",c:"США / Канада",d:"1",n:10,x:10},',
  '    {f:"🇬🇧",c:"Великобритания",d:"44",n:10,x:10},',
  '    {f:"🇩🇪",c:"Германия",d:"49",n:10,x:11},',
  '    {f:"🇫🇷",c:"Франция",d:"33",n:9,x:9},',
  '    {f:"🇮🇹",c:"Италия",d:"39",n:9,x:10},',
  '    {f:"🇪🇸",c:"Испания",d:"34",n:9,x:9},',
  '    {f:"🇵🇱",c:"Польша",d:"48",n:9,x:9},',
  '    {f:"🇹🇷",c:"Турция",d:"90",n:10,x:10},',
  '    {f:"🇦🇪",c:"ОАЭ",d:"971",n:9,x:9},',
  '    {f:"🇮🇳",c:"Индия",d:"91",n:10,x:10},',
  '    {f:"🇨🇳",c:"Китай",d:"86",n:11,x:11},',
  '    {f:"🇬🇪",c:"Грузия",d:"995",n:9,x:9},',
  '    {f:"🇦🇿",c:"Азербайджан",d:"994",n:9,x:9},',
  '    {f:"🇺🇿",c:"Узбекистан",d:"998",n:9,x:9},',
  '    {f:"🇰🇬",c:"Киргизия",d:"996",n:9,x:9},',
  '    {f:"🇦🇲",c:"Армения",d:"374",n:8,x:8}',
  '  ];',
  '  function setErr(i,msg){',
  '    var b=i.closest(".field-wrap"); if(!b) return;',
  '    var e=b.querySelector(".form-err"); if(e) e.textContent=msg||"";',
  '    i.classList.toggle("is-invalid",!!msg);',
  '  }',
  '  function digits(v){ return (v.match(/\\d/g)||[]).length; }',
  '  function maskNational(co,raw){',
  '    var d=raw.replace(/\\D/g,"").slice(0,co.x);',
  '    if(!d) return "";',
  '    if(co.m==="ru"){',
  '      var out="";',
  '      if(d.length)    out+="("+d.slice(0,3);',
  '      if(d.length>=3) out+=")";',
  '      if(d.length>3)  out+=" "+d.slice(3,6);',
  '      if(d.length>6)  out+="-"+d.slice(6,8);',
  '      if(d.length>8)  out+="-"+d.slice(8,10);',
  '      return out;',
  '    }',
  '    return d.replace(/(\\d{3})(?=\\d)/g,"$1 ").trim().replace(/ (\\d)$/,"$1");',
  '  }',
  '  document.querySelectorAll(".formgrid").forEach(function(form){',
  '    var name=form.querySelector("[name=name]");',
  '    var phone=form.querySelector("[name=phone]");',
  '    var cc=form.querySelector("[name=phone_cc]");',
  '    var email=form.querySelector("[name=email]");',
  '    if(cc && !cc.options.length){',
  '      COUNTRIES.forEach(function(co,idx){',
  '        var o=document.createElement("option");',
  '        o.value=String(idx); o.textContent=co.f+" +"+co.d; o.title=co.c;',
  '        cc.appendChild(o);',
  '      });',
  '      cc.value="0";',
  '    }',
  '    function country(){ return COUNTRIES[(cc&&cc.value|0)||0]; }',
  '    function vName(){ var v=name.value.trim(); if(!v){setErr(name,"Укажите имя");return false;} if(!reName.test(v)){setErr(name,"Только буквы (без цифр и символов)");return false;} setErr(name,""); return true; }',
  '    function vPhone(){ var co=country(),d=digits(phone.value); if(d<co.n||d>co.x){setErr(phone,"Введите телефон полностью");return false;} setErr(phone,""); return true; }',
  '    function vEmail(){ if(!reEmail.test(email.value.trim())){setErr(email,"Укажите корректный e-mail");return false;} setErr(email,""); return true; }',
  '    if(name){',
  '      name.addEventListener("input",function(){ name.value=name.value.replace(/[^A-Za-zА-Яа-яЁё \\-]/g,"").replace(/\\s{2,}/g," ").replace(/^\\s+/,""); setErr(name,""); });',
  '      name.addEventListener("blur",vName);',
  '    }',
  '    if(phone){',
  '      phone.addEventListener("input",function(){ phone.value=maskNational(country(),phone.value); setErr(phone,""); });',
  '      phone.addEventListener("blur",vPhone);',
  '      if(cc) cc.addEventListener("change",function(){ phone.value=maskNational(country(),phone.value); setErr(phone,""); phone.focus(); });',
  '    }',
  '    if(email){',
  '      email.addEventListener("input",function(){ email.value=email.value.replace(/[^a-zA-Z0-9@._%+\\-]/g,""); setErr(email,""); });',
  '      email.addEventListener("blur",vEmail);',
  '    }',
  '    form.addEventListener("submit",function(e){',
  '      e.preventDefault();',
  '      var ok=true;',
  '      if(name&&!vName()) ok=false;',
  '      if(phone&&!vPhone()) ok=false;',
  '      if(email&&!vEmail()) ok=false;',
  '      if(ok){ form.reset(); if(cc) cc.value="0"; alert("Заявка отправлена!"); }',
  '    });',
  '  });',
  '})();',
  '<\/script>',
].join('\n');

function generateHTML() {
  const parts = [];
  SCHEMA.forEach(block => {
    if (!on(block.id)) return;
    const fn = SECTION[block.id];
    if (fn) parts.push(fn(state.blocks[block.id]));
  });

  const title = state.blocks.hero.enabled
    ? (state.blocks.hero.title || 'Кейс')
    : (state.blocks.client.title || 'Страница');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Макет использует шрифт Gilroy (платный). Если он установлен в системе — применится он; иначе ближайшая бесплатная замена Manrope. -->
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${generatedCSS()}</style>
</head>
<body>
${parts.join('\n')}
${REVEAL_SCRIPT}
${CASES_SCRIPT}
${on('form') ? FORM_SCRIPT : ''}
</body>
</html>`;
}

/* =========================================================
   ПРЕВЬЮ + СКАЧИВАНИЕ
   ========================================================= */
const frame = document.getElementById('previewFrame');
function updatePreview() {
  frame.srcdoc = generateHTML();
}
const schedulePreview = debounce(updatePreview, 450);

document.getElementById('btnPreview').addEventListener('click', updatePreview);
document.getElementById('previewWidth').addEventListener('change', e => {
  frame.style.width = e.target.value;
});
document.getElementById('btnDownload').addEventListener('click', () => {
  const blob = new Blob([generateHTML()], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'case-page.html';
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

/* ---------- Инициализация ---------- */
buildDefaultState();
renderColors();
renderBlocks();
updatePreview();
