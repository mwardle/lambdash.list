var _ = require('lamdash');

var List = function List() {
    var l = List.Nil;
    var argsInd = arguments.length - 1;
    while(argsInd >= 0) {
        l = List.Cons(arguments[argsInd], l);
        argsInd -= 1;
    }
    return l;
};

List = _.Type.sum(List, {Cons: {head: null, tail: List}, Nil: []});


List.isCons = List.case({
    "Cons": true,
    "Nil": false
});

List.isNil = List.case({
    "Cons": false,
    "Nil": true
});

List.compare = _.curry(function(left, right) {
    if (List.isNil(left)) {
        if (List.isNil(right)) {
            return _.EQ;
        }

        return _.LT;
    }

    if(List.isNil(right)) {
        return _.GT;
    }

    var comp = _.compare(left.head, right.head);
    return comp === _.EQ ? List.compare(left.tail, right.tail) : comp;
});

List.map = _.curry(function(fn, list) {
    return List.case({
        'Nil': List.Nil,
        'Cons': function(hd, tl) {
            return List.Cons(fn(hd), List.map(fn, tl));
        }
    }, list);
});

List.concat = _.curry(function(left, right) {
    return List.case({
        "Nil": right,
        "Cons": function(hd, tl) {
            return List.Cons(hd, List.concat(tl, right));
        }
    }, left);
});

List.empty = _.always(List.Nil);

List.of = _.curry(function(value){
    return List(value);
});

List.foldl = _.curry(function(fn, accum, list){
    return List.case({
        "Nil": accum,
        "Cons": function(hd, tl) {
            return List.foldl(fn, fn(accum, hd), tl);
        }
    }, list);
});

List.foldr = _.curry(function(fn, accum, list) {
    return List.case({
        "Nil": accum,
        "Cons": function(hd, tl) {
            return fn(List.foldr(fn, accum, tl), hd);
        }
    }, list);
});

List.fold = List.foldl;

List.nth = _.curry(function(n, list) {
    if (List.isNil(list) || n < 0) {
        throw new RangeError('Index out of bound for list');
    }

    return n === 0 ? list.head : List.nth(n-1, list.tail);
});

List.ap = _.curry(function(apply, list) {
    return List.flatten(List.map(function(fn) {
        return List.map(fn, list);
    }, apply));
});

List.flatten = _.curry(function(list) {
    return List.foldr(function(accum, l) {
        return List.concat(l, accum);
    }, List.empty(), list);
});

List.show = _.curry(function(list) {
    var items = _.intersperse(',', List.map(_.show, list));
    return "List(" + _.join(items) + ")";
});


module.exports = List;


