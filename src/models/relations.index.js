import Profile from "./profile.model.js";
import User from "./user.model.js";
import { CategoryModel } from "./category.model.js";
import {PostModel} from "./post.model.js";
import { MarketModel } from "./market.model.js";
import Report from "./report.model.js";
import Rating from "./rating.model.js";
import { OfferModel } from "./offer.model.js";
import PostOffer from "./postOffer.model.js";
import CartModel from "./cart.model.js";




//uno a uno, usuario con perfil
User.hasOne(Profile, { foreignKey: 'user_id', as: 'profile', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

//post con usuario
PostModel.belongsTo(User, {
    as: "usuario",
    foreignKey: "user_id"
})

User.hasMany(PostModel, {
    as: "publicaciones",
    foreignKey: "user_id"
})

//post con market
PostModel.belongsTo(MarketModel, {
    as: "local",
    foreignKey: "market_id"
});

MarketModel.hasMany(PostModel, {
    as: "publicaciones",
    foreignKey: "market_id"
})

//post con offer
PostModel.belongsTo(OfferModel, {
    as: "ofertas",
    foreignKey: "offer_id"
})

// post con postOffers (ofertas hechas por usuarios)
PostModel.hasMany(PostOffer, {
    as: "offers",
    foreignKey: "post_id"
});

PostOffer.belongsTo(PostModel, {
    as: "post",
    foreignKey: "post_id"
});

// usuario con postOffers
User.hasMany(PostOffer, {
    as: "postOffers",
    foreignKey: "user_id"
});

PostOffer.belongsTo(User, {
    as: "user",
    foreignKey: "user_id"
});

//post con category
PostModel.belongsTo(CategoryModel, {
    as: "categoria",
    foreignKey: "category_id"
})

CategoryModel.hasMany(PostModel, {
    as: "posts",
    foreignKey: "category_id"
})

// Un usuario puede reportar muchos posts
User.hasMany(Report, { as: 'reports' });
Report.belongsTo(User, { as: 'user' });

// Un post puede tener muchos reportes
PostModel.hasMany(Report, { as: 'reportes' });
Report.belongsTo(PostModel, { as: 'post' });

// Un usuario puede puntuar muchos posts
User.hasMany(Rating);
Rating.belongsTo(User);

// Un post puede tener muchas puntuaciones
PostModel.hasMany(Rating);
Rating.belongsTo(PostModel);

// Un usuario puede tener muchos items en carrito
User.hasMany(CartModel, {
    as: "cartItems",
    foreignKey: "user_id"
});

CartModel.belongsTo(User, {
    as: "user",
    foreignKey: "user_id"
});

// Un carrito pertenece a un post
CartModel.belongsTo(PostModel, {
    as: "post",
    foreignKey: "post_id"
});

PostModel.hasMany(CartModel, {
    as: "cartItems",
    foreignKey: "post_id"
});

export { User, Profile };



