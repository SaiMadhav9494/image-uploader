function P() {
    var current = 0;
    this.next = function() {
        return ++current;
    }
}

const p = new P();
console.log(p.next());