// Benchmarking Engine for algorithm execution metrics measurement

import {
  generateBubbleSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps
} from './sortingEngine.js';

// Native pure sorting routines for benchmark timing measurements without DOM step overhead
function runPureBubble(arr) {
  let comps = 0, swaps = 0;
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comps++;
      if (a[j] > a[j + 1]) {
        swaps++;
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return { comps, swaps };
}

function runPureInsertion(arr) {
  let comps = 0, swaps = 0;
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0) {
      comps++;
      if (a[j] > key) {
        a[j + 1] = a[j];
        swaps++;
        j--;
      } else break;
    }
    a[j + 1] = key;
  }
  return { comps, swaps };
}

function runPureQuick(arr) {
  let comps = 0, swaps = 0;
  const a = [...arr];
  function q(low, high) {
    if (low >= high) return;
    const pivot = a[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      comps++;
      if (a[j] <= pivot) {
        i++;
        swaps++;
        [a[i], a[j]] = [a[j], a[i]];
      }
    }
    swaps++;
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    const pi = i + 1;
    q(low, pi - 1);
    q(pi + 1, high);
  }
  q(0, a.length - 1);
  return { comps, swaps };
}

function runPureMerge(arr) {
  let comps = 0, swaps = 0;
  const a = [...arr];
  function mSort(l, r) {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    mSort(l, mid);
    mSort(mid + 1, r);
    const temp = [];
    let i = l, j = mid + 1;
    while (i <= mid && j <= r) {
      comps++;
      if (a[i] <= a[j]) temp.push(a[i++]);
      else temp.push(a[j++]);
    }
    while (i <= mid) temp.push(a[i++]);
    while (j <= r) temp.push(a[j++]);
    for (let k = 0; k < temp.length; k++) {
      swaps++;
      a[l + k] = temp[k];
    }
  }
  mSort(0, a.length - 1);
  return { comps, swaps };
}

function runPureHeap(arr) {
  let comps = 0, swaps = 0;
  const a = [...arr];
  const n = a.length;
  function heapify(sz, i) {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < sz) { comps++; if (a[l] > a[largest]) largest = l; }
    if (r < sz) { comps++; if (a[r] > a[largest]) largest = r; }
    if (largest !== i) {
      swaps++;
      [a[i], a[largest]] = [a[largest], a[i]];
      heapify(sz, largest);
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    swaps++;
    [a[0], a[i]] = [a[i], a[0]];
    heapify(i, 0);
  }
  return { comps, swaps };
}

export function generateRandomArray(size, type = 'random') {
  if (type === 'sorted') {
    return Array.from({ length: size }, (_, i) => (i + 1) * 5);
  }
  if (type === 'reverse') {
    return Array.from({ length: size }, (_, i) => (size - i) * 5);
  }
  return Array.from({ length: size }, () => Math.floor(Math.random() * 500) + 5);
}

export function benchmarkSortingAlgorithms(sizes = [10, 50, 100, 200], distribution = 'random') {
  const results = [];

  sizes.forEach(size => {
    const input = generateRandomArray(size, distribution);
    const item = { size };

    // Bubble
    const t0 = performance.now();
    const bRes = runPureBubble(input);
    item.Bubble = parseFloat((performance.now() - t0).toFixed(3));
    item.BubbleComps = bRes.comps;

    // Insertion
    const t1 = performance.now();
    const iRes = runPureInsertion(input);
    item.Insertion = parseFloat((performance.now() - t1).toFixed(3));
    item.InsertionComps = iRes.comps;

    // Merge
    const t2 = performance.now();
    const mRes = runPureMerge(input);
    item.Merge = parseFloat((performance.now() - t2).toFixed(3));
    item.MergeComps = mRes.comps;

    // Quick
    const t3 = performance.now();
    const qRes = runPureQuick(input);
    item.Quick = parseFloat((performance.now() - t3).toFixed(3));
    item.QuickComps = qRes.comps;

    // Heap
    const t4 = performance.now();
    const hRes = runPureHeap(input);
    item.Heap = parseFloat((performance.now() - t4).toFixed(3));
    item.HeapComps = hRes.comps;

    results.push(item);
  });

  return results;
}
