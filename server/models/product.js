var mongoose= require('mongoose');
var Schema = mongoose.Schema;
var productSchema= new mongoose.Schema({
    productName: {type: String},
    productCat:{type:String},
    productBrand:{type:String},
    productPrice:{type:Number},
    productDes:{type:String},
    productReview:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
                 }],
    productImage:{type:String}
    
    
});
var Product=mongoose.model('Product',productSchema)
