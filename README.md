# Разработка интерфейса для Сервиса межгалактической аналитики

# Тестирование проекта

## 💪 Технологии для тестирования

- **Unit/Component:** `Vitest`, `React Testing Library`
- **E2E:** `Playwright`

## ⚙️ Инструкция по запуску

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск проекта в режиме разработки

```bash
npm run dev
```

### 3. Запуск сервера (необходим для E2E-тестов)

```bash
npm run start
```

### 4. Запуск всех тестов

```bash
npm run test
```

### 5. Запуск тестов по категориям

```bash
npm run test:utils       # Тесты утилит (localStorage и др.)
npm run test:component   # Компонентные и интеграционные тесты
npm run test:e2e         # End-to-End тесты (Playwright)
```

---

## ✅ Модульные тесты (Vitest)

### 📁 `storage.test.ts`

Тестирование утилит для работы с `localStorage`:

- `getHistory()` — возвращает историю или пустой массив
- `addToHistory()` — добавляет элемент в историю
- `removeFromHistory()` — удаляет элемент из истории
- `clearHistory()` — очищает всю историю

---

## 🔗 Интеграционные тесты (Vitest + RTL)

### 📁 `Dropzone.test.tsx`

Тестирование компонента `Dropzone`:

- отображение инструкций при отсутствии файла
- обработка выбора файла через `input` и drag-and-drop
- проверка на тип `.csv` файла
- отображение лоадера при `status="processing"`
- отображение успешного статуса и ошибки

---

### 📁 `FileUploadSection.test.tsx`

Тестирование обертки над Dropzone:

- отображение кнопки "Отправить", если файл выбран
- обработка клика по кнопке отправки
- скрытие кнопки при `processing`

---

### 📁 `ClearHistoryButton.test.tsx`

- удаляет историю и вызывает `clearHistory()` при нажатии
- отображает кнопку при наличии истории
- не отображает кнопку при пустой истории

---

### 📁 `GeneratePage.test.tsx`

- отображает заголовок и кнопку
- обработка успешной генерации: отчет, blob-ссылка
- обработка ошибки: текст ошибки

---

### 📁 `HistoryList.test.tsx`

- рендерит элементы истории при наличии
- не рендерит ничего, если история пуста

---

### 📁 `HighlightsSection.test.tsx`

- отображает плейсхолдер при отсутствии данных
- корректно отображает хайлайты

---

### 📁 `generate+history.integration.test.tsx`

- сценарий: страница истории переходит на страницу генерации

---

### 📁 `use-csv-analysis.test.ts`

- валидный CSV вызывает `onData`, `onComplete`
- невалидный вызывает `onError`

---

## 🚀 End-to-End тесты (Playwright)

### 📁 `generate.test.ts`

- проверка успешной генерации отчета
- проверка отображения ошибки при неудачном ответе сервера

---

### 📁 `navigation.test.ts`

- проверка переходов по навигации:
  - главная страница
  - страница генерации отчета
  - история генераций

---

### 📁 `mainFlow.test.ts` (если добавите)

> *Пример будущего e2e-теста*

- полный пользовательский сценарий:
  - загрузка файла
  - отображение результатов
  - сохранение в историю
  - очистка истории
  - переход к повторной генерации

---

## 🧪 Полезные советы

- Для стабильной работы e2e убедитесь, что сервер запущен локально (`npm run start`)
- Используйте флаг `--project=chromium` / `--project=firefox` / `--project=webkit` для запуска Playwright в конкретном браузере
- Для отладки e2e добавьте `--debug` или `--headed` в команду запуска

---

## 📂 Структура тестов

```bash
tests/
├── unit/
│   └── storage.test.ts
├── components/
│   ├── Dropzone.test.tsx
│   ├── FileUploadSection.test.tsx
│   ├── ClearHistoryButton.test.tsx
│   ├── HighlightsSection.test.tsx
│   └── HistoryList.test.tsx
├── pages/
│   └── GeneratePage.test.tsx
├── hooks/
│   └── use-csv-analysis.test.ts
├── integration/
│   └── generate+history.integration.test.tsx
└── e2e/
    ├── generate.test.ts
    └── navigation.test.ts
```

---



