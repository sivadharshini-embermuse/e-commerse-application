import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import { getProducts, removeError } from '../features/product/ProductSlice';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import Product from '../components/Product';
import Pagination from '../components/Pagination';
import { useSearchParams } from 'react-router-dom';
import { useNavigate} from "react-router-dom";

const AllProducts= () => {
    const {products,productCount,loading,error,totalpages,resultPerPage}=useSelector((state)=>state.products);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const keyword = searchParams.get("keyword") || "";
    const selectedCategory = searchParams.get("category") || "";
    const pageFromURL = parseInt(searchParams.get("page"),10) || 1;
    // const [currentPage, setCurrentPage] = useState(pageFromURL);
    const totalPages = totalpages || Math.ceil((productCount || 0) / (resultPerPage || 5));
    const categories = ["Electronics", "Dress", "Home Decor", "Sports", "Books" , "Health","Toys", "Beauty", "Furniture", "Baby Products"];
    
    const handlePageChange = (pageNumber) => {
        const params = new URLSearchParams(searchParams);

        if (pageNumber === 1) {
            params.delete("page");
        } else {
            params.set("page", pageNumber);
        }

        navigate(`/product?${params.toString()}`);
    };

    const handleCategoryChange = (category) => {
        const params = new URLSearchParams(searchParams);

        if (category) {
            params.set("category", category);
        } else {
            params.delete("category");
        }

        params.delete("page");
        navigate(`/product?${params.toString()}`);
    };

    useEffect(()=>{
        dispatch(getProducts({keyword, category: selectedCategory, page: pageFromURL}));
    },[dispatch,keyword,selectedCategory,pageFromURL]);

    useEffect(()=>{
        if(error){
        toast.error(error);
        dispatch(removeError());
        }
    },[dispatch,error])
    return (
    loading? <Loader /> : (
        <div className='flex flex-col min-h-screen bg-gray-50'>
            <PageTitle title={"Products | E-Commerce"} />
            <Navbar />
            <main className='grow container mx-auto px-4 py-8'>
                <div className='flex flex-col md:flex-row gap-8'>
                    <aside className='w-full md:w-1/4'>
                        <div className='bg-white p-6 rounded-lg shadow-sm sticky top-24'>
                            <h1 className='text-left pl-7 font-semibold text-xl mb-4 text-gray-800 border-b border-slate-200'>CATEGORIES</h1>
                            <ul className="max-h-[450px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
                                <li>
                                    <button
                                        onClick={() => handleCategoryChange("")}
                                        className={`text-gray-500 font-serif text-2xl pl-5 text-left border-0 rounded-se-xl rounded-bl-xl w-full m-2 transition-colors hover:text-blue-700 hover:bg-blue-200 ${!selectedCategory ? "text-blue-700 bg-blue-100" : ""}`}
                                    >
                                        All
                                    </button>
                                </li>
                                {categories.map((cat)=>(
                                    <li key={cat}>
                                        <button
                                            onClick={() => handleCategoryChange(cat)}
                                            className={`text-gray-500 font-serif text-2xl pl-5 text-left border-0 rounded-se-xl rounded-bl-xl w-full m-2 transition-colors hover:text-blue-700 hover:bg-blue-200 ${selectedCategory === cat ? "text-blue-700 bg-blue-100" : ""}`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                    <section className='w-full md:w-3/4'>
                        <div className='flex justify-between items-center mb-6'>
                            <h1 className='text-left pl-7 font-semibold text-xl mb-4 text-gray-800'>OUR PRODUCTS</h1>
                            <span className='text-gray-600'>{productCount || products?.length || 0} items found</span>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {products && products.map((product) => (
                                <Product key={product._id} product={product} />
                            ))}
                        </div>
                        {/* if there is no products in database */}
                        {products?.length === 0 && (
                            <div className='text-center text-gray-500 mt-8'>
                                <p className='text-lg text-red-400 font-bold pb-8'> {`No products found !!!`} </p>
                                <img src="https://www.breathearomatherapy.com/assets/images/global/no-product.png" alt="No products found" className='h-48 object-cover flex flex-col justify-center mx-auto' />
                            </div>
                        )}

                    </section>
                </div>
                <Pagination
                    currentPage={pageFromURL}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </main>
        </div>
    ))
}

export default AllProducts
