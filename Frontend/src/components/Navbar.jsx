import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx'
import ShowProduct from '../pages/ShowProduct.jsx'

const Navbar = () => {
  const [open, setOpen] = React.useState(false)
  const { user, setUser } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()

  // ซ่อน Navbar ถ้า path คือ /login
  if (location.pathname === '/login') {
    return null
  }  

  return (
    <nav className="flex  items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-gray-300 bg-white relative transition-all">
      <div className="flex items-center gap-20">
        <NavLink to="/" className="flex items-center">
          <img src="/Logo-bearshear.svg" alt="Logo" width="50" height="40" />
          <span className="text-xl font-bold ml-2 text-[#FAAB78]">Bear Share</span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="flex items-start gap-0">
          <ul className="hidden md:flex items-center gap-8 text-sm">
            <li><NavLink to="/" className="hover:text-[#FAAB78] transition">Home</NavLink></li>
            <li><NavLink to="/showproduct" className="hover:text-[#FAAB78] transition">Marketplace</NavLink></li>
            <li><NavLink to="/about" className="hover:text-[#FAAB78] transition">About</NavLink></li>
            <li><NavLink to="/community" className="hover:text-[#FAAB78] transition">Community</NavLink></li>
          </ul>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-8">
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-200 px-3 rounded-lg focus-within:border-[#FAAB78] transition-all">
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search"
          />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.836 10.615L15 14.695" stroke="#5a5653ff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              clipRule="evenodd"
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke="#5a5653ff"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#d79162ff"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">3</button>
        </div>

        {!user ? (
          <div className="relative flex items-center justify-center space-x-0 ml-10">
            <button
              onClick={() => navigate('/login?mode=signup')}
              className="relative z-30 px-6 py-2 bg-[#FAAB78] font-promt rounded-lg shadow-md hover:bg-[#F79657] transition-all ease-in-out cursor-pointer"
            >
              Sign up
            </button>
            <button
              onClick={() => navigate('/login?mode=login')}
              className="relative -ml-4 z-20 px-6 py-2 bg-[#E8F3D6] font-promt rounded-lg shadow-md hover:bg-[#FCF9BE] transition-all ease-in-out cursor-pointer"
            >
              Log in
            </button>
          </div>
        ) : (
       <div className='px-6 py-2 bg-[#FAAB78] font-promt rounded-lg shadow-md'>
  <img src="/assets/profile.jpg" alt="profile-icon" />
  <ul>
    {user.role === 'user' && (
      <li>
        <NavLink to="/myorders" className="hover:text-[#FAAB78] transition">
          My Orders
        </NavLink>
      </li>
     )}
          {user.role === 'admin' && (
            <li>
              <NavLink to="/admindashboard" className="hover:text-[#FAAB78] transition">
                Admin Dashboard
              </NavLink>
            </li>
          )}

          <li>
            <NavLink to="/settings" className="hover:text-[#FAAB78] transition">
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              onClick={() => setUser(false)}
              className="hover:text-[#FAAB78] transition"
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </div>

        )}
      </div>

      <button onClick={() => setOpen(!open)} aria-label="Menu" className="sm:hidden">
        {/* Menu Icon SVG */}
        <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
      >
        <NavLink to="/" className="block">
          Home
        </NavLink>
        <NavLink to="/about" className="block">
          Marketplace
        </NavLink>
        <NavLink to="/contact" className="block">
          Categories
        </NavLink>
        <NavLink to="/about" className="block">
          About
        </NavLink>
        <NavLink to="/communities" className="block">
          Communities
        </NavLink>
        <button className="cursor-pointer px-6 py-2 mt-2 bg-[#FAAB78] hover:bg-[#F79657] transition text-white rounded-lg text-sm">Login</button>
      </div>
    </nav>
  )
}

export default Navbar
