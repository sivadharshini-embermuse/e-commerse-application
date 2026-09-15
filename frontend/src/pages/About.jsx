import { Link } from 'react-router-dom'
import { FaShieldAlt, FaShippingFast, FaHeadset, FaGem } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'

const About = () => {
    return (
    <div className="flex flex-col min-h-screen">
        <PageTitle title="About Us" />
        <Navbar />
        
        <main className="flex-grow">
            {/* 1. HERO SECTION */}
            <section className="bg-gray-100 py-16 px-4 md:px-8 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">About Our Store</h1>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Welcome to our online platform. We are dedicated to bringing you the best selection of products with a focus on quality, reliability, and exceptional customer service.
                    </p>
                    <Link to="/product" className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-blue-700 transition duration-300 shadow-md">
                        Shop Now
                    </Link>
                </div>
            </section>

            {/* 2. OUR STORY */}
            <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
                        Our journey began with a simple idea: to create an online store that people can trust. 
                        We noticed a gap in the market for a truly customer-centric shopping experience. 
                        Since our inception, our mission has been to carefully curate high-quality products 
                        that add value to our customers' everyday lives, while making the online shopping process as seamless as possible.
                    </p>
                </div>
            </section>

            {/* 3. WHY CHOOSE US */}
            <section className="bg-gray-50 py-16 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition duration-300 text-center border border-gray-100">
                            <div className="text-blue-500 text-4xl mb-4 flex justify-center"><FaGem /></div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Quality Products</h3>
                            <p className="text-gray-600">We source only the best materials to ensure our products meet your high standards.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition duration-300 text-center border border-gray-100">
                            <div className="text-blue-500 text-4xl mb-4 flex justify-center"><FaShieldAlt /></div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Secure Shopping</h3>
                            <p className="text-gray-600">Your data is safe with us. We use industry-standard encryption for all transactions.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition duration-300 text-center border border-gray-100">
                            <div className="text-blue-500 text-4xl mb-4 flex justify-center"><FaShippingFast /></div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Fast Delivery</h3>
                            <p className="text-gray-600">We work with reliable logistics partners to get your orders to you as quickly as possible.</p>
                        </div>
                        {/* Card 4 */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition duration-300 text-center border border-gray-100">
                            <div className="text-blue-500 text-4xl mb-4 flex justify-center"><FaHeadset /></div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Customer Support</h3>
                            <p className="text-gray-600">Our dedicated team is here to help you with any questions or concerns you may have.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CUSTOMER-FIRST SECTION */}
            <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
                <div className="bg-blue-600 text-white rounded-2xl p-10 md:p-16 text-center shadow-lg">
                    <h2 className="text-3xl font-bold mb-6">Our Customer-First Approach</h2>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-blue-100">
                        We believe that shopping online should be simple, reliable, and convenient. 
                        Every decision we make is guided by our commitment to providing you with an outstanding experience, 
                        from browsing our catalog to receiving your order at your doorstep.
                    </p>
                </div>
            </section>

            {/* 5. FINAL CTA */}
            <section className="py-16 px-4 md:px-8 text-center bg-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to find something great?</h2>
                <Link to="/product" className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-blue-700 transition duration-300 shadow-md">
                    Explore Products
                </Link>
            </section>
        </main>
        
        <Footer />
    </div>
    )
}

export default About
