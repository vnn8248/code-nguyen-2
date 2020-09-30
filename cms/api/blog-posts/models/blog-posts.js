const _ = require("lodash");

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.title) {
        data.slug = _.kebabCase(data.title);
        data.title = _.startCase(data.title);
      }
    },
    beforeUpdate: async (params, data) => {
      data.slug = _.kebabCase(data.title);
      data.title = _.startCase(data.title);
    }, 
  }, 
};
