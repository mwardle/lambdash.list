var assert = require('assert');

var List = require('../src/List');
var _ = require('lambdash');

describe('List', function(){
    describe('#member', function(){
        it('should return true if a value is a member of list', function() {
            assert.equal(List.member(List()), true);
            assert.equal(List.member(List(1,2,3)), true);
            assert.equal(List.member(List.Nil), true);
            assert.equal(List.member(List.Cons(1,List.Nil)), true);
        });

        it('should return false if a value is not a list', function() {
            assert.equal(List.member([]), false);
            assert.equal(List.member(null), false);
            assert.equal(List.member(123), false);
            assert.equal(List.member(false), false);
            assert.equal(List.member(true), false);
            assert.equal(List.member(''), false);
        });
    });

    describe('#case', function() {
        it('should call function depending on the constructor of a list', function() {
            var consTrue = List.case({
                'Nil': _.F,
                'Cons': _.T
            });

            var nilTrue = List.case({
                'Nil': _.T,
                'Cons': _.F
            });

            var n = List.Nil;
            var c = List.Cons('', n);

            assert.equal(consTrue(n), false);
            assert.equal(consTrue(c), true);
            assert.equal(nilTrue(n), true);
            assert.equal(nilTrue(c), false);
        });
    });

    describe('#isCons', function() {
        it('should return true only if a list is a cons value', function(){
            assert.equal(List.isCons(List('')), true);
            assert.equal(List.isCons(List()), false);
        });
    });

    describe('#isNil', function() {
        it('should return true only if a list is a nil value', function(){
            assert.equal(List.isNil(List('')), false);
            assert.equal(List.isNil(List()), true);
        });
    });

    describe('#compare', function() {
        it('should return _.LT if the left value is less than the right', function(){
            assert.equal(List.compare(List(1), List(2)), _.LT);
            assert.equal(List.compare(List(1,2), List(1,3)), _.LT);
            assert.equal(List.compare(List(1,2,3,4,5), List(1,2,3,4,6)), _.LT);
            assert.equal(List.compare(List(1), List(1,2)), _.LT);
            assert.equal(List.compare(List(), List(1)), _.LT);

            assert.equal(List.compare(List(List(1,2), List(1,3)), List(List(1,2), List(1,4))), _.LT);
        });

        it('should return _.GT if the left value is greater than the right', function(){
            assert.equal(List.compare(List(2), List(1)), _.GT);
            assert.equal(List.compare(List(1,3), List(1,2)), _.GT);
            assert.equal(List.compare(List(1,2,3,4,6), List(1,2,3,4,5)), _.GT);
            assert.equal(List.compare(List(1,2), List(1)), _.GT);
            assert.equal(List.compare(List(1), List()), _.GT);

            assert.equal(List.compare(List(List(1,2), List(1,4)), List(List(1,2), List(1,3))), _.GT);

        });

        it('should return _.EQ if the values are equal', function() {
            assert.equal(List.compare(List(2), List(2)), _.EQ);
            assert.equal(List.compare(List(1,3), List(1,3)), _.EQ);
            assert.equal(List.compare(List(1,2,3,4,5), List(1,2,3,4,5)), _.EQ);
            assert.equal(List.compare(List(1,2), List(1,2)), _.EQ);
            assert.equal(List.compare(List(), List()), _.EQ);

            assert.equal(List.compare(List(List(1,2), List(1,4)), List(List(1,2), List(1,4))), _.EQ);

        });
    });

    describe('#map', function(){
        it('should perform a structure preserving mapping of a list', function() {
            var fn = function(v){return v+1};

            var l1 = List(1,2,3,4);
            var l2 = List();

            assert.equal(_.eq(List.map(fn, l1), List(2,3,4,5)), true);
            assert.equal(_.eq(List.map(fn, l2), List()), true);

            // testing eq
            assert.equal(_.eq(l1, List(1,2,3,5)), false);
            assert.equal(_.eq(l1, List(1,2,3,4,5)), false);
        });
    });

    describe('#concat', function(){
        it('should join two lists together to create a single list', function() {
            var l1 = List(1,2,3);
            var l2 = List(4,5);

            assert.equal(_.eq(List.concat(l1, List.empty()), l1), true);
            assert.equal(_.eq(List.concat(List.empty(), l1), l1), true);
            assert.equal(_.eq(List.concat(l2, List.empty()), l2), true);
            assert.equal(_.eq(List.concat(List.empty(), l2), l2), true);

            assert.equal(_.eq(List.concat(l1,l2), List(1,2,3,4,5)), true);
            assert.equal(_.eq(List.concat(l2,l1), List(4,5,1,2,3)), true);

            assert.equal(_.eq(l1, List(1,2,3)), true);
            assert.equal(_.eq(l2, List(4,5)), true);
        });
    });

    describe('#empty', function(){
        it('should return a nil list', function(){
            assert.equal(List.empty(), List.Nil);
            assert.equal(_.isEmpty(List.Nil), true);
        });
    });

    describe('#of', function() {
        it('should return a list with a single value', function() {
            assert.equal(_.eq(List.of(1), List(1)), true);
            assert.equal(_.isEmpty(List.of(1)), false);
        })
    });

    describe('#foldl', function() {
        it('should fold a list from left to right', function(){
            var l = List('a', 'b', 'c');

            var fn = function(accum, v) {
                return accum + v;
            };

            assert.equal(List.foldl(fn, '', l), 'abc');
            assert.equal(List.foldl(fn, 'z', l), 'zabc');
        });
    });

    describe('#foldr', function() {
        it('should fold a list from right to left', function(){
            var l = List('a', 'b', 'c');

            var fn = function(accum, v) {
                return accum + v;
            };

            assert.equal(List.foldr(fn, '', l), 'cba');
            assert.equal(List.foldr(fn, 'z', l), 'zcba');
        });
    });

    describe('#nth', function() {
        it('should get the value at the given index in a list', function(){
            var l = List(1,2,3,4,5,6,7,8);

            assert.equal(List.nth(0, l), 1);
            assert.equal(List.nth(3, l), 4);
            assert.equal(List.nth(7, l), 8);

            assert.equal(List.nth.length, 2);

            var indexer = List.nth(_, l);
            assert(_.Fun.member(indexer));
            assert.equal(indexer.length, 1);

            assert.equal(indexer(0), 1);
            assert.equal(indexer(3), 4);
            assert.equal(indexer(7), 8);
        });

        it('should accept negative values as indices', function(){
            var l = List(1,2,3,4,5,6,7,8);

            assert.equal(List.nth(-8, l), 1);
            assert.equal(List.nth(-5, l), 4);
            assert.equal(List.nth(-1, l), 8);

            assert.equal(List.nth.length, 2);

            var indexer = List.nth(_, l);
            assert(_.Fun.member(indexer));
            assert.equal(indexer.length, 1);

            assert.equal(indexer(-8), 1);
            assert.equal(indexer(-5), 4);
            assert.equal(indexer(-1), 8);
        });

        it('should throw a RangeError if the index is out of bounds', function(){
            var l = List(1,2,3,4,5,6,7,8);
            var v;
            try {
                v = List.nth(8, l);
                assert(false);
            } catch(e) {
                assert(e instanceof RangeError);
            }

            try {
                List.nth(-9, l);
                assert(false);
            } catch (e) {
                assert(e instanceof RangeError);
            }
        });
    });

    describe('#ap', function() {
        it('should apply the functions in one list to the values in another list', function() {
            var fn1 = function(v){
                return v + 1;
            };

            var fn2 = function(v) {
                return v * 2;
            };

            var fns = List(fn1, fn2);

            var xs = List(1,2,3);

            var result1 = List.ap(fns, xs);
            var result2 = List.ap(fns, List());
            var result3 = List.ap(List(), xs);

            assert.equal(_.eq(result1, List(2,3,4,2,4,6)), true);
            assert.equal(result2, List.Nil);
            assert.equal(result3, List.Nil);
        });
    });

    describe('#flatten', function() {
        it('should concat all sublists of a list into one list', function() {
            var lists = List(List(1,2), List(3,4), List(5,6));
            assert.equal(_.eq(List.flatten(lists), List(1,2,3,4,5,6)), true);

            assert.equal(_.eq(List.flatten(List(List(1,2,3))), List(1,2,3)), true);
            assert.equal(List.flatten(List()), List.Nil);
            assert.equal(List.flatten(List(List(), List(), List())), List.Nil);
        });
    });

    describe('#show', function() {
        it('should return a string representation of a list', function() {
            var l = List(1,2,3,4);

            assert.equal(List.show(l), "List(1,2,3,4)");
        });
    });

    describe('@implementations', function() {
        it('should be a member of Eq', function(){
            assert(_.Eq.member(List()));
        });

        it('should be a member of Ord', function(){
            assert(_.Ord.member(List()));
        });

        it('should be a member of Functor', function(){
            assert(_.Functor.member(List()));
        });

        it('should be a member of Semigroup', function() {
            assert(_.Semigroup.member(List()));
        });

        it('should be a member of Monoid', function() {
            assert(_.Monoid.member(List()));
        });

        it('should be a member of Foldable', function() {
            assert(_.Foldable.member(List()));
        });

        it('should be a member of Sequential', function() {
            assert(_.Sequential.member(List()));
        });

        it('should be a member of Applicative', function() {
            assert(_.Applicative.member(List()));
        });

        it('should be a member of Monad', function() {
            assert(_.Monad.member(List()));
        });

        it('should be a member of Show', function() {
            assert(_.Show.member(List()));
        });
    });
});
