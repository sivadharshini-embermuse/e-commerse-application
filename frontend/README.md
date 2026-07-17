# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.







npm create vite@latest .

npm install tailwindcss @tailwindcss/vite

in app.jsx rafce for basic auto code

npm i react-router-dom lucide-react react-hot-toast

npm i @reduxjs/toolkit react-redux

npm i axios












1.getting products from backend to display in frontend:


What changed and where
1) Backend: product API route
    File: ProductRoute.js
    Change: route already exists
    It connects:
        GET /api/v1/products
        to getAllProduct in ProductController.js
2) Backend: fetch products from database
    File: ProductController.js
    getAllProduct reads from MongoDB product model
    It returns JSON:
        products
        Productcount
        resultPerPage
        totalpages
        currentpage
So backend code is doing:
    database query
    pagination
    send product list to frontend
Frontend: API call and Redux
3) Redux async call
    File: ProductSlice.jsx
    getProducts thunk does:
        axios.get("/api/v1/products")
        returns data from backend
4) Redux store
    File: store.jsx
    It stores productReducer under products
5) Render products in UI
    File: Home.jsx
    It does:
        const { products, loading, error } = useSelector(state => state.products)
        dispatch(getProducts()) inside useEffect
        maps products to <Product product={product} />
6) Product card display
    File: Product.jsx
    It shows:
        image
        name
        description
        rating
        price
        Add to Cart button
Easy English summary:
    Backend has API route /api/v1/products
    Backend controller fetches products from database
    Frontend thunk getProducts calls that API
    Product data goes into Redux state
    Home.jsx reads Redux state and shows products
Important note
    Your Home.jsx already has the product fetch and display logic.
    AllProducts.jsx still needs the same code if you want /product page to also show products.



wireless mouse la reviiews postman mulama add panni aprm code oda ui paruu