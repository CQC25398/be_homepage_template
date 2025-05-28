'use strict';
const crypto = require('crypto');

module.exports = (plugin) => {
  const originalCallback = plugin.controllers.auth.callback;

  plugin.controllers.auth.callback = async (ctx) => {
    const response = await originalCallback(ctx);

    const jwtToken = response?.data?.jwt || response?.jwt;
    const user = response?.data?.user || response?.user;

    if (jwtToken && user?.id) {
      try {
        const refreshToken = crypto.randomBytes(64).toString('hex');

        await strapi.db.query('plugin::users-permissions.user').update({
          where: { id: user.id },
          data: { refresh_token: refreshToken },
        });

        if (response.data) {
          response.data.refresh_token = refreshToken;
        } else {
          response.refresh_token = refreshToken;
        }

      } catch (error) {
        strapi.log.error('Failed to save refresh token:', error);
      }
    }

    return response;
  };

  return plugin;
};
