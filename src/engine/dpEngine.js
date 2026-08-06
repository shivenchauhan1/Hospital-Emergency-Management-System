// Step-by-Step Generator Engine for 0/1 Knapsack & Longest Common Subsequence (LCS)

export function generateKnapsackSteps(items, capacity) {
  const steps = [];
  const N = items.length;
  const W = capacity;
  let iterations = 0;

  // Initialize DP Table (N+1) x (W+1)
  const dp = Array.from({ length: N + 1 }, () => Array(W + 1).fill(0));

  steps.push({
    table: JSON.parse(JSON.stringify(dp)),
    items,
    capacity,
    currentCell: null,
    selectedItems: [],
    iterations,
    line: 2,
    message: `Initialized DP table size ${N + 1} x ${W + 1} with zeroes.`
  });

  for (let i = 1; i <= N; i++) {
    const item = items[i - 1];
    for (let w = 1; w <= W; w++) {
      iterations++;

      if (item.weight <= w) {
        const includeVal = item.value + dp[i - 1][w - item.weight];
        const excludeVal = dp[i - 1][w];
        dp[i][w] = Math.max(includeVal, excludeVal);

        steps.push({
          table: JSON.parse(JSON.stringify(dp)),
          items,
          capacity,
          currentCell: { r: i, c: w },
          itemInspected: item,
          iterations,
          line: 6,
          message: `Item ${i} (${item.name}, weight=${item.weight}, value=${item.value}): Capacity ${w} >= weight. Max(Include: ${includeVal}, Exclude: ${excludeVal}) = ${dp[i][w]}`
        });
      } else {
        dp[i][w] = dp[i - 1][w];
        steps.push({
          table: JSON.parse(JSON.stringify(dp)),
          items,
          capacity,
          currentCell: { r: i, c: w },
          itemInspected: item,
          iterations,
          line: 8,
          message: `Item ${i} weight ${item.weight} exceeds capacity ${w}. Carrying forward previous best: ${dp[i][w]}`
        });
      }
    }
  }

  // Backtrack to find selected items
  let res = dp[N][W];
  let wCurr = W;
  const selectedItems = [];

  for (let i = N; i > 0 && res > 0; i--) {
    if (res !== dp[i - 1][wCurr]) {
      selectedItems.push(items[i - 1]);
      res -= items[i - 1].value;
      wCurr -= items[i - 1].weight;
    }
  }

  steps.push({
    table: JSON.parse(JSON.stringify(dp)),
    items,
    capacity,
    currentCell: { r: N, c: W },
    selectedItems,
    maxValue: dp[N][W],
    iterations,
    line: 12,
    message: `0/1 Knapsack complete! Optimal value = ${dp[N][W]}. Selected items: [${selectedItems.map(it => it.name).join(', ')}]`
  });

  return steps;
}

export function generateLCSSteps(str1, str2) {
  const steps = [];
  const m = str1.length;
  const n = str2.length;
  let iterations = 0;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  steps.push({
    table: JSON.parse(JSON.stringify(dp)),
    str1, str2,
    currentCell: null,
    lcsString: '',
    iterations,
    line: 3,
    message: `Initialized LCS table for "${str1}" vs "${str2}"`
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      iterations++;
      const char1 = str1[i - 1];
      const char2 = str2[j - 1];

      if (char1 === char2) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({
          table: JSON.parse(JSON.stringify(dp)),
          str1, str2,
          currentCell: { r: i, c: j },
          match: true,
          chars: { char1, char2 },
          iterations,
          line: 7,
          message: `Match! '${char1}' == '${char2}' at indices (${i}, ${j}). Value set to diagonal + 1 = ${dp[i][j]}`
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({
          table: JSON.parse(JSON.stringify(dp)),
          str1, str2,
          currentCell: { r: i, c: j },
          match: false,
          chars: { char1, char2 },
          iterations,
          line: 9,
          message: `No match: '${char1}' != '${char2}'. Max(top: ${dp[i - 1][j]}, left: ${dp[i][j - 1]}) = ${dp[i][j]}`
        });
      }
    }
  }

  // Backtrack to reconstruct LCS string
  let index = dp[m][n];
  let i = m, j = n;
  const lcsChars = [];

  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcsChars.unshift(str1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  const lcsString = lcsChars.join('');

  steps.push({
    table: JSON.parse(JSON.stringify(dp)),
    str1, str2,
    currentCell: { r: m, c: n },
    lcsString,
    lcsLength: dp[m][n],
    iterations,
    line: 14,
    message: `LCS complete! Longest Common Subsequence = "${lcsString}" (Length: ${dp[m][n]})`
  });

  return steps;
}
