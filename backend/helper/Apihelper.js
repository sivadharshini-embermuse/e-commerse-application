class Apihelper {
  constructor(query, queryStr) {
    this.query = query;// mongodb query
    this.queryStr = queryStr;// query from url
  }

  escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  getSearchWords(value) {
    return value
      ? value
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => this.escapeRegex(word))
      : [];
  }

  getCategoryWords(category) {
    const words = this.getSearchWords(category);
    const aliases = {
      dress: ["clothing", "clothes", "fashion", "apparel", "wear", "shirt", "tshirt", "jeans", "kurta", "saree"],
      electronics: ["electronic", "electrical", "appliance", "appliances", "mobile", "phone", "laptop"],
      "home decor": ["home", "decor", "kitchen", "household", "furnishing"],
      sports: ["sport", "fitness", "gym"],
      books: ["book", "novel"],
      toys: ["toy", "game"],
      "health & beauty": ["health", "beauty", "personal", "care", "skincare", "makeup"],
      furniture: ["furniture", "chair", "table", "sofa", "bed"],
      "baby products": ["baby", "kids", "child", "infant"],
    };
    const aliasWords = aliases[category?.toLowerCase()] || [];
    return [...new Set([...words, ...aliasWords.map((word) => this.escapeRegex(word))])];
  }

  search() {
    const keywordParts = this.getSearchWords(this.queryStr.keyword);
    const keyword = keywordParts.length
      ? {
          $or: keywordParts.flatMap((word) => [
            { name: { $regex: word, $options: "i" } },
            { description: { $regex: word, $options: "i" } },
            { category: { $regex: word, $options: "i" } },
          ]),
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  } 
    filter() {  
    const queryCopy = { ...this.queryStr };

    // Removing fields from the query
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    if (queryCopy.category) {
      const categoryWords = this.getCategoryWords(queryCopy.category);
      queryCopy.category = { $regex: categoryWords.join("|"), $options: "i" };
    }

    // Filter for price and rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }     
    pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
    }
}

export default Apihelper;


/* why we are using api helper na  using this we can do chainable query and we
 can also do search and filter and pagination in one line of code in Productcontroller file 
 instead of writing multiple lines of code for search and filter and pagination in 
 controller file

 eg: const apihelper = new ApiHelper(Product.find(), req.query).search().filter().pagination(10);

 we can do all these things in one line of code by using api helper 
 class and also it will make our code cleaner and more readable and also it will make our 
 code more maintainable because if we want to change the logic of search or filter or pagination 
 then we can change it in one place instead of changing it in multiple places in controller file.*/
