# JavaScript NeetCode Templates

This file is for memorization. Each template is intentionally short and interview-ready.

## 1. Frequency Map

```javascript
function buildCountMap(arr) {
  const count = new Map();

  for (const value of arr) {
    count.set(value, (count.get(value) ?? 0) + 1);
  }

  return count;
}
```

## 2. Two Pointers On Sorted Array

```javascript
function twoPointers(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];

    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }

  return [-1, -1];
}
```

## 3. Sliding Window

```javascript
function slidingWindow(arr) {
  let left = 0;
  let answer = 0;

  for (let right = 0; right < arr.length; right++) {
    add(arr[right]);

    while (windowIsInvalid()) {
      remove(arr[left]);
      left++;
    }

    answer = Math.max(answer, right - left + 1);
  }

  return answer;
}
```

## 4. Binary Search For Exact Match

```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}
```

## 5. Binary Search On Answer

```javascript
function binarySearchAnswer(left, right) {
  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (isValid(mid)) right = mid;
    else left = mid + 1;
  }

  return left;
}
```

## 6. BFS

```javascript
function bfs(start) {
  const queue = [start];
  const visited = new Set([start]);

  for (let i = 0; i < queue.length; i++) {
    const node = queue[i];

    for (const next of neighbors(node)) {
      if (visited.has(next)) continue;
      visited.add(next);
      queue.push(next);
    }
  }
}
```

## 7. DFS

```javascript
function dfs(node, visited) {
  if (visited.has(node)) return;
  visited.add(node);

  for (const next of neighbors(node)) {
    dfs(next, visited);
  }
}
```

## 8. Grid DFS

```javascript
function floodFill(grid, row, col) {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;

    grid[r][c] = '0';

    for (const [dr, dc] of directions) {
      dfs(r + dr, c + dc);
    }
  }

  dfs(row, col);
}
```

## 9. Backtracking

```javascript
function backtrackingTemplate(nums) {
  const result = [];
  const path = [];

  function backtrack(start) {
    result.push([...path]);

    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}
```

## 10. 1D DP

```javascript
function dpTemplate(nums) {
  const dp = Array(nums.length).fill(0);
  dp[0] = nums[0];

  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1], nums[i]);
  }

  return dp[nums.length - 1];
}
```

## 11. Space-Optimized DP

```javascript
function dpOptimized(nums) {
  let prevTwo = 0;
  let prevOne = 0;

  for (const num of nums) {
    const current = Math.max(prevOne, prevTwo + num);
    prevTwo = prevOne;
    prevOne = current;
  }

  return prevOne;
}
```

## 12. Monotonic Stack

```javascript
function monotonicStack(arr) {
  const stack = [];
  const answer = Array(arr.length).fill(0);

  for (let i = 0; i < arr.length; i++) {
    while (stack.length && arr[i] > arr[stack[stack.length - 1]]) {
      const index = stack.pop();
      answer[index] = i - index;
    }

    stack.push(i);
  }

  return answer;
}
```

## 13. Prefix Sum With Map

```javascript
function prefixSumCount(nums, k) {
  const count = new Map([[0, 1]]);
  let prefix = 0;
  let answer = 0;

  for (const num of nums) {
    prefix += num;
    answer += count.get(prefix - k) ?? 0;
    count.set(prefix, (count.get(prefix) ?? 0) + 1);
  }

  return answer;
}
```

## 14. Heap Helper

```javascript
class Heap {
  constructor(compare) {
    this.data = [];
    this.compare = compare;
  }

  size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  push(value) {
    this.data.push(value);
    this.bubbleUp(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 0) return undefined;
    if (this.data.length === 1) return this.data.pop();

    const top = this.data[0];
    this.data[0] = this.data.pop();
    this.bubbleDown(0);
    return top;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.data[parent], this.data[index]) <= 0) break;
      [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
      index = parent;
    }
  }

  bubbleDown(index) {
    while (true) {
      let best = index;
      const left = index * 2 + 1;
      const right = index * 2 + 2;

      if (left < this.data.length && this.compare(this.data[best], this.data[left]) > 0) {
        best = left;
      }

      if (right < this.data.length && this.compare(this.data[best], this.data[right]) > 0) {
        best = right;
      }

      if (best === index) break;
      [this.data[index], this.data[best]] = [this.data[best], this.data[index]];
      index = best;
    }
  }
}
```

## 15. Top K With Heap

```javascript
function topK(nums, k) {
  const minHeap = new Heap((a, b) => a - b);

  for (const num of nums) {
    minHeap.push(num);
    if (minHeap.size() > k) minHeap.pop();
  }

  return minHeap.data;
}
```

## What To Memorize

1. `Map`, `Set`, and array frequency patterns.
2. Left/right pointer movement rules.
3. Sliding window expand then shrink logic.
4. Binary search boundaries.
5. DFS/BFS traversal skeletons.
6. Backtracking choose/recurse/undo cycle.
7. `dp[i]` state definition before coding.
8. Monotonic stack invariant.
9. Prefix sum plus hash map relation.
10. Heap helper if your interview uses plain JavaScript.
