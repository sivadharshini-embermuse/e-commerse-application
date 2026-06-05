class Apihelper {
  constructor(query, queryStr) {
    this.query = query;// mongodb query
    this.queryStr = queryStr;// query from url
   } 
  search() {
    const keyword = this.queryStr.keyword
      ? {
            name: { $regex: this.queryStr.keyword, $options: "i" }, //"i" for case insensitive search
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

    // Filter for price and rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }     
    pagination(resultPerPage) {
    const currentPage = Number(this.query.page) || 1;
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