import { makeAutoObservable } from 'mobx';

class PayStore {
  payApproved = '';
  cancelReason = '';
  canceledAt = '';
  orderId = '';
  orderName = '';
  payMethod = '';
  price = '';
  useCount = '';
  userId = '';
  paySecret = '';

  constructor() {
    makeAutoObservable(this);
  }
  
  // 초기화 함수 추가
  initializePayStore() {
    this.payApproved = '';
    this.cancelReason = '';
    this.canceledAt = '';
    this.orderId = '';
    this.orderName = '';
    this.payMethod = '';
    this.price = '';
    this.useCount = '';
    this.userId = '';
    this.paySecret = '';
  }
  setPayApproved(payApproved) {
    this.payApproved = payApproved;
  }

  setCancelReason(cancelReason) {
    this.cancelReason = cancelReason;
  }

  setCanceledAt(canceledAt) {
    this.canceledAt = canceledAt;
  }

  setOrderId(orderId) {
    this.orderId = orderId;
  }

  setOrderName(orderName) {
    this.orderName = orderName;
  }

  setPayMethod(payMethod) {
    this.payMethod = payMethod;
  }

  setPrice(price) {
    this.price = price;
  }

  setUseCount(useCount) {
    this.useCount = useCount;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  setPaySecret(paySecret) {
    this.paySecret = paySecret;
  }

}

const payStore = new PayStore();
export default payStore;