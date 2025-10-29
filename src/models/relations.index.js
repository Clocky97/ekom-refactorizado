import Profile from "./profile.model.js";
import User from "./user.model.js";
import { CategoryModel } from "./category.model.js";
import {PostModel} from "./post.model.js";
import { ProductModel } from "./product.model.js";
import { MarketModel } from "./market.model.js";
import Report from "./report.model.js";
import Rating from "./rating.model.js";
import { OfferModel } from "./offer.model.js";




//uno a uno, usuario con perfil
User.hasOne(Profile, { foreignKey: 'user_id', as: 'profile', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

//uno a muchos, Productos con categorias
ProductModel.belongsTo(CategoryModel, { //belongsTo va donde esta la forein key
    as: "categoria",
    foreignKey: "category_id",
});

CategoryModel.hasMany(ProductModel, {
    as: "products",
    foreignKey: "category_id"
}
);

//Post con producto
PostModel.belongsTo(ProductModel, {
    as: "producto",
    foreignKey: "product_id"
})

ProductModel.hasMany(PostModel, {
    as: "publicaciones",
    foreignKey: "product_id"
})


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

// Un usuario puede reportar muchos posts
User.hasMany(Report);
Report.belongsTo(User);

// Un post puede tener muchos reportes
PostModel.hasMany(Report);
Report.belongsTo(PostModel);

// Un usuario puede puntuar muchos posts
User.hasMany(Rating);
Rating.belongsTo(User);

// Un post puede tener muchas puntuaciones
PostModel.hasMany(Rating);
Rating.belongsTo(PostModel);
export { User, Profile };



