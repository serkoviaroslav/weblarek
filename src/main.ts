import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

import { LarekApi } from './api/LarekApi';

import { ProductsModel } from './models/ProductsModel';
import { CartModel } from './models/CartModel';
import { OrderModel } from './models/OrderModel';
import { PreviewModel } from './models/PreviewModel';

import {
  Modal,
  HeaderView,
  GalleryView,
  BasketView,
  SuccessView,
  CatalogCardView,
  PreviewCardView,
  BasketCardView,
  OrderFormView,
  ContactsFormView,
} from './components';

import { API_URL, CDN_URL } from './utils/constants';
import { MODEL_EVENTS, VIEW_EVENTS } from './utils/events';
import type {
  FormChangePayload,
  ProductsChangedPayload,
  CartChangedPayload,
  OrderChangedPayload,
  PreviewChangedPayload,
  CardSelectPayload,
  ProductTogglePayload,
  BasketItemRemovePayload,
  PaymentSelectPayload,
} from './types';

type ModalMode = 'preview' | 'basket' | 'order' | 'contacts' | 'success' | null;

const events = new EventEmitter();

const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi);

// -----------------------------
// Models (single source of truth)
// -----------------------------
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events, (id) => productsModel.getById(id));
const orderModel = new OrderModel(events);
const previewModel = new PreviewModel(events);

// -----------------------------
// Helpers
// -----------------------------
function cloneTemplate(id: string): HTMLElement {
  const template = document.querySelector<HTMLTemplateElement>(`#${id}`);
  if (!template) {
    throw new Error(`Template #${id} not found`);
  }
  const node = template.content.firstElementChild?.cloneNode(true);
  if (!node || !(node instanceof HTMLElement)) {
    throw new Error(`Template #${id} has no root HTMLElement`);
  }
  return node;
}

function toCdnUrl(path: string): string {
  return `${CDN_URL}/${path}`;
}

function errorsToMessages(errors: Record<string, string | undefined>): string[] {
  return Object.values(errors).filter(Boolean) as string[];
}

// -----------------------------
// Views
// -----------------------------
const modal = new Modal(document.querySelector<HTMLElement>('#modal-container')!, events);
const header = new HeaderView(document.querySelector<HTMLElement>('.header')!, events);
const gallery = new GalleryView(document.querySelector<HTMLElement>('.gallery')!);

// Reusable modal contents
const basketView = new BasketView(cloneTemplate('basket'), events);

// ✅ Формы создаются один раз и далее только обновляются
const orderFormView = new OrderFormView(cloneTemplate('order') as HTMLFormElement, events);
const contactsFormView = new ContactsFormView(cloneTemplate('contacts') as HTMLFormElement, events);

let modalMode: ModalMode = null;

// -----------------------------
// Model -> Presenter
// -----------------------------

// Catalog changed -> render gallery
events.on<ProductsChangedPayload>(MODEL_EVENTS.PRODUCTS_CHANGED, ({ products }) => {
  const cards = products.map((product) => {
    const card = new CatalogCardView(cloneTemplate('card-catalog'), events);
    card.setId(product.id);
    card.setTitle(product.title);
    card.setPrice(product.price);
    card.setCategory(product.category);
    card.setImageSource(toCdnUrl(product.image), product.title);
    return card.render();
  });

  gallery.setItems(cards);
});

// Preview changed -> open product modal
events.on<PreviewChangedPayload>(MODEL_EVENTS.PREVIEW_CHANGED, ({ id }) => {
  if (!id) return;

  const product = productsModel.getById(id);
  if (!product) return;

  const card = new PreviewCardView(cloneTemplate('card-preview'), events);
  card.setId(product.id);
  card.setTitle(product.title);
  card.setPrice(product.price);
  card.setCategory(product.category);
  card.setImageSource(toCdnUrl(product.image), product.title);
  card.setActionState(cartModel.has(product.id), product.price);

  modalMode = 'preview';
  modal.open(card.render());
});

// Cart changed -> update header and basket view
events.on<CartChangedPayload>(MODEL_EVENTS.CART_CHANGED, ({ items, total, count }) => {
  header.setCounter(count);

  const rows = items.map((product, index) => {
    const row = new BasketCardView(cloneTemplate('card-basket'), events);
    row.setId(product.id);
    row.setIndex(index + 1);
    row.setTitle(product.title);
    row.setPrice(product.price);
    return row.render();
  });

  basketView.setItems(rows);
  basketView.setTotal(total);
  basketView.setOrderEnabled(count > 0);
  basketView.setEmpty(count === 0);
});

// Order changed -> update forms
events.on<OrderChangedPayload>(MODEL_EVENTS.ORDER_CHANGED, ({ form }) => {
  const step1Errors = orderModel.validateStep1();
  orderFormView.setPayment(form.payment);
  orderFormView.setAddress(form.address);
  orderFormView.setErrors(errorsToMessages(step1Errors));
  orderFormView.setSubmitEnabled(orderModel.isStep1Valid());

  const step2Errors = orderModel.validateStep2();
  contactsFormView.setEmail(form.email);
  contactsFormView.setPhone(form.phone);
  contactsFormView.setErrors(errorsToMessages(step2Errors));
  contactsFormView.setSubmitEnabled(orderModel.isStep2Valid());
});

// -----------------------------
// View -> Presenter
// -----------------------------

events.on<CardSelectPayload>(VIEW_EVENTS.CARD_SELECT, ({ id }) => {
  previewModel.setSelected(id);
});

events.on<ProductTogglePayload>(VIEW_EVENTS.PRODUCT_TOGGLE, ({ id }) => {
  if (cartModel.has(id)) {
    cartModel.remove(id);
  } else {
    cartModel.add(id);
  }

  // Requirement: modal closes after buy/remove
  previewModel.clear();
  modal.close();
});

events.on(VIEW_EVENTS.BASKET_OPEN, () => {
  modalMode = 'basket';
  modal.open(basketView.render());
});

events.on<BasketItemRemovePayload>(VIEW_EVENTS.BASKET_ITEM_REMOVE, ({ id }) => {
  cartModel.remove(id);
});

events.on(VIEW_EVENTS.ORDER_OPEN, () => {
  // Step 1 form (✅ НЕ пересоздаём, только обновляем)
  const { payment, address } = orderModel.getForm();
  orderFormView.setPayment(payment);
  orderFormView.setAddress(address);

  const errors = orderModel.validateStep1();
  orderFormView.setErrors(errorsToMessages(errors));
  orderFormView.setSubmitEnabled(orderModel.isStep1Valid());

  modalMode = 'order';
  modal.open(orderFormView.render());
});

events.on<PaymentSelectPayload>(VIEW_EVENTS.ORDER_PAYMENT_SELECT, ({ payment }) => {
  orderModel.setPayment(payment);
});

events.on(VIEW_EVENTS.ORDER_NEXT, () => {
  if (!orderModel.isStep1Valid()) {
    orderFormView.setErrors(errorsToMessages(orderModel.validateStep1()));
    orderFormView.setSubmitEnabled(false);
    return;
  }

  // Step 2 form (✅ НЕ пересоздаём, только обновляем)
  const { email, phone } = orderModel.getForm();
  contactsFormView.setEmail(email);
  contactsFormView.setPhone(phone);

  const errors = orderModel.validateStep2();
  contactsFormView.setErrors(errorsToMessages(errors));
  contactsFormView.setSubmitEnabled(orderModel.isStep2Valid());

  modalMode = 'contacts';
  modal.open(contactsFormView.render());
});

events.on(VIEW_EVENTS.ORDER_PAY, async () => {
  if (!orderModel.isStep2Valid()) {
    contactsFormView.setErrors(errorsToMessages(orderModel.validateStep2()));
    contactsFormView.setSubmitEnabled(false);
    return;
  }

  const order = orderModel.buildOrder(cartModel.getIds(), cartModel.getTotal());

  try {
    const res = await api.postOrder(order);

    const successView = new SuccessView(cloneTemplate('success'), events);
    successView.setTotal(res.total);

    modalMode = 'success';
    modal.open(successView.render());

    cartModel.clear();
    orderModel.clear();
  } catch (err) {
    console.error(err);
  }
});

events.on(VIEW_EVENTS.SUCCESS_CLOSE, () => {
  modal.close();
});

// Form inputs change
events.on<FormChangePayload>(VIEW_EVENTS.FORM_CHANGE, ({ form, field, value }) => {
  if (form === 'order') {
    if (field === 'address') {
      orderModel.setAddress(value);
    }
    return;
  }

  if (form === 'contacts') {
    if (field === 'email') {
      orderModel.setContacts(value, orderModel.getForm().phone);
    } else if (field === 'phone') {
      orderModel.setContacts(orderModel.getForm().email, value);
    }
  }
});

// Modal close (overlay/close button)
events.on(VIEW_EVENTS.MODAL_CLOSE, () => {
  if (modalMode === 'preview') {
    previewModel.clear();
  }
  modalMode = null;
});

// -----------------------------
// App start
// -----------------------------
api
  .getProducts()
  .then((res) => productsModel.setProducts(res.items))
  .catch((err) => console.error(err));
