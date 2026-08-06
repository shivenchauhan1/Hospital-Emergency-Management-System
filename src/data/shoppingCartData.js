// Data & Content for Shopping Cart Project (Matching PDF PRD Document)

export const INITIAL_PRODUCT_CATALOG = [
  { id: 1, name: 'Laptop', price: 50000 },
  { id: 2, name: 'Phone', price: 20000 },
  { id: 3, name: 'Headphones', price: 2000 },
  { id: 4, name: 'Smartwatch', price: 5000 },
  { id: 5, name: 'Mechanical Keyboard', price: 3500 }
];

export const CPP_SOURCE_CODE = `#include <iostream>
#include <unordered_map>
#include <list>
#include <stack>
#include <queue>
#include <vector>
#include <string>
using namespace std;

// Product structure
struct Product {
    int id;
    string name;
    float price;
};

// Cart Item
struct CartItem {
    Product product;
    int quantity;
};

// Action structure for undo/redo
struct Action {
    string type; // "ADD" or "REMOVE"
    CartItem item;
};

// Global structures
unordered_map<int, Product> catalog; // Product catalog (Hashmap)
list<CartItem> cart;                  // Cart as linked list
stack<Action> undoStack;              // Undo stack
stack<Action> redoStack;              // Redo stack
queue<string> checkoutQueue;          // Checkout queue
priority_queue<int> discounts;        // Max-heap for discounts

// Add product to catalog
void addProduct(int id, string name, float price) {
    catalog[id] = {id, name, price};
}

// Add item to cart
void addToCart(int id, int qty) {
    if(catalog.find(id) == catalog.end()) {
        cout << "Product not found!\\n";
        return;
    }
    CartItem newItem = {catalog[id], qty};
    cart.push_back(newItem);
    undoStack.push({"ADD", newItem});
    while(!redoStack.empty()) redoStack.pop(); // clear redo history
    cout << "Item added to cart.\\n";
}

// Remove last item
void removeLastItem() {
    if(cart.empty()) {
        cout << "Cart is empty!\\n";
        return;
    }
    CartItem removed = cart.back();
    cart.pop_back();
    undoStack.push({"REMOVE", removed});
    while(!redoStack.empty()) redoStack.pop();
    cout << "Removed: " << removed.product.name << endl;
}

// View cart
void viewCart() {
    float total = 0;
    cout << "\\n--- Cart Items ---\\n";
    for(auto &item : cart) {
        cout << item.product.id << " " << item.product.name 
             << " x" << item.quantity 
             << " = " << item.product.price * item.quantity << endl;
        total += item.product.price * item.quantity;
    }
    cout << "Total: " << total << endl;
}

// Undo last action
void undoAction() {
    if(undoStack.empty()) {
        cout << "No actions to undo.\\n";
        return;
    }
    Action last = undoStack.top();
    undoStack.pop();

    if(last.type == "ADD") {
        cart.pop_back();
        cout << "Undo: Removed " << last.item.product.name << endl;
        redoStack.push(last);
    } else if(last.type == "REMOVE") {
        cart.push_back(last.item);
        cout << "Undo: Re-added " << last.item.product.name << endl;
        redoStack.push(last);
    }
}

// Redo last undone action
void redoAction() {
    if(redoStack.empty()) {
        cout << "No actions to redo.\\n";
        return;
    }
    Action last = redoStack.top();
    redoStack.pop();

    if(last.type == "ADD") {
        cart.push_back(last.item);
        cout << "Redo: Re-added " << last.item.product.name << endl;
        undoStack.push(last);
    } else if(last.type == "REMOVE") {
        cart.pop_back();
        cout << "Redo: Removed " << last.item.product.name << endl;
        undoStack.push(last);
    }
}

// Checkout customer
void checkout(string customer) {
    checkoutQueue.push(customer);
    cout << customer << " added to checkout queue.\\n";
}

// Process checkout
void processCheckout() {
    if(checkoutQueue.empty()) {
        cout << "No customers in queue.\\n";
        return;
    }
    cout << "Processing checkout for: " << checkoutQueue.front() << endl;
    checkoutQueue.pop();
}

// Apply discount
void applyDiscount(int discount) {
    discounts.push(discount);
    cout << discount << "% discount added.\\n";
}

void getBestDiscount() {
    if(discounts.empty()) {
        cout << "No discounts available.\\n";
        return;
    }
    cout << "Best discount applied: " << discounts.top() << "%\\n";
    discounts.pop();
}

// Main Menu
int main() {
    // Sample products initialization
    addProduct(1, "Laptop", 50000);
    addProduct(2, "Phone", 20000);
    addProduct(3, "Headphones", 2000);

    int choice;
    do {
        cout << "\\n--- Shopping Cart Menu ---\\n";
        cout << "1. Add to Cart\\n2. Remove Last Item\\n3. View Cart\\n4. Undo Action\\n";
        cout << "5. Redo Action\\n6. Checkout Customer\\n7. Process Checkout\\n";
        cout << "8. Add Discount\\n9. Apply Best Discount\\n10. Exit\\n";
        cout << "Enter choice: ";
        cin >> choice;

        switch(choice) {
            case 1: {
                int id, qty;
                cout << "Enter product ID and quantity: ";
                cin >> id >> qty;
                addToCart(id, qty);
                break;
            }
            case 2: removeLastItem(); break;
            case 3: viewCart(); break;
            case 4: undoAction(); break;
            case 5: redoAction(); break;
            case 6: {
                string name;
                cout << "Enter customer name: ";
                cin >> name;
                checkout(name);
                break;
            }
            case 7: processCheckout(); break;
            case 8: {
                int d;
                cout << "Enter discount %: ";
                cin >> d;
                applyDiscount(d);
                break;
            }
            case 9: getBestDiscount(); break;
            case 10: cout << "Exiting...\\n"; break;
            default: cout << "Invalid choice!\\n";
        }
    } while(choice != 10);

    return 0;
}
`;

export const PRD_DOCUMENT_DATA = {
  title: 'Shopping Cart Project PRD & Specification',
  overview: 'The Shopping Cart System is a console-based and web-visualized application built to demonstrate e-commerce cart operations using core Data Structures and Algorithms (DSA). It showcases practical, real-world business applications of Hashmaps, Linked Lists, Stacks, Queues, and Priority Queues.',
  objectives: [
    'Provide an interactive menu-driven interface for cart management.',
    'Showcase DSA concepts in a practical, business-aligned project.',
    'Enable full undo/redo stack functionality for cart operations.',
    'Simulate FIFO checkout queue processing for multiple customers.',
    'Apply dynamic discounts using a Priority Queue Max-Heap.'
  ],
  functionalRequirements: [
    { id: 'FR1', desc: 'User can add items to cart by product ID and quantity.' },
    { id: 'FR2', desc: 'User can remove last item from cart.' },
    { id: 'FR3', desc: 'User can view cart contents and calculated total price.' },
    { id: 'FR4', desc: 'User can undo/redo last cart operation.' },
    { id: 'FR5', desc: 'User can enqueue customers into checkout queue.' },
    { id: 'FR6', desc: 'System processes checkout in FIFO order.' },
    { id: 'FR7', desc: 'User can add discount offers and system applies highest discount rate first.' }
  ],
  dsaMapping: [
    { feature: 'Product Catalog', dsa: 'Hashmap (unordered_map)', complexity: 'O(1)', desc: 'Fast product lookup by unique ID' },
    { feature: 'Cart Management', dsa: 'Linked List (list)', complexity: 'O(1) insert/delete', desc: 'Dynamic addition/removal of cart items' },
    { feature: 'Undo/Redo System', dsa: 'Stack (stack)', complexity: 'O(1)', desc: 'Rollback & reapply last cart actions' },
    { feature: 'Checkout Queue', dsa: 'Queue (queue)', complexity: 'O(1)', desc: 'FIFO customer checkout simulation' },
    { feature: 'Discount Engine', dsa: 'Priority Queue (max-heap)', complexity: 'O(log N)', desc: 'Applies best available discount percentage first' }
  ]
};

export const TEST_CASES_DATA = [
  {
    id: 1,
    name: 'Test Case 1: Add Items & View Cart',
    inputs: [
      { action: 'add', id: 2, qty: 1 },
      { action: 'add', id: 3, qty: 2 }
    ],
    expected: 'Phone x1 = 20000, Headphones x2 = 4000. Total = 24000'
  },
  {
    id: 2,
    name: 'Test Case 2: Undo Add Action',
    inputs: [
      { action: 'add', id: 2, qty: 1 },
      { action: 'add', id: 3, qty: 2 },
      { action: 'undo' }
    ],
    expected: 'Cart contains Phone x1. Total = 20000. Redo stack contains ADD Headphones.'
  },
  {
    id: 3,
    name: 'Test Case 3: Remove & Undo Action',
    inputs: [
      { action: 'add', id: 2, qty: 1 },
      { action: 'remove' },
      { action: 'undo' }
    ],
    expected: 'Phone x1 removed, then restored via Undo. Total = 20000.'
  },
  {
    id: 4,
    name: 'Test Case 4: Redo After Undo',
    inputs: [
      { action: 'add', id: 2, qty: 1 },
      { action: 'undo' },
      { action: 'redo' }
    ],
    expected: 'Phone x1 undone then re-added via Redo. Total = 20000.'
  },
  {
    id: 5,
    name: 'Test Case 5: Checkout Queue (FIFO)',
    inputs: [
      { action: 'enqueue', name: 'Alice' },
      { action: 'enqueue', name: 'Bob' },
      { action: 'processCheckout' }
    ],
    expected: 'Processed Alice first (FIFO). Bob remains in queue.'
  },
  {
    id: 6,
    name: 'Test Case 6: Discount Engine Priority Queue',
    inputs: [
      { action: 'addDiscount', percent: 10 },
      { action: 'addDiscount', percent: 20 },
      { action: 'applyBestDiscount' }
    ],
    expected: 'Applied 20% discount first (Max-Heap top). 10% discount remains in heap.'
  }
];
