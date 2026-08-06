// Step-by-Step Generator Engine for Binary Search Tree (BST) & AVL Tree

export class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

// Clone tree structure for snapshot visualization
export function cloneTree(root) {
  if (!root) return null;
  const newNode = {
    val: root.val,
    height: root.height || 1,
    balanceFactor: getBalance(root)
  };
  newNode.left = cloneTree(root.left);
  newNode.right = cloneTree(root.right);
  return newNode;
}

function getHeight(node) {
  return node ? node.height : 0;
}

function getBalance(node) {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

// --- BST GENERATOR ---
export function generateBSTSteps(values, traversalType = 'inorder') {
  const steps = [];
  let root = null;
  let iterations = 0;

  // Insert values to construct BST
  function bstInsert(node, val) {
    iterations++;
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = bstInsert(node.left, val);
    else if (val > node.val) node.right = bstInsert(node.right, val);
    return node;
  }

  values.forEach(v => {
    root = bstInsert(root, v);
  });

  steps.push({
    tree: cloneTree(root),
    visited: [],
    activeVal: null,
    iterations,
    line: 1,
    message: `BST constructed with ${values.length} nodes. Starting ${traversalType.toUpperCase()} traversal.`
  });

  const visited = [];

  if (traversalType === 'inorder') {
    function inOrder(node) {
      if (!node) return;
      inOrder(node.left);
      visited.push(node.val);
      steps.push({
        tree: cloneTree(root),
        visited: [...visited],
        activeVal: node.val,
        iterations: iterations++,
        line: 3,
        message: `In-Order: Visited node ${node.val}`
      });
      inOrder(node.right);
    }
    inOrder(root);
  } else if (traversalType === 'preorder') {
    function preOrder(node) {
      if (!node) return;
      visited.push(node.val);
      steps.push({
        tree: cloneTree(root),
        visited: [...visited],
        activeVal: node.val,
        iterations: iterations++,
        line: 3,
        message: `Pre-Order: Visited node ${node.val}`
      });
      preOrder(node.left);
      preOrder(node.right);
    }
    preOrder(root);
  } else if (traversalType === 'postorder') {
    function postOrder(node) {
      if (!node) return;
      postOrder(node.left);
      postOrder(node.right);
      visited.push(node.val);
      steps.push({
        tree: cloneTree(root),
        visited: [...visited],
        activeVal: node.val,
        iterations: iterations++,
        line: 3,
        message: `Post-Order: Visited node ${node.val}`
      });
    }
    postOrder(root);
  } else if (traversalType === 'levelorder') {
    const queue = [root];
    while (queue.length > 0) {
      const node = queue.shift();
      if (node) {
        visited.push(node.val);
        steps.push({
          tree: cloneTree(root),
          visited: [...visited],
          activeVal: node.val,
          iterations: iterations++,
          line: 3,
          message: `Level-Order: Visited node ${node.val}`
        });
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
    }
  }

  steps.push({
    tree: cloneTree(root),
    visited: [...visited],
    activeVal: null,
    iterations,
    line: 5,
    message: `${traversalType.toUpperCase()} traversal complete! Order: [${visited.join(', ')}]`
  });

  return steps;
}

// --- AVL TREE GENERATOR WITH ROTATIONS ---
export function generateAVLSteps(values) {
  const steps = [];
  let root = null;
  let iterations = 0;
  let rotations = 0;

  function rotateRight(y) {
    rotations++;
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    return x;
  }

  function rotateLeft(x) {
    rotations++;
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    return y;
  }

  function avlInsert(node, val) {
    iterations++;
    if (!node) {
      const n = new TreeNode(val);
      steps.push({
        tree: cloneTree(root || n),
        activeVal: val,
        rotationType: 'None',
        rotations,
        iterations,
        line: 2,
        message: `Inserted new leaf node ${val}`
      });
      return n;
    }

    if (val < node.val) node.left = avlInsert(node.left, val);
    else if (val > node.val) node.right = avlInsert(node.right, val);
    else return node; // Duplicate keys not allowed

    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    const balance = getBalance(node);

    // LL Case
    if (balance > 1 && val < node.left.val) {
      steps.push({
        tree: cloneTree(root),
        activeVal: node.val,
        rotationType: 'LL (Right Rotation)',
        rotations: rotations + 1,
        iterations,
        line: 6,
        message: `Imbalance detected at node ${node.val} (BF = ${balance}). Performing Single Right (LL) Rotation.`
      });
      return rotateRight(node);
    }

    // RR Case
    if (balance < -1 && val > node.right.val) {
      steps.push({
        tree: cloneTree(root),
        activeVal: node.val,
        rotationType: 'RR (Left Rotation)',
        rotations: rotations + 1,
        iterations,
        line: 7,
        message: `Imbalance detected at node ${node.val} (BF = ${balance}). Performing Single Left (RR) Rotation.`
      });
      return rotateLeft(node);
    }

    // LR Case
    if (balance > 1 && val > node.left.val) {
      steps.push({
        tree: cloneTree(root),
        activeVal: node.val,
        rotationType: 'LR (Left-Right Double Rotation)',
        rotations: rotations + 2,
        iterations,
        line: 8,
        message: `Imbalance detected at node ${node.val} (BF = ${balance}). Performing Left-Right (LR) Double Rotation.`
      });
      node.left = rotateLeft(node.left);
      return rotateRight(node);
    }

    // RL Case
    if (balance < -1 && val < node.right.val) {
      steps.push({
        tree: cloneTree(root),
        activeVal: node.val,
        rotationType: 'RL (Right-Left Double Rotation)',
        rotations: rotations + 2,
        iterations,
        line: 9,
        message: `Imbalance detected at node ${node.val} (BF = ${balance}). Performing Right-Left (RL) Double Rotation.`
      });
      node.right = rotateRight(node.right);
      return rotateLeft(node);
    }

    return node;
  }

  values.forEach(val => {
    steps.push({
      tree: cloneTree(root),
      activeVal: val,
      rotationType: 'None',
      rotations,
      iterations,
      line: 1,
      message: `Inserting value ${val} into AVL tree`
    });
    root = avlInsert(root, val);
  });

  steps.push({
    tree: cloneTree(root),
    activeVal: null,
    rotationType: 'Complete',
    rotations,
    iterations,
    line: 12,
    message: `AVL Tree construction complete! Total rotations: ${rotations}, Height: ${getHeight(root)}`
  });

  return steps;
}
