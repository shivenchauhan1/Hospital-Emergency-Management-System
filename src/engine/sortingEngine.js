// Step-by-Step Generator Engine for 5 Sorting Algorithms

export function generateBubbleSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = [];

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 1,
    comparisons,
    swaps,
    message: 'Starting Bubble Sort'
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sortedIndices],
        line: 5,
        comparisons,
        swaps,
        message: `Comparing element ${arr[j]} at index ${j} and ${arr[j + 1]} at index ${j + 1}`
      });

      if (arr[j] > arr[j + 1]) {
        swaps++;
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sortedIndices],
          line: 6,
          comparisons,
          swaps,
          message: `Swapping ${arr[j + 1]} and ${arr[j]}`
        });
      }
    }
    sortedIndices.push(n - 1 - i);
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sortedIndices],
      line: 11,
      comparisons,
      swaps,
      message: `Element ${arr[n - 1 - i]} is now in its correct sorted position`
    });

    if (!swapped) break;
  }

  // All remaining elements are sorted
  const allSorted = Array.from({ length: n }, (_, k) => k);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: allSorted,
    line: 13,
    comparisons,
    swaps,
    message: `Bubble Sort complete! Total comparisons: ${comparisons}, swaps: ${swaps}`
  });

  return steps;
}

export function generateInsertionSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = [0];

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [0],
    line: 1,
    comparisons,
    swaps,
    message: 'Starting Insertion Sort. First element is trivially sorted.'
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: [...sortedIndices],
      line: 3,
      comparisons,
      swaps,
      message: `Picked key element ${key} at index ${i}`
    });

    while (j >= 0) {
      comparisons++;
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sortedIndices],
        line: 5,
        comparisons,
        swaps,
        message: `Comparing key ${key} with ${arr[j]} at index ${j}`
      });

      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        swaps++;
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sortedIndices],
          line: 6,
          comparisons,
          swaps,
          message: `Shifted element ${arr[j]} to the right`
        });
        j--;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
    sortedIndices.push(i);
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      line: 9,
      comparisons,
      swaps,
      message: `Inserted key ${key} into index ${j + 1}`
    });
  }

  const allSorted = Array.from({ length: n }, (_, k) => k);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: allSorted,
    line: 11,
    comparisons,
    swaps,
    message: `Insertion Sort complete! Total comparisons: ${comparisons}, swaps: ${swaps}`
  });

  return steps;
}

export function generateMergeSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 1,
    comparisons,
    swaps,
    message: 'Starting Merge Sort (Divide & Conquer)'
  });

  function merge(left, mid, right) {
    const temp = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      comparisons++;
      steps.push({
        array: [...arr],
        comparing: [i, j],
        swapping: [],
        sorted: [],
        line: 10,
        comparisons,
        swaps,
        message: `Comparing sub-array elements ${arr[i]} and ${arr[j]}`
      });

      if (arr[i] <= arr[j]) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }
    }

    while (i <= mid) temp.push(arr[i++]);
    while (j <= right) temp.push(arr[j++]);

    for (let k = 0; k < temp.length; k++) {
      swaps++;
      arr[left + k] = temp[k];
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [left + k],
        sorted: [],
        line: 11,
        comparisons,
        swaps,
        message: `Merging value ${temp[k]} back into position ${left + k}`
      });
    }
  }

  function mergeSortHelper(left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    steps.push({
      array: [...arr],
      comparing: [left, right],
      swapping: [],
      sorted: [],
      line: 3,
      comparisons,
      swaps,
      message: `Dividing range [${left}...${right}] at mid index ${mid}`
    });
    mergeSortHelper(left, mid);
    mergeSortHelper(mid + 1, right);
    merge(left, mid, right);
  }

  mergeSortHelper(0, arr.length - 1);

  const allSorted = Array.from({ length: arr.length }, (_, k) => k);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: allSorted,
    line: 5,
    comparisons,
    swaps,
    message: `Merge Sort complete! Total comparisons: ${comparisons}, swaps: ${swaps}`
  });

  return steps;
}

export function generateQuickSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = [];

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 1,
    comparisons,
    swaps,
    message: 'Starting Quick Sort'
  });

  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      pivot: high,
      sorted: [...sortedIndices],
      line: 10,
      comparisons,
      swaps,
      message: `Selected pivot ${pivot} at index ${high}`
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push({
        array: [...arr],
        comparing: [j, high],
        swapping: [],
        pivot: high,
        sorted: [...sortedIndices],
        line: 13,
        comparisons,
        swaps,
        message: `Comparing element ${arr[j]} at index ${j} with pivot ${pivot}`
      });

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          swaps++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            array: [...arr],
            comparing: [],
            swapping: [i, j],
            pivot: high,
            sorted: [...sortedIndices],
            line: 14,
            comparisons,
            swaps,
            message: `Swapped smaller element ${arr[i]} to index ${i}`
          });
        }
      }
    }

    swaps++;
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    sortedIndices.push(i + 1);
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [i + 1, high],
      pivot: i + 1,
      sorted: [...sortedIndices],
      line: 17,
      comparisons,
      swaps,
      message: `Placed pivot ${pivot} in final sorted position at index ${i + 1}`
    });

    return i + 1;
  }

  function quickSortHelper(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    } else if (low === high) {
      sortedIndices.push(low);
    }
  }

  quickSortHelper(0, arr.length - 1);

  const allSorted = Array.from({ length: arr.length }, (_, k) => k);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: allSorted,
    line: 5,
    comparisons,
    swaps,
    message: `Quick Sort complete! Total comparisons: ${comparisons}, swaps: ${swaps}`
  });

  return steps;
}

export function generateHeapSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = [];

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 1,
    comparisons,
    swaps,
    message: 'Starting Heap Sort (Building Max-Heap)'
  });

  function heapify(heapSize, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < heapSize) {
      comparisons++;
      steps.push({
        array: [...arr],
        comparing: [left, largest],
        swapping: [],
        sorted: [...sortedIndices],
        line: 12,
        comparisons,
        swaps,
        message: `Heapify: Comparing left child ${arr[left]} with node ${arr[largest]}`
      });
      if (arr[left] > arr[largest]) largest = left;
    }

    if (right < heapSize) {
      comparisons++;
      steps.push({
        array: [...arr],
        comparing: [right, largest],
        swapping: [],
        sorted: [...sortedIndices],
        line: 13,
        comparisons,
        swaps,
        message: `Heapify: Comparing right child ${arr[right]} with largest node ${arr[largest]}`
      });
      if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== i) {
      swaps++;
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [i, largest],
        sorted: [...sortedIndices],
        line: 14,
        comparisons,
        swaps,
        message: `Swapped root ${arr[largest]} with largest child ${arr[i]}`
      });
      heapify(heapSize, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 5,
    comparisons,
    swaps,
    message: 'Max-Heap constructed! Now extracting elements one by one.'
  });

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    swaps++;
    [arr[0], arr[i]] = [arr[i], arr[0]];
    sortedIndices.push(i);
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [0, i],
      sorted: [...sortedIndices],
      line: 7,
      comparisons,
      swaps,
      message: `Extracted max element ${arr[i]} to index ${i}`
    });
    heapify(i, 0);
  }
  sortedIndices.push(0);

  const allSorted = Array.from({ length: n }, (_, k) => k);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: allSorted,
    line: 9,
    comparisons,
    swaps,
    message: `Heap Sort complete! Total comparisons: ${comparisons}, swaps: ${swaps}`
  });

  return steps;
}
