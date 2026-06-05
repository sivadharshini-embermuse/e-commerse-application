// create product 
import Product from "../model/ProductModels.js";
import HandleError from "../helper/HandleError.js";
import ApiHelper from "../helper/ApiHelper.js";


export const addProduct = async (req, res) => {
    // console.log(req.body);
    req.body.user = req.user.id;
    const product=await Product.create(req.body);
    res.status(201).json({
        success:true,
        product,
    });
};

// get all products
export const getAllProduct = async (req, res) => {
    const resultPerPage = 4;
    const apihelper = new ApiHelper(Product, req.query).search().filter();
    const filteredQuery = apihelper.query.clone();
    const Productcount = await filteredQuery.countDocuments();
    const totalpages= Math.ceil(Productcount / resultPerPage);
    const Page = Number(req.query.page) || 1;
    if (totalpages > 0 && Page > totalpages) {
        return next(new HandleError("this page does not exist", 404));
    }   
    apihelper.pagination(resultPerPage);

    const products = await apihelper.query;
    res.status(200).json({
        success:true,
        products,
        Productcount,
        resultPerPage,
        totalpages,
        currentpage: Page,   
    });
};

// update product by id
export const updateProduct = async (req, res, next ) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        // return res.status(404).json({ success: false, message: "Product not found",});
        return next(new HandleError("Product not found", 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        product,
    });
};

//delete product by id
export const deleteProduct = async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) { 
        // return res.status(404).json({
        //     success: false,
        //     message: "Product not found",
        // });
        return next(new HandleError("Product not found", 404));
    }
    // await product.remove();
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
}

// get single product by id
export const getSingleProduct = async (req, res, next) => {
    // console.log(req.params);

    const product = await Product.findById(req.params.id);
    if (!product) {
        // return res.status(404).json({
        //     success: false,
        //     message: "Product not found",
        // });
        return next(new HandleError("Product not found", 404));
    } 
     return res.status(200).json({
        success:true,
        product,
    });
};

//add review and rating of a product
export const reviewProduct = async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const product = await Product.findById(productId);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user.id.toString()
    );
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user.id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }   
        });
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let sum = 0;
    product.reviews.forEach((rev) => {
        sum += rev.rating;
    });
    product.ratings = sum / product.reviews.length;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
};

// view review and rating of a product by admin
export const viewreviewProduct = async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }   
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
};

//admin view all products
export const getAdminAllProduct = async (req, res, next) => {
    const products = await Product.find();  
    res.status(200).json({
        success: true,
        products,
    });
};

//admin delete review and rating of a product
export const admindeleteReviewProduct = async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());
    
    let sum = 0;
    reviews.forEach((rev) => {
        sum += rev.rating;
    });
    const rating = reviews.length === 0 ? 0 : sum / reviews.length;
    const numOfReviews=reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, { reviews, rating , numOfReviews}, { new: true, runValidators: true });
    
    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
    });
};
