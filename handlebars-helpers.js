module.exports = {
    if_eq: function (a, b, options) {

        if (a == b) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    },
   
    bar: function () {
        return "BAR!";
    }
}