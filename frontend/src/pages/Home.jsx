import Footer from '../components/Footer'
import ImageSlider from '../components/ImageSlider'
import Navbar from '../components/Navbar'
import Product from '../components/Product'
import PageTitle from '../components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getProducts, removeError } from '../features/product/ProductSlice'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'


const Home = () => {
  const {products,loading,error}=useSelector((state)=>state.products);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getProducts());
  },[dispatch]);

  useEffect(()=>{
    if(error){
      toast.error(error);
      dispatch(removeError());
    }
  },[dispatch,error])
  return (
    loading? <Loader />:(
    <div>
      <PageTitle title="Home" />
      <Navbar />
      <ImageSlider />
      <div className="p-8 flex flex-col justify-center items-center bg-gray-100 min-h-screen py-12">
      {/* Heading */}
      <h1 className="text-center text-4xl font-bold text-blue-600 mb-12">
        Latest Collections
      </h1>
      
      {/* Products */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(products || []).map((product) => (
            <Product key={product._id} product={product}  />
          ))}
        </div>
      </div>
    </div>
      <Footer />
    </div>
    ))
}

export default Home
