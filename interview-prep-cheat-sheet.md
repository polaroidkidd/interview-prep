# Interview Prep Cheat Sheet

Use this as the last-minute review sheet before practice or an interview.

## Interview Loop

1. Clarify inputs, outputs, constraints, and edge cases.
2. Give a tiny example.
3. State brute force and its bottleneck.
4. Name the pattern.
5. Code the simplest correct version.
6. Test with the same example and one edge case.

## Pattern Summary

| Pattern | Use It When | Core Move | Typical Time |
| --- | --- | --- | --- |
| Hash map / set | Need lookup, counts, grouping, duplicates | Store seen state for O(1) access | Usually `O(n)` |
| Two pointers | Sorted array, pair search, both-end optimization | Move the pointer that can improve the answer | Usually `O(n)` after sorting |
| Sliding window | Contiguous subarray or substring, longest/shortest valid range | Expand right, shrink left only when invalid | Usually `O(n)` |
| Binary search | Sorted or monotonic search space | Use `mid` to discard half | Usually `O(log n)` or `O(n log m)` |
| BFS / DFS | Graph, tree, grid, connected components, reachability | Visit each node once with queue or recursion/stack | Usually `O(V + E)` |
| Backtracking | Need all combinations, permutations, partitions | Choose, recurse, undo | Exponential |
| 1D DP | Overlapping subproblems, min/max/ways | Define `dp[i]`, recurrence, base case | Often `O(n)` to `O(n * m)` |
| Stack / monotonic stack | Next greater/smaller, nested structure, expression eval | Push unresolved items, pop when resolved | Usually `O(n)` |
| Heap / priority queue | Top k, kth element, dynamic min/max | Keep only best candidates by priority | Usually `O(n log k)` |
| Prefix sum | Repeated range sums, count subarrays by sum | Turn range into difference of prefixes | Usually `O(n)` |

## Recognition Questions

1. Have I seen this value, count, or state before?
2. Can sorting let me replace nested loops with left/right pointers?
3. Is the answer a contiguous window?
4. Is there a monotonic yes/no condition or sorted space?
5. Is this a graph or grid traversal in disguise?
6. Do I need all valid answers, not just one?
7. Am I solving the same subproblem repeatedly?
8. Does each new item answer questions for earlier items?
9. Do I only need the top or bottom few values?
10. Can I precompute running totals to answer ranges quickly?

## Pattern Micro-Templates

### Hash Map / Set

- Pick the key first.
- Update as you scan.
- Ask whether a set is enough before using a full map.

### Two Pointers

- Sort if needed.
- Define what each pointer means.
- Move only the pointer that can improve the answer.

### Sliding Window

- Add right item.
- While invalid, remove left item.
- Record answer only when valid.

### Binary Search

- Define the search space.
- Define the monotonic rule.
- Decide whether `mid` stays or is discarded.

### BFS / DFS

- Mark visited early.
- Traverse neighbors once.
- For grids, reuse a direction array.

### Backtracking

- Path holds current partial answer.
- Base case adds a copy of path.
- Undo each choice after recursion.

### 1D DP

- Say `dp[i]` out loud in English.
- Write recurrence.
- Fill in dependency order.

### Stack / Monotonic Stack

- Store indices when you need distances.
- Keep the invariant true after each push/pop.
- Popped items are the ones you just resolved.

### Heap / Priority Queue

- Min-heap for keeping k largest.
- Max-heap for repeatedly taking the largest.
- Keep heap size small when only `k` matters.

### Prefix Sum

- Running sum starts at `0`.
- Subarray sum uses `current_prefix - old_prefix`.
- Seed the map with prefix `0` when counting ranges from index `0`.

## JavaScript Mini-Templates

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
const firstSeen = new Map([[0, -1]]);
let prefix = 0;

for (let i = 0; i < nums.length; i++) {
  prefix += nums[i];
  if (!firstSeen.has(prefix)) firstSeen.set(prefix, i);
}
```

## High-Yield Examples To Remember

- Hash map: `Group Anagrams`, `Top K Frequent Elements`, `Longest Consecutive Sequence`
- Two pointers: `Container With Most Water`, `3Sum`, `Two Sum II`
- Sliding window: `Longest Substring Without Repeating Characters`, `Character Replacement`, `Permutation in String`
- Binary search: `Find Minimum in Rotated Sorted Array`, `Search in Rotated Sorted Array`, `Koko Eating Bananas`
- BFS / DFS: `Number of Islands`, `Clone Graph`, `Pacific Atlantic Water Flow`
- Backtracking: `Combination Sum`, `Permutations`, `Palindrome Partitioning`
- 1D DP: `Coin Change`, `House Robber II`, `Decode Ways`
- Stack: `Daily Temperatures`, `Car Fleet`, `Evaluate Reverse Polish Notation`
- Heap: `Kth Largest Element in an Array`, `K Closest Points to Origin`, `Task Scheduler`
- Prefix sum: `Product of Array Except Self`, `Subarray Sum Equals K`, `Contiguous Array`

## Final Reminder

- Pattern recognition matters more than memorizing full solutions.
- For medium problems, explain the brute force before the optimization.
- If stuck, ask: lookup, sorted, window, graph, DP, stack, heap, or prefix?
