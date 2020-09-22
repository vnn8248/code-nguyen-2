const _ = require("lodash");

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.client) {
        data.slug = _.kebabCase(data.client);
      }
    },
    beforeUpdate: async (params, data) => {
      data.slug = _.kebabCase(data.client);
    }, 
  }, 
};