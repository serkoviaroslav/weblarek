import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { LarekApi } from './api/LarekApi';

import { ProductsModel } from './models/ProductsModel';
import { CartModel } from './models/CartModel';
import { OrderModel } from './models/OrderModel';

const events = new EventEmitter();

const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi);

const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events, (id) => productsModel.getById(id));
const orderModel = new OrderModel(events);

events.on('products:changed', (data) =>
  console.log('[products:changed]', data)
);
events.on('cart:changed', (data) =>
  console.log('[cart:changed]', data)
);
events.on('order:changed', (data) =>
  console.log('[order:changed]', data)
);

api.getProducts()
  .then((res) => {
    console.log('[API] products loaded:', res.items.length);
    productsModel.setProducts(res.items);

    const firstId = res.items[0]?.id;
    if (!firstId) return;

    cartModel.add(firstId);
    console.log('has:', cartModel.has(firstId));
    console.log('ids:', cartModel.getIds());
    console.log('items:', cartModel.getItems());
    console.log('count:', cartModel.getCount());
    console.log('total:', cartModel.getTotal());

    cartModel.remove(firstId);
    cartModel.clear();

    console.log('order validate step1:', orderModel.validateStep1());
    console.log('order validate step2:', orderModel.validateStep2());

    orderModel.setPayment('card');
    orderModel.setAddress('Test address');
    orderModel.setContacts('test@mail.com', '123');

    console.log('order validate step1 filled:', orderModel.validateStep1());
    console.log('order validate step2 filled:', orderModel.validateStep2());
  })
  .catch((err) => console.error(err));
