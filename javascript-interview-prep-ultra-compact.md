# JavaScript Interview Prep Ultra-Compact

## Interview Loop

1. Clarify.
2. Tiny example.
3. Brute force.
4. Bottleneck.
5. Pattern.
6. Code.
7. Test.

## Pattern Triage

- Seen before, counts, grouping: hash map / set
- Sorted pair or triplet: two pointers
- Contiguous substring or subarray: sliding window
- Sorted or monotonic space: binary search
- Grid, graph, connected region: BFS / DFS
- All valid answers: backtracking
- Repeated subproblems: DP
- Next greater or previous smaller: stack
- Top k / kth best: heap
- Subarray or range math: prefix sum

## Invariants

- Hash map: map reflects prior state
- Two pointers: move only the useful side
- Sliding window: shrink only when invalid
- Binary search: answer stays in bounds
- BFS / DFS: mark visited early
- Backtracking: choose, recurse, undo
- DP: define `dp[i]` before code
- Stack: maintain monotonic or LIFO order
- Heap: root is current best removable item
- Prefix sum: use prefix differences

## JavaScript Core Snippets

```javascript
map.set(x, (map.get(x) ?? 0) + 1)
```

```javascript
nums.sort((a, b) => a - b)
```

```javascript
const mid = Math.floor((left + right) / 2)
```

```javascript
const count = new Map([[0, 1]])
```

## Templates To Memorize

### Two Pointers

```javascript
while (left < right) {
  if (good()) left++;
  else right--;
}
```

### Sliding Window

```javascript
for (let right = 0; right < arr.length; right++) {
  add(arr[right]);
  while (invalid()) remove(arr[left++]);
}
```

### Binary Search

```javascript
while (left <= right) {
  const mid = Math.floor((left + right) / 2);
}
```

### DFS

```javascript
function dfs(node) {
  if (bad(node)) return;
  for (const next of neighbors(node)) dfs(next);
}
```

### BFS

```javascript
const queue = [start];
for (let i = 0; i < queue.length; i++) queue.push(...nextNodes);
```

### Backtracking

```javascript
path.push(choice);
backtrack(next);
path.pop();
```

## 10 Problems To Know Cold

1. `Group Anagrams`
2. `Top K Frequent Elements`
3. `3Sum`
4. `Longest Substring Without Repeating Characters`
5. `Character Replacement`
6. `Find Minimum in Rotated Sorted Array`
7. `Number of Islands`
8. `Combination Sum`
9. `Coin Change`
10. `Kth Largest Element in an Array`

## If You Freeze

1. Does sorting help?
2. Does a map remove a nested loop?
3. Is this a window?
4. Is this traversal in disguise?
5. Is this repeated subproblem work?

## Final Reminder

- Clean code beats clever code.
- Communication matters.
- Test before you stop.
