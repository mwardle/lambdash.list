# List

This package implements a simple cons list for [lambdash](https://github.com/mwardle/lambdash.git).

## Implements

1. Eq
2. Ord
3. Functor
4. Semigroup
5. Monoid
6. Foldable
7. Sequential
8. Applicative
9. Monad
10. Show

## Typed List

By default the List implementation accepts any value.
You can create typed list like so:

```javascript
    var _ = require('lambdash');
    var List = require('lambdash.list');

    // A list that only accepts numbers
    var NumList = List.Typed(_.Num);
```
