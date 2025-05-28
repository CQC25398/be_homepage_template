'use strict';

const jwt = require('jsonwebtoken');

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    await next();

    if (ctx.request.url === '/api/auth/local' && ctx.response.status === 200 && ctx.response.body.jwt) {
      const jwtToken = ctx.response.body.jwt;
      const userId = ctx.response.body.user?.id;

      if (jwtToken && userId) {
        const refreshToken = jwt.sign(
          { id: userId },
          process.env.REFRESH_TOKEN_SECRET,
          // { expiresIn: '7d' }
        );
        
        await strapi.db.query('plugin::users-permissions.user').update({
          where: { id: userId },
          data: {
            jwt_token: jwtToken,
            refresh_token: refreshToken
          }
        });
      }
    }
  };
};
