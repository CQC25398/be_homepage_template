'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/logout',
      handler: 'logout.logout',
      config: {
        auth: {
          strategies: ['users-permissions']
        },
        policies: [],
      },
    },
  ],
};
