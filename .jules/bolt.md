## 2024-05-16 - Avoid O(N^2) reverse-lookup on flattened datasets
**Learning:** Using `flatMap` to merge arrays from different categories, randomly selecting an item, and then running `.find()` with `.includes()` to reverse-lookup the category creates O(N^2) complexity and unnecessary allocations.
**Action:** Calculate the total item count across categories, generate a single global random index, and iterate over the categories to simultaneously find the target item and its parent category in O(N) time without creating intermediate arrays.
