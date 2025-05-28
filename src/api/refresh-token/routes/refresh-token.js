'use strict';

module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'POST',
      path: '/refresh-token',
      handler: 'refresh-token.refresh',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
