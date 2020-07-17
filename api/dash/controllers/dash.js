'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {
        if (ctx.request.body[0].title) {
            const dashes = ctx.request.body
            const links = ctx.request.body[0].items
            dashes.map(dash => { console.log('Add dash '+dash.title) })
            links.map(link => { console.log('Add '+link.title) })
            return ctx.request.body[0].items
        }        
        return ctx.request.body // await strapi.services.dash.find(ctx.query);
    }
};
