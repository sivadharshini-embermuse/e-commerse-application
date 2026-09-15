// create product 
import Product from "../model/ProductModels.js";
import HandleError from "../helper/HandleError.js";
import ApiHelper from "../helper/ApiHelper.js";
import { v2 as cloudinary } from "cloudinary";


export const addProduct = async (req, res, next) => {
    const { name, price, MRP, description, category, stock } = req.body;
    
    if (!name || !price || !MRP || !description || !category || stock === undefined) {
        return next(new HandleError("Please provide all required product fields", 400));
    }

    let imageFiles = [];
    if (req.files && req.files.images) {
        imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    }

    if (imageFiles.length === 0) {
        return next(new HandleError("Please upload at least one product image", 400));
    }

    const uploadedImages = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (!allowedTypes.includes(file.mimetype)) {
            return next(new HandleError("Invalid file type. Only JPG, PNG, and WEBP are allowed", 400));
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit per image
            return next(new HandleError("File size too large. Limit is 5MB per image", 400));
        }

        try {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "ecommerce/products" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(file.data);
            });
            uploadedImages.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        } catch (error) {
            return next(new HandleError("Cloudinary upload failed", 500));
        }
    }

    const productData = {
        name,
        price,
        MRP,
        description,
        category,
        stock,
        images: uploadedImages,
        user: req.user.id
    };

    const product = await Product.create(productData);
    
    res.status(201).json({
        success:true,
        product,
    });
};

// get all products
export const getAllProduct = async (req, res, next) => {

    const resultPerPage = 20;
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
        return next(new HandleError("Product not found", 404));
    }

    const { name, price, MRP, description, category, stock } = req.body;
    let images = product.images; // Keep old images by default

    // If new images are provided
    if (req.files && req.files.images) {
        let imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        
        const uploadedImages = [];
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            if (!allowedTypes.includes(file.mimetype)) {
                return next(new HandleError("Invalid file type. Only JPG, PNG, and WEBP are allowed", 400));
            }
            if (file.size > 5 * 1024 * 1024) {
                return next(new HandleError("File size too large. Limit is 5MB per image", 400));
            }
            
            try {
                const result = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "ecommerce/products" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(file.data);
                });
                uploadedImages.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            } catch (error) {
                return next(new HandleError("Cloudinary upload failed", 500));
            }
        }

        // Delete old images from Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            if (product.images[i].public_id) {
                try {
                    await cloudinary.uploader.destroy(product.images[i].public_id);
                } catch (e) {
                    // Ignore deletion errors to not block the update flow
                }
            }
        }

        images = uploadedImages;
    }

    const updateData = {
        name,
        price,
        MRP,
        description,
        category,
        stock,
        images
    };

    // Remove undefined fields so we only update what's passed
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
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
        return next(new HandleError("Product not found", 404));
    }
    
    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
        for (let i = 0; i < product.images.length; i++) {
            if (product.images[i].public_id) {
                try {
                    await cloudinary.uploader.destroy(product.images[i].public_id);
                } catch (e) {
                    // ignore errors
                }
            }
        }
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
}

// get single product by id
export const getSingleProduct = async (req, res, next) => {
    // console.log(req.params);

    const product = await Product.findById(req.params.id).populate(
        "reviews.user",
        "name avatar"
    );
    if (!product) {
        // return res.status(404).json({
        //     success: false,
        //     message: "Product not found",
        // });
        return next(new HandleError("Product not found", 404));
    } 
    const productData = product.toObject();
    productData.reviews = productData.reviews.map((review) => {
        const user = review.user;
        return {
            ...review,
            user: user?._id || user,
            name: review.name || user?.name,
            avatar: review.avatar || user?.avatar?.url || "",
        };
    });

    return res.status(200).json({
        success:true,
        product: productData,
    });
};

//add review and rating of a product
export const reviewProduct = async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user.id,
        avatar:req.user.avatar?.url || "",
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    console.log(review);
    const product = await Product.findById(productId);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    // console.log(req.user);
    // console.log(product);
    // console.log(product.reviews);
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user.id.toString()
    );
    
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user.id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
                rev.avatar = req.user.avatar?.url || "";
                rev.name = req.user.name;
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
    const product = await Product.findById(req.query.id).populate(
        "reviews.user",
        "name avatar"
    );
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }   
    const reviews = product.reviews.map((review) => {
        const reviewData = review.toObject();
        const user = reviewData.user;
        return {
            ...reviewData,
            user: user?._id || user,
            name: reviewData.name || user?.name,
            avatar: reviewData.avatar || user?.avatar?.url || "",
        };
    });

    res.status(200).json({
        success: true,
        reviews,
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
