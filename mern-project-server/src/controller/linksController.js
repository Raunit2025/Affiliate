const { response } = require("express");

const linksController = {
    create: async (request, response) => {
        const { campaign_title, original_url, category } = request.body;

        try{
            const link = new linksController({
                campaign_title: campaign_title,
                original_url: original_url,
                category: category,
                user: request.user.id //Coming from middleware: AuthMiddleware
            });
            link.save();
            response.json({
                data: { linkId: link._id }
            });

        } catch (error) {
            console.log(error);
            response.status(500).json({
                error: 'Internal server error'
            });
        }
    },

    getAll: async (request, response) => {
        try{
            const links = await Links
                .find({ user: request.user.id })
                .
        }
    }

};

module.exports = linksController;