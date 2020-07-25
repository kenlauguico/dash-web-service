'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async findOne(ctx) {
        let entity, user, entities
        const { id } = ctx.params;
        entity = await strapi.services.u.findOne({ id });
        user = sanitizeEntity(entity, { model: strapi.models.u });
        entities = await strapi.services.dash.find({'acct.id_in': id});
        user.dashes = entities.map(entity => sanitizeEntity(entity, { model: strapi.models.dash }));
        if (!user) {
            return ctx.unauthorized('Nope')
        }
        return user
      },
};
