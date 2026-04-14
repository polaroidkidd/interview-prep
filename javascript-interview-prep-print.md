# JavaScript Interview Prep Print Version

This version is optimized for printing or PDF export.

## 1. Interview Framework

1. Clarify input, output, constraints, duplicates, and edge cases.
2. Walk through a tiny example.
3. State brute force.
4. Name the bottleneck.
5. Match to a pattern.
6. Code the simplest correct JavaScript solution.
7. Test one normal case and one edge case.

## 2. Pattern Recognition

| Clue | Pattern |
| --- | --- |
| Seen before, counts, grouping | Hash map / set |
| Sorted pair or triplet | Two pointers |
| Longest or shortest contiguous region | Sliding window |
| Sorted or monotonic answer space | Binary search |
| Grid, graph, traversal | BFS / DFS |
| All valid answers | Backtracking |
| Repeated subproblems | 1D DP |
| Next greater / previous smaller | Stack |
| Top k / kth best | Heap |
| Subarray math / range math | Prefix sum |

## 3. JavaScript Template Set

### Hash Map / Set

```javascript
const count = new Map();
for (const value of arr) {
  count.set(value, (count.get(value) ?? 0) + 1);
}

const seen = new Set(arr);
```

### Two Pointers

```javascript
let left = 0;
let right = arr.length - 1;

while (left < right) {
  const sum = arr[left] + arr[right];
  if (sum === target) break;
  if (sum < target) left++;
  else right--;
}
```

### Sliding Window

```javascript
let left = 0;

for (let right = 0; right < arr.length; right++) {
  add(arr[right]);

  while (windowIsInvalid()) {
    remove(arr[left]);
    left++;
  }

  updateAnswer(left, right);
}
```

### Binary Search

```javascript
let left = 0;
let right = arr.length - 1;

while (left <= right) {
  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) left = mid + 1;
  else right = mid - 1;
}

return -1;
```

### BFS

```javascript
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
```

### DFS

```javascript
function dfs(node) {
  if (isInvalid(node) || visited.has(node)) return;
  visited.add(node);

  for (const next of neighbors(node)) {
    dfs(next);
  }
}
```

### Backtracking

```javascript
const result = [];
const path = [];

function backtrack(start) {
  if (isComplete(path)) {
    result.push([...path]);
    return;
  }

  for (const choice of getChoices(start)) {
    path.push(choice);
    backtrack(getNextStart(choice));
    path.pop();
  }
}
```

### 1D DP

```javascript
const dp = Array(n + 1).fill(0);
dp[baseIndex] = baseValue;

for (let i = startIndex; i <= n; i++) {
  dp[i] = transition(dp, i);
}
```

### Monotonic Stack

```javascript
const stack = [];

for (let i = 0; i < arr.length; i++) {
  while (stack.length && shouldPop(arr, stack[stack.length - 1], i)) {
    const index = stack.pop();
    resolve(index, i);
  }

  stack.push(i);
}
```

### Prefix Sum

```javascript
const count = new Map([[0, 1]]);
let prefix = 0;

for (const num of nums) {
  prefix += num;
  const needed = prefix - k;
  count.set(prefix, (count.get(prefix) ?? 0) + 1);
}
```

## 4. Highest-Yield Problems

### Core 14

1. `Group Anagrams`
2. `Top K Frequent Elements`
3. `Longest Consecutive Sequence`
4. `Container With Most Water`
5. `3Sum`
6. `Longest Substring Without Repeating Characters`
7. `Character Replacement`
8. `Find Minimum in Rotated Sorted Array`
9. `Number of Islands`
10. `Combination Sum`
11. `Coin Change`
12. `Daily Temperatures`
13. `Kth Largest Element in an Array`
14. `Subarray Sum Equals K`

### Minimum 8 If Time Is Tight

1. `Group Anagrams`
2. `Top K Frequent Elements`
3. `3Sum`
4. `Longest Substring Without Repeating Characters`
5. `Find Minimum in Rotated Sorted Array`
6. `Number of Islands`
7. `Combination Sum`
8. `Coin Change`

## 5. Invariants To Say Out Loud

- Hash map: the map stores everything seen so far.
- Two pointers: only move the pointer that can improve the answer.
- Sliding window: shrink only when invalid.
- Binary search: answer remains inside current bounds.
- BFS / DFS: mark visited early.
- Backtracking: choose, recurse, undo.
- DP: define `dp[i]` in English first.
- Stack: keep the monotonic or LIFO invariant intact.
- Heap: root is current best removable element.
- Prefix sum: convert subarray condition to prefix difference.

## 6. JavaScript Reminders

```javascript
nums.sort((a, b) => a - b)
```

```javascript
map.set(x, (map.get(x) ?? 0) + 1)
```

```javascript
const mid = Math.floor((left + right) / 2)
```

```javascript
const count = new Map([[0, 1]])
```

## 7. Related Files

- `javascript-interview-prep-handbook.md`
- `neetcode-medium-exam-prep.md`
- `javascript-neetcode-templates.md`
- `day-before-interview-cram-sheet.md`
