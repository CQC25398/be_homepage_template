'use strict';

module.exports = {
  async logout(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("Not authenticated");
    }

    try {
      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: user.id },
        data: {
          refresh_token: null,
          jwt_token: null,
        },
      });

      return ctx.send({ message: "Logged out successfully" });
    } catch (error) {
      strapi.log.error("Error during logout:", error);
      return ctx.internalServerError("Logout failed");
    }
  }
};
