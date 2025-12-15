````md
# Проектная работа «Веб-ларёк»

Стек: HTML, SCSS, TypeScript, Vite

---

## Структура проекта

- src/ — исходные файлы проекта  
- src/components/ — UI-компоненты приложения  
- src/components/base/ — базовый код (Component, Api, EventEmitter)  
- src/models/ — модели данных приложения  
- src/api/ — клиент для взаимодействия с сервером  
- src/types/ — типы и интерфейсы TypeScript  
- src/utils/ — утилиты и константы  
- src/scss/ — стили приложения  

### Важные файлы
- index.html — HTML-файл главной страницы  
- src/main.ts — точка входа приложения  
- src/types/index.ts — типы данных  
- src/utils/constants.ts — константы  
- src/scss/styles.scss — корневой файл стилей  

---

## Установка и запуск

```bash
npm install
npm run dev
```

---

## Сборка проекта

```bash
npm run build
```

---

## Интернет-магазин «Web-Larёk»

«Web-Larёk» — интернет-магазин с товарами для веб-разработчиков. Пользователь может просматривать каталог товаров, добавлять их в корзину и оформлять заказ. Взаимодействие с пользователем происходит через модальные окна.

---

## Архитектура приложения

Приложение построено с использованием архитектурного паттерна MVP (Model–View–Presenter).

Model — слой данных, отвечает за хранение и обработку данных.
View — слой представления, отвечает за отображение интерфейса.
Presenter — слой логики, связывает модели данных и представления.

Взаимодействие между слоями реализовано с помощью событийно-ориентированного подхода. Для передачи событий используется брокер событий EventEmitter.

---

## Базовый код

### Класс Component

Базовый класс для всех UI-компонентов.

Конструктор:
constructor(container: HTMLElement)

Поля:

* container: HTMLElement — корневой DOM-элемент компонента.

Методы:

* render(data?: Partial<T>): HTMLElement — отображает данные в компоненте.
* setImage(element: HTMLImageElement, src: string, alt?: string): void — утилитарный метод для img.

---

### Класс Api

Базовый класс для работы с HTTP-запросами.

Конструктор:
constructor(baseUrl: string, options: RequestInit = {})

Методы:

* get(uri: string): Promise<object> — выполняет GET-запрос.
* post(uri: string, data: object, method?: ApiPostMethods): Promise<object> — выполняет POST/PUT/DELETE-запрос.
* handleResponse(response: Response): Promise<object> — обрабатывает ответ сервера.

---

### Класс EventEmitter

Реализует паттерн «Наблюдатель» и используется для обмена событиями между частями приложения.

Методы:

* on(event, callback) — подписка на событие.
* emit(event, data?) — генерация события.
* trigger(event, context?) — генератор обработчиков.

---

## Данные

В приложении используются две основные сущности данных: товар и покупатель.

### Интерфейсы данных

#### Товар (IProduct)

```ts
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

Если значение price равно null, товар считается недоступным для покупки.

---

#### Покупатель (IBuyer)

```ts
interface IBuyer {
  payment: 'card' | 'cash' | null;
  email: string;
  phone: string;
  address: string;
}
```

Интерфейс описывает данные покупателя, вводимые при оформлении заказа.

---

## Модели данных

Для работы с данными реализованы три модели данных. Каждая модель отвечает за свою зону ответственности и не зависит от слоя представления. Модели данных не создают зависимости внутри себя (не используют new для других моделей/сервисов). Все зависимости передаются через конструктор (Dependency Injection).

---

### Каталог товаров (ProductsModel)

Назначение: хранение и управление списком товаров.

Конструктор:
constructor(events: IEvents)

Поля:

* products: IProduct[] — массив товаров каталога.

Методы:

* setProducts(products: IProduct[]): void — сохраняет товары.
* getAll(): IProduct[] — возвращает все товары.
* getById(id: string): IProduct | undefined — возвращает товар по id.

---

### Корзина (CartModel)

Назначение: хранение идентификаторов товаров, выбранных пользователем, с возможностью получения данных товаров из каталога, и расчёт их стоимости.

Конструктор:
constructor(events: IEvents, resolveProduct: (id: string) => IProduct | undefined)

Поля:

* itemIds: Set<string> — идентификаторы товаров в корзине.

Методы:

* add(id: string): void — добавить товар.
* remove(id: string): void — удалить товар.
* clear(): void — очистить корзину.
* getItems(): IProduct[] — получить товары корзины.
* getTotal(): number — получить общую стоимость.
* getCount(): number — получить количество товаров.
* has(id: string): boolean — проверить наличие товара.

---

### Покупатель / Заказ (OrderModel)

Назначение: хранение данных покупателя, валидация и формирование заказа.

Конструктор:
constructor(events: IEvents)

Поля:

* form: IBuyer — данные покупателя.

Методы:

* setPayment(payment): void — сохранить способ оплаты.
* setAddress(address: string): void — сохранить адрес.
* setContacts(email: string, phone: string): void — сохранить контакты.
* getForm(): IBuyer — получить данные покупателя.
* clear(): void — очистить данные.
* isStep1Valid(): boolean — валидация первого шага.
* isStep2Valid(): boolean — валидация второго шага.

---

Работа с данными реализована с соблюдением принципов изолированности, единственной ответственности и масштабируемости архитектуры.

```
```
## Слой коммуникации

Для взаимодействия с сервером в приложении реализован коммуникационный слой.
Он отвечает за получение данных о товарах и отправку данных о заказе.

### Класс LarekApi

**Назначение:**  
Класс инкапсулирует логику работы с API сервера и использует базовый класс Api
через композицию.

**Конструктор:**  
`constructor(baseUrl: string)`  
- `baseUrl` — базовый адрес API сервера.

**Методы:**
- `getProducts(): Promise<IProductsResponse>`  
  Выполняет GET-запрос на эндпоинт `/product` и возвращает массив товаров.
- `postOrder(order: IOrderRequest): Promise<IOrderResponse>`  
  Выполняет POST-запрос на эндпоинт `/order` и отправляет данные заказа на сервер.