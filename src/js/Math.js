Math.rand = function (min, max) {
    return this.floor(this.random() * (max - min + 1)) + min;
};