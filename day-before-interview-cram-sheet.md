# Day-Before-Interview Cram Sheet

Use this the day before or the hour before the interview.

## Interview Flow

1. Clarify input, output, and edge cases.
2. Give a tiny example.
3. State brute force.
4. Name the bottleneck.
5. Pick the pattern.
6. Code.
7. Test.

## Pattern Triage

- Seen before, counts, grouping: hash map / set
- Sorted pair or triplet: two pointers
- Longest or shortest contiguous region: sliding window
- Sorted or monotonic search space: binary search
- Grid, graph, connected region: BFS / DFS
- All combinations or constructions: backtracking
- Best value or number of ways with repeated work: DP
- Next greater or previous smaller: stack
- Top k or repeated best element: heap
- Subarray sums or repeated range work: prefix sum

## Must-Remember Invariants

- Hash map: map reflects everything seen so far
- Two pointers: move only the pointer that can improve the answer
- Sliding window: shrink only when invalid
- Binary search: answer stays inside current bounds
- BFS / DFS: mark visited early
- Backtracking: choose, recurse, undo
- DP: define `dp[i]` in English first
- Stack: maintain monotonic or LIFO invariant
- Heap: root is current best removable element
- Prefix sum: subarray condition becomes prefix difference

## JavaScript Reminders

- Frequency map:

```javascript
map.set(x, (map.get(x) ?? 0) + 1)
```

- Set membership:

```javascript
set.has(x)
```

- Array sort numbers correctly:

```javascript
nums.sort((a, b) => a - b)
```

- Binary search midpoint:

```javascript
const mid = Math.floor((left + right) / 2)
```

- Prefix sum count seed:

```javascript
const count = new Map([[0, 1]])
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

## If You Get Stuck

1. Ask yourself whether sorting helps.
2. Ask whether a map removes a nested loop.
3. Ask whether the problem is really a contiguous window.
4. Ask whether this is a traversal problem in disguise.
5. Ask whether the same subproblem appears again.

## Final Reminders

- Communicate constantly.
- Clean code beats clever code.
- Test before you say you are done.
- Pattern recognition matters more than memorizing exact lines.
