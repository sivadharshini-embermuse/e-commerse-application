import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <PageTitle title="Unauthorized" />
      <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md w-full border border-gray-200">
        <div className="text-red-500 mb-4 flex justify-center">
          <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access the Admin Panel.
        </p>
        <Link 
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl inline-block transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
