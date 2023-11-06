module.exports = {
    mod: function (value, modulus, options) {
        if (value % modulus === 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
  };
  