// Shopping Cart Engine implementing Hashmap, Linked List, Undo/Redo Stacks, Queue, and Priority Queue

import { INITIAL_PRODUCT_CATALOG } from '../data/shoppingCartData';

export class ShoppingCartEngine {
  constructor() {
    this.reset();
  }

  reset() {
    // Hashmap (id -> Product)
    this.catalog = new Map();
    INITIAL_PRODUCT_CATALOG.forEach(p => this.catalog.set(p.id, { ...p }));

    // Linked List (Cart Items)
    this.cart = [];

    // Stacks
    this.undoStack = [];
    this.redoStack = [];

    // Queue (FIFO Customers)
    this.checkoutQueue = [];

    // Priority Queue Max-Heap (Discounts)
    this.discounts = [];

    // State History Trace Table
    this.stepCount = 0;
    this.historyTrace = [];
    this.lastMessage = 'System initialized with sample product catalog.';
  }

  recordSnapshot(operationName) {
    this.stepCount++;

    const cartStr = this.cart.length > 0
      ? this.cart.map(item => `${item.product.name} ×${item.quantity}`).join(', ')
      : '(empty)';

    const undoStr = this.undoStack.length > 0
      ? this.undoStack.slice().reverse().map(act => `${act.type} ${act.item.product.name}`).join(', ')
      : '—';

    const redoStr = this.redoStack.length > 0
      ? this.redoStack.slice().reverse().map(act => `${act.type} ${act.item.product.name}`).join(', ')
      : '—';

    const queueStr = this.checkoutQueue.length > 0
      ? this.checkoutQueue.join(', ')
      : '—';

    const discountStr = this.discounts.length > 0
      ? this.discounts.slice().sort((a, b) => b - a).join('%, ') + '%'
      : '—';

    this.historyTrace.push({
      step: this.stepCount,
      operation: operationName,
      cart: cartStr,
      undoStack: undoStr,
      redoStack: redoStr,
      queue: queueStr,
      discounts: discountStr
    });
  }

  // --- HASHMAP: Product Catalog ---
  getProduct(id) {
    return this.catalog.get(id) || null;
  }

  addProductToCatalog(id, name, price) {
    this.catalog.set(id, { id, name, price });
    this.lastMessage = `Added Product ID ${id} (${name}, ₹${price}) to catalog hashmap.`;
  }

  // --- LINKED LIST: Add to Cart ---
  addToCart(productId, quantity) {
    const product = this.catalog.get(productId);
    if (!product) {
      this.lastMessage = `Error: Product ID ${productId} not found in Hashmap!`;
      return false;
    }

    const newItem = { product, quantity };
    this.cart.push(newItem);

    // Push action to Undo stack & clear Redo history
    this.undoStack.push({ type: 'ADD', item: newItem });
    this.redoStack = [];

    this.lastMessage = `Added ${product.name} ×${quantity} to cart (Linked List).`;
    this.recordSnapshot(`Add Product ID ${productId} (${product.name} ×${quantity})`);
    return true;
  }

  // --- LINKED LIST: Remove Last Item ---
  removeLastItem() {
    if (this.cart.length === 0) {
      this.lastMessage = 'Cart is empty! Nothing to remove.';
      return false;
    }

    const removed = this.cart.pop();
    this.undoStack.push({ type: 'REMOVE', item: removed });
    this.redoStack = [];

    this.lastMessage = `Removed ${removed.product.name} from cart.`;
    this.recordSnapshot(`Remove ${removed.product.name}`);
    return true;
  }

  // --- STACK: Undo Action ---
  undoAction() {
    if (this.undoStack.length === 0) {
      this.lastMessage = 'No actions to undo on Undo Stack.';
      return false;
    }

    const lastAction = this.undoStack.pop();

    if (lastAction.type === 'ADD') {
      // Revert ADD -> Remove from cart
      this.cart.pop();
      this.redoStack.push(lastAction);
      this.lastMessage = `Undo: Removed ${lastAction.item.product.name} from cart.`;
    } else if (lastAction.type === 'REMOVE') {
      // Revert REMOVE -> Re-add to cart
      this.cart.push(lastAction.item);
      this.redoStack.push(lastAction);
      this.lastMessage = `Undo: Re-added ${lastAction.item.product.name} back into cart.`;
    }

    this.recordSnapshot(`Undo Action (${lastAction.type} ${lastAction.item.product.name})`);
    return true;
  }

  // --- STACK: Redo Action ---
  redoAction() {
    if (this.redoStack.length === 0) {
      this.lastMessage = 'No actions to redo on Redo Stack.';
      return false;
    }

    const lastAction = this.redoStack.pop();

    if (lastAction.type === 'ADD') {
      this.cart.push(lastAction.item);
      this.undoStack.push(lastAction);
      this.lastMessage = `Redo: Re-added ${lastAction.item.product.name} to cart.`;
    } else if (lastAction.type === 'REMOVE') {
      this.cart.pop();
      this.undoStack.push(lastAction);
      this.lastMessage = `Redo: Removed ${lastAction.item.product.name} from cart.`;
    }

    this.recordSnapshot(`Redo Action (${lastAction.type} ${lastAction.item.product.name})`);
    return true;
  }

  // --- QUEUE: Enqueue Checkout Customer ---
  enqueueCustomer(name) {
    if (!name || name.trim() === '') return false;
    this.checkoutQueue.push(name.trim());
    this.lastMessage = `Customer ${name} added to Checkout Queue (FIFO).`;
    this.recordSnapshot(`Checkout ${name}`);
    return true;
  }

  // --- QUEUE: Process Dequeue Checkout ---
  processCheckout() {
    if (this.checkoutQueue.length === 0) {
      this.lastMessage = 'No customers waiting in Checkout Queue.';
      return false;
    }

    const customer = this.checkoutQueue.shift();
    this.lastMessage = `Processing FIFO checkout for customer: ${customer}`;
    this.recordSnapshot(`Processed ${customer}`);
    return customer;
  }

  // --- PRIORITY QUEUE MAX-HEAP: Add Discount ---
  addDiscount(percent) {
    if (percent <= 0 || percent > 100) return false;
    this.discounts.push(percent);
    // Maintain Max-Heap ordering (sorted descending)
    this.discounts.sort((a, b) => b - a);
    this.lastMessage = `Added ${percent}% discount to Max-Heap Priority Queue.`;
    this.recordSnapshot(`Add Discount ${percent}%`);
    return true;
  }

  // --- PRIORITY QUEUE MAX-HEAP: Apply Best Discount ---
  applyBestDiscount() {
    if (this.discounts.length === 0) {
      this.lastMessage = 'No discounts available in Max-Heap Priority Queue!';
      return null;
    }

    const bestDiscount = this.discounts.shift(); // Max element
    this.lastMessage = `Applied best discount rate: ${bestDiscount}% (Popped from Max-Heap top).`;
    this.recordSnapshot(`Applied Best Discount ${bestDiscount}%`);
    return bestDiscount;
  }

  // Calculates subtotal
  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }
}
