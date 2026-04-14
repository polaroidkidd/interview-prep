# NeetCode Medium Exam Prep Guide

This document turns the crash-course in `interview-prep.md` into an exam-prep handout.

The goal is not to memorize individual solutions. The goal is to recognize the pattern fast, explain the brute force, switch to the right optimization, and walk through a clean example under pressure.

All reference solutions below are written in JavaScript.

## How To Use This Guide

1. Read the pattern signals before you look at the examples.
2. For each example, say out loud why that pattern fits.
3. Re-do the walkthrough on paper without looking.
4. After that, code the pattern template from memory.
5. Time yourself: 2-3 minutes to identify the pattern, 15-20 minutes to implement, 2-3 minutes to test.

## Universal Interview Flow

Use this same sequence for every medium problem:

1. Clarify input, output, constraints, duplicates, and edge cases.
2. Walk through a tiny example by hand.
3. State the brute-force solution and its time complexity.
4. Name the bottleneck.
5. Match the bottleneck to a known pattern.
6. Code, then re-test with the same example and one edge case.

---

## 1. Hash Map / Hash Set

### Recognize It Fast

- You need O(1) lookup for a value seen earlier.
- The problem asks for counts, grouping, duplicates, or membership.
- A nested loop can be replaced by storing information from the first pass.

### Core Method

1. Decide the key: value, frequency, signature, or prefix state.
2. Scan once and update the map or set.
3. Use the stored information to answer in O(1) per step.

### Common Mistakes

- Picking the wrong key.
- Forgetting to update counts after reading a value.
- Using a map when a set is enough.

### Medium Examples

#### Group Anagrams

- Why this pattern: different strings should land in the same bucket if they share a common signature.
- Walkthrough: for `["eat","tea","tan","ate","nat","bat"]`, use sorted string as the key. `eat`, `tea`, and `ate` all map to `aet`; `tan` and `nat` map to `ant`; `bat` maps to `abt`.
- Exam move: define the signature first. In interviews, sorted-string keys are usually the simplest explanation.
- Complexity: `O(n * k log k)` where `k` is average word length.

```javascript
function groupAnagrams(strs) {
  const groups = new Map();

  for (const str of strs) {
    const key = str.split('').sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(str);
  }

  return [...groups.values()];
}
```

#### Top K Frequent Elements

- Why this pattern: you cannot pick the top k until you count frequencies.
- Walkthrough: for `[1,1,1,2,2,3]` and `k = 2`, first build `{1:3, 2:2, 3:1}`. Then select the two largest frequencies using a bucket approach or heap.
- Exam move: separate the problem into two stages: count first, select second.
- Complexity: `O(n)` with buckets or `O(n log k)` with a heap.

```javascript
function topKFrequent(nums, k) {
  const count = new Map();
  for (const num of nums) {
    count.set(num, (count.get(num) ?? 0) + 1);
  }

  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of count) {
    buckets[freq].push(num);
  }

  const result = [];
  for (let freq = buckets.length - 1; freq >= 0 && result.length < k; freq--) {
    for (const num of buckets[freq]) {
      result.push(num);
      if (result.length === k) return result;
    }
  }

  return result;
}
```

#### Longest Consecutive Sequence

- Why this pattern: constant-time membership checks turn repeated searching into a linear scan.
- Walkthrough: for `[100,4,200,1,3,2]`, make a set. Only start expanding from numbers with no predecessor. `1` starts a chain: `1,2,3,4`, length `4`. `2`, `3`, and `4` are skipped because they are not starts.
- Exam move: the key optimization is to grow sequences only from their first element.
- Complexity: `O(n)`.

```javascript
function longestConsecutive(nums) {
  const seen = new Set(nums);
  let best = 0;

  for (const num of seen) {
    if (seen.has(num - 1)) continue;

    let current = num;
    let length = 1;

    while (seen.has(current + 1)) {
      current++;
      length++;
    }

    best = Math.max(best, length);
  }

  return best;
}
```

---

## 2. Two Pointers

### Recognize It Fast

- The array is sorted or can be sorted.
- You need a pair, triplet, palindrome check, or best answer from both ends.
- The brute force is usually `O(n^2)` with left/right choices.

### Core Method

1. Put one pointer at each end or use a slow and fast pointer.
2. Use the current state to decide which pointer move can improve the answer.
3. Never move both blindly; tie the move to the invariant.

### Common Mistakes

- Forgetting to sort when the pattern needs order.
- Moving the wrong pointer.
- Missing duplicate skipping after sorting.

### Medium Examples

#### Container With Most Water

- Why this pattern: the area depends on both ends, and only one pointer move can possibly help.
- Walkthrough: for `[1,8,6,2,5,4,8,3,7]`, start at both ends. Area is `min(1,7) * 8 = 8`, so move left because height `1` is the bottleneck. At `8` and `7`, area becomes `7 * 7 = 49`, which is the best answer.
- Exam move: always move the shorter side, because the shorter line limits the area.
- Complexity: `O(n)`.

```javascript
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;

  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    best = Math.max(best, width * h);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return best;
}
```

#### 3Sum

- Why this pattern: after sorting, each fixed index reduces the rest of the problem to a two-sum search.
- Walkthrough: for `[-1,0,1,2,-1,-4]`, sort to `[-4,-1,-1,0,1,2]`. Fix `-1` at index `1`, then search between the remaining left and right pointers to find `[-1,-1,2]` and `[-1,0,1]`.
- Exam move: after sorting, skip duplicate anchors and skip duplicate pointer values after a match.
- Complexity: `O(n^2)`.

```javascript
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;

        while (left < right && nums[left] === nums[left - 1]) left++;
        while (left < right && nums[right] === nums[right + 1]) right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}
```

#### Two Sum II - Input Array Is Sorted

- Why this pattern: sorted order tells you whether the current sum is too small or too large.
- Walkthrough: for `[2,7,11,15]` and target `9`, start with `2` and `15`. Sum `17` is too large, so move right leftward. Then `2 + 7 = 9`, done.
- Exam move: if the sum is too small, increase the left pointer; if too large, decrease the right pointer.
- Complexity: `O(n)`.

```javascript
function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }

  return [];
}
```

---

## 3. Sliding Window

### Recognize It Fast

- The problem asks for longest, shortest, or count of a valid substring or subarray.
- You need a contiguous region.
- The window can grow and shrink while maintaining a condition.

### Core Method

1. Expand the right pointer every step.
2. Update the state for the new element.
3. While the window is invalid, shrink from the left.
4. Record the answer when the window is valid.

### Common Mistakes

- Shrinking too early before the window becomes invalid.
- Forgetting what makes the window valid.
- Recomputing the whole window instead of updating incrementally.

### Medium Examples

#### Longest Substring Without Repeating Characters

- Why this pattern: the answer is a longest valid contiguous substring, and validity means no duplicates.
- Walkthrough: for `"abcabcbb"`, expand to `abc`. When the next `a` arrives, shrink from the left until `a` is no longer duplicated. Continue until the best length stays `3`.
- Exam move: the invariant is that the current window always contains unique characters.
- Complexity: `O(n)`.

```javascript
function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }

    seen.add(s[right]);
    best = Math.max(best, right - left + 1);
  }

  return best;
}
```

#### Longest Repeating Character Replacement

- Why this pattern: you want the longest window that can be fixed with at most `k` replacements.
- Walkthrough: for `"AABABBA"` and `k = 1`, track the count of the most frequent character inside the window. If `window_size - max_freq > k`, shrink. The best valid window length is `4`.
- Exam move: do not try to rebuild the window each time; track counts and a running max frequency.
- Complexity: `O(n)`.

```javascript
function characterReplacement(s, k) {
  const count = new Map();
  let left = 0;
  let maxFreq = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    count.set(s[right], (count.get(s[right]) ?? 0) + 1);
    maxFreq = Math.max(maxFreq, count.get(s[right]));

    while (right - left + 1 - maxFreq > k) {
      count.set(s[left], count.get(s[left]) - 1);
      left++;
    }

    best = Math.max(best, right - left + 1);
  }

  return best;
}
```

#### Permutation in String

- Why this pattern: you need to know whether any fixed-length window in `s2` matches the character counts of `s1`.
- Walkthrough: if `s1 = "ab"` and `s2 = "eidbaooo"`, use a window of length `2`. The windows `ei`, `id`, `db` fail, but `ba` matches the frequency of `ab`, so return true.
- Exam move: fixed-size windows are often simpler than variable windows because each step adds one char and removes one char.
- Complexity: `O(n)`.

```javascript
function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;

  const base = 'a'.charCodeAt(0);
  const need = Array(26).fill(0);
  const window = Array(26).fill(0);

  for (const ch of s1) {
    need[ch.charCodeAt(0) - base]++;
  }

  for (let i = 0; i < s1.length; i++) {
    window[s2.charCodeAt(i) - base]++;
  }

  let matches = 0;
  for (let i = 0; i < 26; i++) {
    if (need[i] === window[i]) matches++;
  }

  for (let right = s1.length; right < s2.length; right++) {
    if (matches === 26) return true;

    const addIndex = s2.charCodeAt(right) - base;
    window[addIndex]++;
    if (window[addIndex] === need[addIndex]) matches++;
    else if (window[addIndex] === need[addIndex] + 1) matches--;

    const removeIndex = s2.charCodeAt(right - s1.length) - base;
    window[removeIndex]--;
    if (window[removeIndex] === need[removeIndex]) matches++;
    else if (window[removeIndex] === need[removeIndex] - 1) matches--;
  }

  return matches === 26;
}
```

---

## 4. Binary Search

### Recognize It Fast

- The input is sorted, rotated-sorted, or answerable by a monotonic yes/no condition.
- The question asks for a boundary, minimum valid value, or target index.
- The brute force is linear scan over an ordered search space.

### Core Method

1. Define the search space.
2. Decide the monotonic rule.
3. Use `mid` to discard half.
4. Be explicit about whether the answer can stay at `mid`.

### Common Mistakes

- Using binary search without a monotonic property.
- Mixing up inclusive and exclusive bounds.
- Forgetting whether you want the first true, last true, or exact value.

### Medium Examples

#### Find Minimum in Rotated Sorted Array

- Why this pattern: one half is always sorted, and the minimum lies in the unsorted half or at the boundary.
- Walkthrough: for `[4,5,6,7,0,1,2]`, compare `mid` with the right end. If `nums[mid] > nums[right]`, the minimum must be to the right. Otherwise it is at `mid` or to the left.
- Exam move: compare with `right`, not just neighbors. That gives a clean monotonic rule.
- Complexity: `O(log n)`.

```javascript
function findMin(nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return nums[left];
}
```

#### Search in Rotated Sorted Array

- Why this pattern: every midpoint splits the array into one sorted half and one rotated half.
- Walkthrough: for `[4,5,6,7,0,1,2]` searching for `0`, inspect `mid = 7`. Left half `[4,5,6,7]` is sorted, but `0` is not in that range, so discard it. Continue on the right half to find `0`.
- Exam move: first detect which half is sorted, then ask whether the target is inside that half.
- Complexity: `O(log n)`.

```javascript
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}
```

#### Koko Eating Bananas

- Why this pattern: the answer is not an index, it is the minimum speed that makes the total hours valid.
- Walkthrough: if piles are `[3,6,7,11]` and `h = 8`, try a speed `k`. Compute the hours needed. If the hours are too high, `k` is too small; otherwise `k` is valid and you try smaller values.
- Exam move: this is binary search on the answer space, not on the array itself.
- Complexity: `O(n log m)` where `m` is the max pile.

```javascript
function minEatingSpeed(piles, h) {
  let left = 1;
  let right = Math.max(...piles);

  while (left < right) {
    const speed = Math.floor((left + right) / 2);
    let hours = 0;

    for (const pile of piles) {
      hours += Math.ceil(pile / speed);
    }

    if (hours > h) left = speed + 1;
    else right = speed;
  }

  return left;
}
```

---

## 5. BFS / DFS

### Recognize It Fast

- The problem is about connected components, reachability, shortest path in an unweighted graph, or flood fill.
- It is a grid, tree, or general graph traversal problem.
- The hidden question is often, "how do I visit each node once?"

### Core Method

1. Decide whether traversal should be level-order or depth-first.
2. Mark visited as early as possible.
3. Iterate through neighbors using a reusable direction list or adjacency list.

### Common Mistakes

- Marking visited too late and revisiting nodes.
- Forgetting disconnected components.
- Using BFS when the task is naturally recursive DFS, or vice versa, without being clear why.

### Medium Examples

#### Number of Islands

- Why this pattern: each island is a connected component in a grid.
- Walkthrough: scan the grid. When you hit a `1`, increment the island count and run DFS or BFS to flip the entire island to visited. Continue scanning until the grid is exhausted.
- Exam move: treat each new unvisited land cell as the start of one whole component.
- Complexity: `O(rows * cols)`.

```javascript
function numIslands(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let islands = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] !== '1') continue;

      islands++;
      const queue = [[row, col]];
      grid[row][col] = '0';

      for (let i = 0; i < queue.length; i++) {
        const [r, c] = queue[i];

        for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;

          if (
            nr >= 0 && nr < rows &&
            nc >= 0 && nc < cols &&
            grid[nr][nc] === '1'
          ) {
            grid[nr][nc] = '0';
            queue.push([nr, nc]);
          }
        }
      }
    }
  }

  return islands;
}
```

#### Clone Graph

- Why this pattern: you must traverse the whole graph and build a copied node for each original node exactly once.
- Walkthrough: start at the given node, create its clone, and use BFS or DFS to visit neighbors. Store `original -> clone` in a map so repeated edges reuse the same copied node.
- Exam move: the map is what prevents duplicate node creation.
- Complexity: `O(V + E)`.

```javascript
function cloneGraph(node) {
  if (!node) return null;

  const clones = new Map();

  function dfs(current) {
    if (clones.has(current)) return clones.get(current);

    const copy = new Node(current.val);
    clones.set(current, copy);

    for (const neighbor of current.neighbors) {
      copy.neighbors.push(dfs(neighbor));
    }

    return copy;
  }

  return dfs(node);
}
```

#### Pacific Atlantic Water Flow

- Why this pattern: reverse the viewpoint and ask which cells each ocean can reach.
- Walkthrough: instead of starting from every cell, start DFS or BFS from the Pacific border and Atlantic border separately. Move only to heights that are greater than or equal to the current cell. Intersect the two reachable sets.
- Exam move: reverse-traversal is the key optimization; it is much cheaper than starting from every cell.
- Complexity: `O(rows * cols)`.

```javascript
function pacificAtlantic(heights) {
  const rows = heights.length;
  const cols = heights[0].length;
  const pacific = Array.from({ length: rows }, () => Array(cols).fill(false));
  const atlantic = Array.from({ length: rows }, () => Array(cols).fill(false));
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function dfs(row, col, visited) {
    if (visited[row][col]) return;
    visited[row][col] = true;

    for (const [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;

      if (
        nr < 0 || nr >= rows ||
        nc < 0 || nc >= cols ||
        visited[nr][nc] ||
        heights[nr][nc] < heights[row][col]
      ) {
        continue;
      }

      dfs(nr, nc, visited);
    }
  }

  for (let row = 0; row < rows; row++) {
    dfs(row, 0, pacific);
    dfs(row, cols - 1, atlantic);
  }

  for (let col = 0; col < cols; col++) {
    dfs(0, col, pacific);
    dfs(rows - 1, col, atlantic);
  }

  const result = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (pacific[row][col] && atlantic[row][col]) {
        result.push([row, col]);
      }
    }
  }

  return result;
}
```

---

## 6. Recursion + Backtracking

### Recognize It Fast

- You need all combinations, permutations, subsets, or valid constructions.
- The answer is a list of possibilities, not a single numeric optimum.
- You build a partial solution, recurse, then undo the choice.

### Core Method

1. Track the current path.
2. Make one choice.
3. Recurse on the smaller problem.
4. Undo the choice before trying the next branch.

### Common Mistakes

- Forgetting to undo a choice.
- Missing the base case.
- Copying the path at the wrong time.

### Medium Examples

#### Combination Sum

- Why this pattern: you need all valid combinations, and each choice leads to a smaller remaining target.
- Walkthrough: for candidates `[2,3,6,7]` and target `7`, try `2` repeatedly until the target goes negative or zero. Paths like `[2,2,3]` and `[7]` are valid answers.
- Exam move: stay at the same index when reuse is allowed; move forward only when duplicates are not allowed.
- Complexity: exponential in the number of combinations.

```javascript
function combinationSum(candidates, target) {
  const result = [];
  const path = [];

  function backtrack(index, remaining) {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }

    if (remaining < 0 || index === candidates.length) return;

    path.push(candidates[index]);
    backtrack(index, remaining - candidates[index]);
    path.pop();

    backtrack(index + 1, remaining);
  }

  backtrack(0, target);
  return result;
}
```

#### Permutations

- Why this pattern: every position in the output can choose from the remaining unused elements.
- Walkthrough: for `[1,2,3]`, choose `1` first, then recurse on `[2,3]`; backtrack and choose `2` first; continue until all length-3 paths are built.
- Exam move: use a `used` array or swap-in-place strategy.
- Complexity: `O(n * n!)`.

```javascript
function permute(nums) {
  const result = [];
  const path = [];
  const used = Array(nums.length).fill(false);

  function backtrack() {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;

      used[i] = true;
      path.push(nums[i]);
      backtrack();
      path.pop();
      used[i] = false;
    }
  }

  backtrack();
  return result;
}
```

#### Palindrome Partitioning

- Why this pattern: you try all valid cuts, but only recurse on cuts that keep the current substring valid.
- Walkthrough: for `"aab"`, start with `a`, then another `a`, then `b` to get `["a","a","b"]`. Also try `aa`, then `b` to get `["aa","b"]`.
- Exam move: validate each substring before recursing so invalid branches die early.
- Complexity: exponential.

```javascript
function partition(s) {
  const result = [];
  const path = [];

  function isPalindrome(left, right) {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  }

  function backtrack(start) {
    if (start === s.length) {
      result.push([...path]);
      return;
    }

    for (let end = start; end < s.length; end++) {
      if (!isPalindrome(start, end)) continue;

      path.push(s.slice(start, end + 1));
      backtrack(end + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}
```

---

## 7. Dynamic Programming (Start With 1D DP)

### Recognize It Fast

- The problem asks for a best count, minimum cost, maximum value, or number of ways.
- Recursive brute force repeats the same subproblems.
- The current answer depends on a small number of earlier answers.

### Core Method

1. Define `dp[i]` in plain English.
2. Write the recurrence.
3. Set base cases.
4. Fill left-to-right or right-to-left in dependency order.

### Common Mistakes

- Writing code before defining what `dp[i]` means.
- Mixing different state meanings in one array.
- Forgetting base cases for small inputs.

### Medium Examples

#### Coin Change

- Why this pattern: the same remaining amount appears repeatedly in brute force.
- Walkthrough: for coins `[1,2,5]` and amount `11`, define `dp[x]` as the fewest coins needed for total `x`. Build from `0` upward until `dp[11] = 3` using `5 + 5 + 1`.
- Exam move: initialize impossible states to infinity and minimize over previous reachable states.
- Complexity: `O(amount * number_of_coins)`.

```javascript
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let value = 1; value <= amount; value++) {
    for (const coin of coins) {
      if (coin <= value) {
        dp[value] = Math.min(dp[value], dp[value - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

#### House Robber II

- Why this pattern: each house depends on whether you robbed the previous one, but the circle creates one extra constraint.
- Walkthrough: because first and last houses are adjacent, solve two linear cases: rob from `[0..n-2]` and from `[1..n-1]`. Take the max.
- Exam move: reduce the circle to two standard House Robber runs.
- Complexity: `O(n)`.

```javascript
function rob(nums) {
  if (nums.length === 1) return nums[0];

  function robLine(start, end) {
    let prevTwo = 0;
    let prevOne = 0;

    for (let i = start; i <= end; i++) {
      const current = Math.max(prevOne, prevTwo + nums[i]);
      prevTwo = prevOne;
      prevOne = current;
    }

    return prevOne;
  }

  return Math.max(robLine(0, nums.length - 2), robLine(1, nums.length - 1));
}
```

#### Decode Ways

- Why this pattern: each index can branch to one-digit and two-digit decodes, and many suffixes repeat.
- Walkthrough: for `"226"`, index `0` can use `2` or `22`. Valid parses are `2-2-6`, `22-6`, and `2-26`, so the answer is `3`.
- Exam move: define `dp[i]` as the number of decodings starting at index `i`.
- Complexity: `O(n)`.

```javascript
function numDecodings(s) {
  const dp = Array(s.length + 1).fill(0);
  dp[s.length] = 1;

  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === '0') continue;

    dp[i] = dp[i + 1];

    if (
      i + 1 < s.length &&
      (s[i] === '1' || (s[i] === '2' && s[i + 1] <= '6'))
    ) {
      dp[i] += dp[i + 2];
    }
  }

  return dp[0];
}
```

---

## 8. Stack / Monotonic Stack

### Recognize It Fast

- You need the next greater, previous smaller, valid nesting, or a last-in-first-out evaluation order.
- Each new element resolves questions for earlier elements.
- The brute force compares each item with many items to its right or left.

### Core Method

1. Decide what belongs on the stack: values, indices, or frames.
2. Maintain the invariant while pushing and popping.
3. Use pops to finalize answers for older items.

### Common Mistakes

- Storing values when indices are needed.
- Forgetting the monotonic invariant.
- Missing the cleanup pass for circular or leftover cases.

### Medium Examples

#### Daily Temperatures

- Why this pattern: each temperature wants the next warmer day to its right.
- Walkthrough: keep a decreasing stack of indices. When `76` arrives after `75`, pop `75` and write the distance `1`. Continue until the stack is decreasing again.
- Exam move: the stack stores unresolved days, not just temperatures.
- Complexity: `O(n)`.

```javascript
function dailyTemperatures(temperatures) {
  const result = Array(temperatures.length).fill(0);
  const stack = [];

  for (let i = 0; i < temperatures.length; i++) {
    while (
      stack.length &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const prevIndex = stack.pop();
      result[prevIndex] = i - prevIndex;
    }

    stack.push(i);
  }

  return result;
}
```

#### Car Fleet

- Why this pattern: after sorting by position, cars merge into fleets based on arrival times, and later cars can absorb earlier ones.
- Walkthrough: compute each car's time to reach the target from right to left. If a car's time is less than or equal to the fleet ahead, it joins that fleet; otherwise it starts a new fleet.
- Exam move: the stack is really tracking increasing fleet times.
- Complexity: `O(n log n)` because of sorting.

```javascript
function carFleet(target, position, speed) {
  const cars = position
    .map((pos, index) => [pos, speed[index]])
    .sort((a, b) => b[0] - a[0]);

  let fleets = 0;
  let slowestTime = 0;

  for (const [pos, spd] of cars) {
    const time = (target - pos) / spd;
    if (time > slowestTime) {
      fleets++;
      slowestTime = time;
    }
  }

  return fleets;
}
```

#### Evaluate Reverse Polish Notation

- Why this pattern: operators consume the most recent unresolved operands.
- Walkthrough: for `["2","1","+","3","*"]`, push `2`, push `1`, apply `+` to get `3`, push `3`, apply `*` to get `9`.
- Exam move: this is a pure stack evaluation problem, and operand order matters for subtraction and division.
- Complexity: `O(n)`.

```javascript
function evalRPN(tokens) {
  const stack = [];

  for (const token of tokens) {
    if (token === '+' || token === '-' || token === '*' || token === '/') {
      const right = stack.pop();
      const left = stack.pop();

      if (token === '+') stack.push(left + right);
      else if (token === '-') stack.push(left - right);
      else if (token === '*') stack.push(left * right);
      else stack.push(Math.trunc(left / right));
    } else {
      stack.push(Number(token));
    }
  }

  return stack[0];
}
```

---

## 9. Heap / Priority Queue

### Recognize It Fast

- You need the largest, smallest, top k, or next item by priority.
- The answer changes dynamically as new elements arrive.
- Sorting everything would work, but it costs more than necessary.

### Core Method

1. Decide between min-heap and max-heap.
2. Keep only the useful candidates in the heap.
3. Push and pop to maintain the top-k or next-best element.

### Common Mistakes

- Using a heap when sorting once is simpler.
- Keeping all elements when only `k` matter.
- Forgetting that JavaScript does not have a built-in priority queue in standard interviews, so you may need a small heap helper.

### JavaScript Heap Helper

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
    const length = this.data.length;

    while (true) {
      let smallest = index;
      const left = index * 2 + 1;
      const right = index * 2 + 2;

      if (left < length && this.compare(this.data[smallest], this.data[left]) > 0) {
        smallest = left;
      }

      if (right < length && this.compare(this.data[smallest], this.data[right]) > 0) {
        smallest = right;
      }

      if (smallest === index) break;
      [this.data[index], this.data[smallest]] = [this.data[smallest], this.data[index]];
      index = smallest;
    }
  }
}
```

### Medium Examples

#### Kth Largest Element in an Array

- Why this pattern: you do not need full sorted order, only the kth largest boundary.
- Walkthrough: maintain a min-heap of size `k`. For `[3,2,1,5,6,4]` with `k = 2`, keep only the two largest seen so far. The heap ends as `[5,6]`, so the root `5` is the answer.
- Exam move: a size-`k` min-heap is the standard pattern for kth largest.
- Complexity: `O(n log k)`.

```javascript
function findKthLargest(nums, k) {
  const minHeap = new Heap((a, b) => a - b);

  for (const num of nums) {
    minHeap.push(num);
    if (minHeap.size() > k) minHeap.pop();
  }

  return minHeap.peek();
}
```

#### K Closest Points to Origin

- Why this pattern: each point has a priority equal to its distance from the origin.
- Walkthrough: compute squared distance `x^2 + y^2` so you avoid square roots. Keep the `k` closest points in a max-heap of size `k` or push all points into a min-heap and pop `k` times.
- Exam move: squared distance preserves the same ordering as actual distance.
- Complexity: `O(n log k)` with a bounded heap.

```javascript
function kClosest(points, k) {
  const maxHeap = new Heap((a, b) => b[0] - a[0]);

  for (const point of points) {
    const distance = point[0] * point[0] + point[1] * point[1];
    maxHeap.push([distance, point]);
    if (maxHeap.size() > k) maxHeap.pop();
  }

  return maxHeap.data.map((entry) => entry[1]);
}
```

#### Task Scheduler

- Why this pattern: each step chooses the currently most useful remaining task, but cooldown blocks immediate reuse.
- Walkthrough: count task frequencies, push them into a max-heap, and process in cycles of size `n + 1`. Reinsert tasks that still have remaining count after cooldown.
- Exam move: the heap handles highest frequency, and the cooldown queue handles when a task becomes available again.
- Complexity: `O(n log k)` where `k` is number of distinct tasks.

```javascript
function leastInterval(tasks, n) {
  const count = new Map();
  for (const task of tasks) {
    count.set(task, (count.get(task) ?? 0) + 1);
  }

  const maxHeap = new Heap((a, b) => b - a);
  for (const freq of count.values()) {
    maxHeap.push(freq);
  }

  let time = 0;
  const queue = [];

  while (maxHeap.size() || queue.length) {
    time++;

    while (queue.length && queue[0][1] < time) {
      maxHeap.push(queue.shift()[0]);
    }

    if (maxHeap.size()) {
      const remaining = maxHeap.pop() - 1;
      if (remaining > 0) queue.push([remaining, time + n]);
    }
  }

  return time;
}
```

---

## 10. Prefix Sum

### Recognize It Fast

- The problem asks about subarray sums, counts of subarrays, or quick range totals.
- You need to turn a range computation into a difference of two earlier states.
- The brute force recomputes sums for many overlapping ranges.

### Core Method

1. Track cumulative sum as you scan.
2. Translate a condition on a subarray into a condition on prefix sums.
3. Use a map when you need counts or earliest positions.

### Common Mistakes

- Forgetting the base prefix `0` in the map.
- Confusing "count occurrences" with "track first index".
- Recomputing range sums instead of using differences.

### Medium Examples

#### Product of Array Except Self

- Why this pattern: every answer depends on everything before and after the index.
- Walkthrough: for `[1,2,3,4]`, the left products are `[1,1,2,6]` and the right products are `[24,12,4,1]`. Multiply matching positions to get `[24,12,8,6]`.
- Exam move: this is the prefix/suffix product version of prefix sum thinking.
- Complexity: `O(n)`.

```javascript
function productExceptSelf(nums) {
  const result = Array(nums.length).fill(1);

  let prefix = 1;
  for (let i = 0; i < nums.length; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }

  return result;
}
```

#### Subarray Sum Equals K

- Why this pattern: if `prefix[j] - prefix[i] = k`, then the subarray `(i+1..j)` sums to `k`.
- Walkthrough: for `[1,1,1]` and `k = 2`, running sums are `1,2,3`. When sum is `3`, you look for prior prefix `1`, which exists once, so you found another valid subarray.
- Exam move: store counts of prior prefix sums, not just whether they exist.
- Complexity: `O(n)`.

```javascript
function subarraySum(nums, k) {
  const count = new Map([[0, 1]]);
  let prefix = 0;
  let result = 0;

  for (const num of nums) {
    prefix += num;
    result += count.get(prefix - k) ?? 0;
    count.set(prefix, (count.get(prefix) ?? 0) + 1);
  }

  return result;
}
```

#### Contiguous Array

- Why this pattern: equal numbers of `0` and `1` can be turned into a prefix-balance problem.
- Walkthrough: treat `0` as `-1` and `1` as `+1`. When the same running balance appears again, the subarray between those indices has equal zeroes and ones. For `[0,1,0]`, balances are `-1,0,-1`, so the longest length is `2`.
- Exam move: store the earliest index of each balance so you get the longest span.
- Complexity: `O(n)`.

```javascript
function findMaxLength(nums) {
  const firstSeen = new Map([[0, -1]]);
  let balance = 0;
  let best = 0;

  for (let i = 0; i < nums.length; i++) {
    balance += nums[i] === 1 ? 1 : -1;

    if (firstSeen.has(balance)) {
      best = Math.max(best, i - firstSeen.get(balance));
    } else {
      firstSeen.set(balance, i);
    }
  }

  return best;
}
```

---

## Final Pattern Checklist

Ask these questions in order when you get stuck:

1. Do I need quick lookup, counts, or grouping? Use a hash map or set.
2. Is the input sorted, or can sorting unlock a left/right scan? Try two pointers.
3. Am I looking for a contiguous valid region? Use a sliding window.
4. Is there a sorted or monotonic search space? Use binary search.
5. Is this connected components, reachability, or shortest path in an unweighted graph? Use BFS or DFS.
6. Do I need every valid construction? Use backtracking.
7. Am I recomputing the same subproblem? Define DP state.
8. Does each new item resolve older items? Consider a stack.
9. Do I only care about the top or bottom few items? Use a heap.
10. Do I need repeated range calculations? Build a prefix sum.

## Suggested Exam Prep Routine

1. Start with the five highest-yield patterns from the original crash course: hash map, two pointers, sliding window, BFS/DFS, binary search.
2. Add backtracking and 1D DP next, since medium interviews often pivot there.
3. Finish with stack, heap, and prefix sum to cover common twist problems.
4. For each pattern, solve one example from this guide without notes, then explain the pattern aloud in two sentences.
