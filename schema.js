//joi is The most powerful schema description language and data validator for JavaScript.

const Joi = require('joi');

//joi ki help i am defining the schema
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
       title:Joi.string().required(),
       description:Joi.string().required(),
       location:Joi.string().required(),
       country:Joi.string().required(),
       price:Joi.number().required().min(0),
       image:Joi.object({
         url:Joi.string().allow("",null)
       })
    }).required()


})

module.exports.reviewSchema=Joi.object({
     review:Joi.object({
      comment:Joi.string().required(),
      rating:Joi.number().required().min(1).max(5)

     }).required()
})