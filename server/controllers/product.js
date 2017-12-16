// all define model

var express=require('express');
var mongoose=require('mongoose');
var Product=mongoose.model('Product');

var productRouter=express.Router();

module.exports.Controller=function(app){
            var showCart 

    // add product
    productRouter.post('/addproduct',function(req,res){
        console.log(req.body)
        if(req.body.productName!=undefined && req.body.productCat!=undefined && req.body.productBrand!=undefined && req.body.productPrice!=undefined && req.body.productDes!=undefined  )
            {
                var newProdcut= new Product({
                    productName:req.body.productName,
                    productCat:req.body.productCat,
                    productBrand:req.body.productBrand,
                    productPrice:req.body.productPrice,
                    productDes:req.body.productDes
                    /*productDes:req.body.productPrice,*/
                    /*productReview:req.body.productReview*/
                })
                console.log(newProdcut);
                newProdcut.save(function(err,product){
                    if(err){ console.log(err)}
                    else{
                      res.redirect('/product/all')}
                })
                
            }
    });
    
    // prodcut add show in jade
    productRouter.get('/addproduct', function(req, res) {
    res.render('add-product.jade', {  });
});

    // all prodcut details fetch json
    
    productRouter.get('/all', function(req,res){
        Product.find({}, function(err, status){
            if(err){console.log(err)}
            else{/*res.send(status);*/ 
console.log(req.session.cart)
res.render('all-product.jade',{status:status});  
                }
        })
    });
        // prodcut add show in jade
    /*productRouter.get('/all-product', function(req, res) {
    res.render('all-product.jade', {  });
    });*/
    
    //  single product delte fetch value
    productRouter.post('/all/:id', function(req,res){
        console.log(req.params.id);
        Product.remove({_id:req.params.id}, function(err, status){
            if(err){console.log(err)}
                else{res.send(status);}
        }) 
    });
    
    // single prduct get details
    productRouter.get('/single/:id',function(req,res){
       console.log(req.params.id);
        Product.find({_id:req.params.id},function(err,status){
            if(err){console.log(err)}
            else{
                 res.render('product-details.jade', { status:status });
                }
            
        })
    });
    // single prodcut details  in jade
    productRouter.get('/single/:id', function(req, res) {
    res.render('product-details.jade', {  });
    });
    // product edit  get by id find
    
    productRouter.post('/:id/update', function(req,res){        
       console.log('hi');
        console.log(req.body);
        Product.findOneAndUpdate({_id:req.params.id}, req.body,{new:true},function(err,status){
           if(err){console.log(err)}
            else  {res.redirect('/product/all')};  

        });            
    });
    //  Single prodcut Edit  in jade
    productRouter.get('/:id/edit', function(req, res) {
       console.log('hello');
        Product.find({_id:req.params.id},function(err,status){
            if(err){console.log(err)}
            else{
                 res.render('product-edit.jade', { status:status });
                }
        })   
    });
    
    //  roduct delete 
    productRouter.get('/delete/:id', function(req,res){
        console.log(req.params.id);
        Product.findById({_id:req.params.id},function(err,status){
            console.log(status);
            if(err){console.log(err)}
            else{ status.remove(function(err){
                if(err){console.log(err)}
                else{ res.redirect('/product/all'); }
            }) }
        })
    })
    
    
    // add cart starts here
    productRouter.get('/cart/:id', function(req, res){
      
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});
    Product.findById(productId, function(err, product){
        if(err){ console.log(err)
        }else{

         cart.addProducts(product, product.id);
         req.session.cart = cart
         console.log(req.session.cart);
           /* res.send(cart); */
         res.render('cart.jade', {cart:req.session.cart});
}
    })
    })

    // remove  id cart starts here
    productRouter.get('/remove/:id', function(req, res){
      
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});
     

        cart.removeProducts(productId);
        req.session.cart = cart
         console.log(cart);
         /*   res.send(cart); */
        res.redirect('/product/all');
       /* res.render('all-product.jade', { cart:cart });*/
    })
     
    

    
function Cart(storedItem){
    this.items = storedItem.items || {};
    this.totalPrice = storedItem.totalPrice || 0;
    this.totalcount = storedItem.totalcount || 0;

    this.addProducts = function(item, id){
        var storeProduct = this.items[id];
        if(!storeProduct){
            storeProduct = this.items[id] = {item:item, qty:0, price:0}
        }
        storeProduct.qty++;
        storeProduct.price = storeProduct.item.productPrice * storeProduct.qty;
        this.totalcount++;
        this.totalPrice += storeProduct.item.productPrice;

    }
    this.removeProducts = function(id){
        var storeProduct = this.items[id];
        storeProduct.qty--;
        storeProduct.Price = storeProduct.item.Price * storeProduct.qty;
        this.totalcount--;
        this.totalPrice -= storeProduct.item.price;
        if(storeProduct.qty <= 0){
            delete this.items[id]
        }

    }}
    
    
    app.use('/product', productRouter);
     
    
}
