import { FiMenu } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const AdminHeader = ({ toggleSidebar }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <FiMenu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Dashboard Overview
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Admin'}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 overflow-hidden flex items-center justify-center">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-blue-600 font-bold text-lg">{user?.name?.charAt(0) || 'A'}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
