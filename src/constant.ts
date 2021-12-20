const LOGIN = (code: string) => `https://shop.samsung.com/vn/multistore/vnepp/${code}/login/multistore`;
export const WISH_LIST = (code: string) => `https://shop.samsung.com/vn/multistore/vnepp/${code}/my-account/wishlist`;
export const CART = (code: string) => `https://shop.samsung.com/vn/multistore/vnepp/${code}/cart`;
export const API_CART_PRODUCTS = (code: string) => `https://shop.samsung.com/vn/multistore/vnepp/${code}/checkout/info`;
export const PAY_PAGE = (code: string) => `https://shop.samsung.com/vn/multistore/vnepp/${code}/checkout/multi/delivery-address/add`;

export enum _ {
  _notNowChangePass = 'div.under-content > div > button.one-cancel.one-button',
  URL = 'https://sshop.vn',
  _notNow = '#btnNotNow',
  _removeItem = '.remove-item',
  _gotoLoginBtn = '.form-group.col-sm-12.col-md-6.col-md-offset-3.text-center',
  _emailInput = 'input[type="email"]',
  _passInput = 'input[type="password"]',
  _loginBtn = '.one-cancel.one-button',
  _verifyInput = '#site',
  _gotoBtn = '#btn-goto',
  _wishList = 'a[data-omni="wish list"]',
  _addAll = '.btn-add-all-wishlist',
  _gotoPayBtn = '.mini-cart-checkout-button',
  _minusBtn = '.btn-qty-minus',
  _checkOutBtn = '.checkoutButton',
  _checkboxes = 'input.checkbox-input',
  _accept = '#CHECKOUT_OPTIONS > div:nth-child(2) > div.form-group > label',
  _continueBtn = '.btn-default.btn-details-fixed',
  // _continueBtn = 'div > div > button',
  _addr = '[for="CHECKOUT_SHIPPING_ADDRESS_vn-savedAddress_option_shipping"]',
  _fullName = '#CHECKOUT_SHIPPING_ADDRESS_vn-s_fullName_field',
  _phoneNumber = '#CHECKOUT_SHIPPING_ADDRESS_vn-s_phoneNumber_field',
  _options = 'select[ng-if="showSSavedAddress"] option',
  _errItem = '.checkout-delivery-error-products-title span[class="ng-binding',
  _orderItem = '.order-item',
  _submitCheckOutBtn = 'button[ng-click="stepCustomerDetailsSubmit()',
}

const helpMessage = `
Say something to me
/add - mo them trinh duyet
/set <number> <code> <taikhoan> <matkhau> - doi ma xac nhan, taikhoan, matkhau cho trinh duyet
/list - hien thi danh sach trinh duyet dang chay
/check <number> - bat dau tu dong dang nhap check hang
/mute <ma_san_pham> - bo qua ko thong bao san pham
/stop <number> - dong trinh duyet
/help - huong dan
`;

const allCommandDes = [
  '/start - start the bot',
  '/help - command reference',
  '/echo <message> - echo message',
];

enum COMAND {
  ECHO = 'echo',
  IMAGE = 'image',
  IMAGES = 'images',
  DOC = 'document',
  HOME = 'home',
  CAT = 'cat',
  PLAY = 'play',
}

export { allCommandDes, helpMessage, COMAND, LOGIN };
