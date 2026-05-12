## 2024-05-12 - Optimize Random Question Selection
**Learning:** Using `flatMap` to merge arrays followed by `find()` and `includes()` for reverse-lookup causes O(N^2) complexity and unnecessary allocations when selecting a random item from a partitioned dataset.
**Action:** Calculate the total number of items, generate a global random index, and iterate to locate the specific item. This keeps the distribution exactly identical while achieving O(N) complexity.
