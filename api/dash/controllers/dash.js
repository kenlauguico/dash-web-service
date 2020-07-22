'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {
        let entity, response
        if (ctx.request.body.length) {
            const dashes = ctx.request.body
            for (var i in dashes) {
                let linkIds = [], dash = dashes[i]
                const links = dashes[i].links
                for (var x in links) {
                    let entity = await strapi.services.link.create(links[x]);
                    let { id } = sanitizeEntity(entity, { model: strapi.models.link })
                    linkIds.push(id)
                }
                dash.links = linkIds
                entity = await strapi.services.dash.create(dash);
                response = sanitizeEntity(entity, { model: strapi.models.dash })
            }
        }
        if (!response) {
            return ctx.unauthorized('Nope')
        }
        return response
    }
};
