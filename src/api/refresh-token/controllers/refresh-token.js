'use strict';

const jwt = require('jsonwebtoken');

module.exports = {
  async refresh(ctx) {
    const { refresh_token } = ctx.request.body;

    if (!refresh_token) {
      return ctx.badRequest('Refresh token missing');
    }

    try {
      const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, {
        ignoreExpiration: true, // none expiresIn
      });

      const userId = typeof decoded === 'object' && 'id' in decoded ? decoded.id : null;

      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { 
          id: userId, 
          refresh_token 
        },
      });

      if (!user) {
      return ctx.unauthorized('Invalid refresh token');
      }

      const newJwt = strapi.plugin('users-permissions').service('jwt').issue({ 
        id: user.id 
      });

      return ctx.send({ jwt: newJwt });
    } catch (err) {
      return ctx.unauthorized('Invalid or expired refresh token');
    }
  },
};
