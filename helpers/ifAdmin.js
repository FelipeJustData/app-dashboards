module.exports = {
    ifAdmin: function(permissions, options) {
      if (permissions.includes('Administrador')) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    // Outros helpers personalizados aqui...
  };
  