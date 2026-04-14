# JavaScript Interview Prep Handbook

This handbook merges the crash-course, exam-prep examples, JavaScript templates, practice plan, and cheat sheet into one study document.

The goal is simple: recognize the pattern fast, explain the optimization clearly, and write clean JavaScript under time pressure.

## Table Of Contents

1. [Study Order](#1-study-order)
2. [Universal Interview Framework](#2-universal-interview-framework)
3. [Pattern Recognition Checklist](#3-pattern-recognition-checklist)
4. [JavaScript Core Templates](#4-javascript-core-templates)
5. [NeetCode Medium Pattern Guide](#5-neetcode-medium-pattern-guide)
6. [Two-Week JavaScript Practice Plan](#6-two-week-javascript-practice-plan)
7. [Final Review Cheat Sheet](#7-final-review-cheat-sheet)

---

## 1. Study Order

Use the handbook in this order:

1. Learn the interview framework.
2. Memorize the pattern recognition checklist.
3. Practice the JavaScript templates until you can write them from memory.
4. Work through the NeetCode medium examples by pattern.
5. Follow the two-week plan.
6. Use the cheat sheet for final review before mock interviews.

If your interview is soon, prioritize this order:

1. Hash map / set
2. Two pointers
3. Sliding window
4. BFS / DFS
5. Binary search
6. Backtracking
7. 1D DP

---

## 2. Universal Interview Framework

Use this exact flow for every medium problem:

1. Clarify the input, output, constraints, duplicates, and edge cases.
2. Walk through a tiny example by hand.
3. State the brute-force solution and explain why it is too slow.
4. Name the bottleneck.
5. Match the bottleneck to a known pattern.
6. Code the simplest correct JavaScript solution.
7. Test with your original example and one edge case.

### Interview Script

Use lines like these in the interview:

- "The brute-force approach would be ... but that costs ..."
- "The bottleneck is repeated lookup / repeated scanning / repeated subproblems."
- "This looks like a ... pattern because ..."
- "I am going to maintain this invariant while I scan."
- "Let me test it on a small example before I finish."

---

## 3. Pattern Recognition Checklist

Ask these questions in order:

1. Have I seen this value, count, or state before?
2. Can sorting replace nested loops with left/right movement?
3. Is the answer a contiguous window?
4. Is there a monotonic yes/no condition or sorted search space?
5. Is this a graph, tree, or grid traversal in disguise?
6. Do I need all valid answers, not just one?
7. Am I recomputing the same subproblem repeatedly?
8. Does each new item resolve something older?
9. Do I only need the top or bottom few elements?
10. Can I turn repeated range work into prefix math?

### Pattern To Problem Mapping

| Recognition clue | Pattern |
| --- | --- |
| Seen before, grouping, counts, duplicates | Hash map / set |
| Sorted array, pair/triplet, both-end scanning | Two pointers |
| Longest/shortest valid substring or subarray | Sliding window |
| Sorted or monotonic search space | Binary search |
| Connected components, reachability, shortest unweighted path | BFS / DFS |
| All combinations, permutations, valid constructions | Backtracking |
| Min/max/ways with overlapping subproblems | Dynamic programming |
| Next greater/smaller or last-in-first-out behavior | Stack |
| Top k, kth best, repeated min/max extraction | Heap |
| Subarray sum or fast range queries | Prefix sum |

### Fast Triage

- Need lookup or counting: hash map or set
- Sorted pair/triplet problem: two pointers
- Contiguous region: sliding window
- Monotonic answer space: binary search
- Grid or graph traversal: BFS or DFS
- Need all valid answers: backtracking
- Repeated subproblems: DP
- Next greater/smaller: stack
- Top k / kth best: heap
- Repeated subarray math: prefix sum

---

## 4. JavaScript Core Templates

Memorize these first.

Use them as skeletons, not strict copy-paste code. In an interview, rename variables so they match the problem statement.

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
  // use count.get(needed) here
  count.set(prefix, (count.get(prefix) ?? 0) + 1);
}
```

### Heap Helper

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

---

## 5. NeetCode Medium Pattern Guide

This section is the condensed study version of the longer exam-prep guide. For each pattern, know how to recognize it, what invariant to maintain, and which high-yield problems to practice.

### Hash Map / Set

- Use it when you need O(1) lookup, grouping, counting, or duplicate detection.
- Main move: store state from earlier elements so you do not scan again.
- Common invariant: the map always reflects everything seen so far.
- High-yield problems: `Group Anagrams`, `Top K Frequent Elements`, `Longest Consecutive Sequence`

### Two Pointers

- Use it when the array is sorted or can be sorted, and you need pair or triplet logic.
- Main move: move only the pointer that can improve the answer.
- Common invariant: everything outside the current pointer range is already ruled out.
- High-yield problems: `Container With Most Water`, `3Sum`, `Two Sum II`

### Sliding Window

- Use it for contiguous substring or subarray optimization.
- Main move: expand right, shrink left only when invalid.
- Common invariant: the current window always satisfies the tracked rule after shrinking.
- High-yield problems: `Longest Substring Without Repeating Characters`, `Longest Repeating Character Replacement`, `Permutation in String`

### Binary Search

- Use it when the search space is sorted or monotonic.
- Main move: use `mid` to discard half of the search space.
- Common invariant: the answer still remains within `[left, right]`.
- High-yield problems: `Find Minimum in Rotated Sorted Array`, `Search in Rotated Sorted Array`, `Koko Eating Bananas`

### BFS / DFS

- Use it for traversal, connected components, reachability, and flood fill.
- Main move: visit each node once and mark it immediately.
- Common invariant: visited nodes never need to be processed again.
- High-yield problems: `Number of Islands`, `Clone Graph`, `Pacific Atlantic Water Flow`

### Backtracking

- Use it when the answer is all valid combinations or constructions.
- Main move: choose, recurse, undo.
- Common invariant: `path` always represents the current partial answer.
- High-yield problems: `Combination Sum`, `Permutations`, `Palindrome Partitioning`

### 1D DP

- Use it when smaller answers build larger ones and brute force repeats work.
- Main move: define `dp[i]` in plain English before writing code.
- Common invariant: every `dp[i]` is fully solved before later states use it.
- High-yield problems: `Coin Change`, `House Robber II`, `Decode Ways`

### Stack / Monotonic Stack

- Use it for next greater/smaller logic or ordered resolution of previous items.
- Main move: keep unresolved indices on the stack.
- Common invariant: the stack preserves the monotonic property you need.
- High-yield problems: `Daily Temperatures`, `Car Fleet`, `Evaluate Reverse Polish Notation`

### Heap / Priority Queue

- Use it when you repeatedly need the top or bottom element, or only the best `k` values matter.
- Main move: maintain a heap with only the useful candidates.
- Common invariant: the root is always the next best removable element.
- High-yield problems: `Kth Largest Element in an Array`, `K Closest Points to Origin`, `Task Scheduler`

### Prefix Sum

- Use it for subarray sums and repeated range calculations.
- Main move: turn a range condition into a relationship between two prefix states.
- Common invariant: `prefix` represents the sum up to the current position.
- High-yield problems: `Product of Array Except Self`, `Subarray Sum Equals K`, `Contiguous Array`

### Core Example Walkthrough List

Use this as your must-practice list:

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

For full walkthroughs and full JavaScript solutions, use `neetcode-medium-exam-prep.md`.

### Minimum Set If Time Is Tight

If you only have time for 8 problems, do these:

1. `Group Anagrams`
2. `Top K Frequent Elements`
3. `3Sum`
4. `Longest Substring Without Repeating Characters`
5. `Find Minimum in Rotated Sorted Array`
6. `Number of Islands`
7. `Combination Sum`
8. `Coin Change`

---

## 6. Two-Week JavaScript Practice Plan

### Week 1: Highest Yield

#### Day 1

- Review `Map` and `Set`
- Solve `Group Anagrams`
- Solve `Top K Frequent Elements`
- Solve `Longest Consecutive Sequence`

#### Day 2

- Solve `Container With Most Water`
- Solve `3Sum`
- Solve `Two Sum II`

#### Day 3

- Solve `Longest Substring Without Repeating Characters`
- Solve `Longest Repeating Character Replacement`
- Solve `Permutation in String`

#### Day 4

- Solve `Find Minimum in Rotated Sorted Array`
- Solve `Search in Rotated Sorted Array`
- Solve `Koko Eating Bananas`

#### Day 5

- Solve `Number of Islands`
- Solve `Clone Graph`
- Solve `Pacific Atlantic Water Flow`

#### Day 6

- Re-solve one missed problem
- Write JS templates from memory
- Do one timed medium

#### Day 7

- Do two timed mediums
- Explain both solutions out loud

### Week 2: Expansion

#### Day 8

- Solve `Combination Sum`
- Solve `Permutations`
- Solve `Palindrome Partitioning`

#### Day 9

- Solve `Coin Change`
- Solve `House Robber II`
- Solve `Decode Ways`

#### Day 10

- Solve `Daily Temperatures`
- Solve `Car Fleet`
- Solve `Evaluate Reverse Polish Notation`

#### Day 11

- Review heap helper
- Solve `Kth Largest Element in an Array`
- Solve `K Closest Points to Origin`
- Solve `Task Scheduler`

#### Day 12

- Solve `Product of Array Except Self`
- Solve `Subarray Sum Equals K`
- Solve `Contiguous Array`

#### Day 13

- Do three mixed mediums without notes
- After each one, write the pattern and invariant in one sentence

#### Day 14

- Do two full mock interview rounds
- Review failures by category: pattern recognition, JS syntax, edge cases, testing

---

## 7. Final Review Cheat Sheet

### Interview Loop

1. Clarify.
2. Give example.
3. State brute force.
4. Name bottleneck.
5. Match pattern.
6. Code.
7. Test.

### Pattern Summary

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

### Last-Minute Reminders

- Pattern recognition matters more than memorizing exact code.
- Explain the brute force before the optimization.
- State your invariant out loud.
- Test small inputs before you stop.
- In JavaScript, remember that `Map`, `Set`, arrays, and string indexing are usually enough for most mediums.
- If you need a priority queue, bring a short heap helper.

### Printing Note

- Use this handbook for sequence and pattern review.
- Use `interview-prep-cheat-sheet.md` or the cram sheet below for last-minute scanning.

## Related Files

- `interview-prep.md`
- `neetcode-medium-exam-prep.md`
- `interview-prep-cheat-sheet.md`
- `javascript-neetcode-templates.md`
- `javascript-2-week-practice-plan.md`
