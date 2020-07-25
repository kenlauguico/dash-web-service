'use strict';

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {
        let entity, response, dashes
        const { title, links, acct } = ctx.request.body
        console.log('lets do it')
        if (title && links && acct) {
            //dash/add
            console.log('lets add it')
            if (ctx.is('multipart')) {
                const { data, files } = parseMultipartData(ctx);
                console.log('grabbed data')
                entity = await strapi.services.dash.create(data, { files });
            } else {
                console.log('checking body: ',title,links,acct)
                entity = await strapi.services.dash.create(ctx.request.body);
            }
            console.log('added to acct',acct)
            return sanitizeEntity(entity, { model: strapi.models.dash });
        } else if (Array.isArray(ctx.request.body)) {
            //dash/start migrate
            dashes = ctx.request.body
        } else {
            //dash/start new
            dashes = [defaultDash]
        }

        entity = await strapi.services.u.create();
        const { id } = sanitizeEntity(entity, { model: strapi.models.u });
        console.log('using new acctId', id)
        response = await createDash(id, dashes)

        entity = await strapi.services.u.findOne({ id })
        response = sanitizeEntity(entity, { model: strapi.models.u })
        console.log('this is the user found:',response,'using acctId',id)
        if (!response) {
            return ctx.unauthorized('Nope')
        }

        return response
    }
};



const defaultDash = {
	title: "My first dash",
	links: [
		{ title: "Search", url: "google.com" },
		{ title: "Shop", url: "amazon.com" },
		{ title: "Play", url: "addictinggames.com" },
	]
};

const createDash = async (acctId, dashes) => {
    let entity
    for (var i in dashes) {
        let linkIds = [], dash = dashes[i]
        const links = dashes[i].links
        for (var x in links) {
            let entity = await strapi.services.link.create(links[x]);
            let { id } = sanitizeEntity(entity, { model: strapi.models.link })
            linkIds.push(id)
        }
        dash.links = linkIds
        dash.acct = [acctId]
        console.log(dash)
        entity = await strapi.services.dash.create(dash);
    }
    return sanitizeEntity(entity, { model: strapi.models.dash })
};