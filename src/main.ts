import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { API_URL } from './utils/constants';
import { LarekApi } from './api/LarekApi';
import { ProductsModel } from './models/ProductsModel';
import { CartModel } from './models/CartModel';
import { OrderModel } from './models/OrderModel';

const events = new EventEmitter();
const api = new LarekApi(API_URL);

const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events, (id) => productsModel.getById(id));
const orderModel = new OrderModel(events);

console.log('// cart.clear() — очищаем корзину');
cartModel.clear();

console.log('// order.clear() — очищаем данные покупателя');
orderModel.clear();

events.on('products:changed', (data) => console.log('[products:changed] Каталог обновился:', data));
events.on('cart:changed', (data) => console.log('[cart:changed] Корзина обновилась:', data));
events.on('order:changed', (data) => console.log('[order:changed] Данные заказа обновились:', data));

api.getProducts()
  .then((res) => {
    console.log('[API] Получили товары с сервера (items.length):', res.items.length);
    productsModel.setProducts(res.items);

    const firstId = res.items[0]?.id;
    if (firstId) {
      console.log('// cart.add(firstId) — добавляем первый товар в корзину');
      cartModel.add(firstId);

      console.log('// cart.has(firstId) — проверяем наличие:', cartModel.has(firstId));

      console.log('// cart.remove(firstId) — удаляем товар');
      cartModel.remove(firstId);
    }

    console.log('// order.setPayment("card") и order.setAddress("...")');
    orderModel.setPayment('card');
    orderModel.setAddress('Warsaw, ul. Testowa 1');
    console.log('// order.isStep1Valid():', orderModel.isStep1Valid());

    console.log('// order.setContacts("mail", "phone")');
    orderModel.setContacts('test@example.com', '+48 000 000 000');
    console.log('// order.isStep2Valid():', orderModel.isStep2Valid());
  })
  .catch((err) => console.error('[API] Ошибка при загрузке товаров:', err));
