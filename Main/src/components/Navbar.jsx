import React, { useContext} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/logo-BNCDj_dh.svg";
import userImg from "../assets/user-img.png";
import dropdownIcon from "../assets/dropdownIcon.svg";
import { AppContext } from "../content/AppContext";

function Navbar() {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img onClick={() => navigate("/")} className="w-44 cursor-pointer" src={Logo} alt="Logo" />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to={"/"}>
          <li className="py-1">HOME</li>
        </NavLink>
        <NavLink to={"/doctors"}>
          <li className="py-1">ALL DOCTORS</li>
        </NavLink>
        <NavLink to={"/about"}>
          <li className="py-1">ABOUT</li>
        </NavLink>
        <NavLink to={"/contact"}>
          <li className="py-1">CONTACT</li>
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={userImg} alt="user" />
            <img className="w-2.5" src={dropdownIcon} alt="dropdownIcon" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 group-hover:block hidden">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p onClick={() => navigate("/my-profile")} className="hover:text-black cursor-pointer">My Profile</p>
                <p onClick={() => navigate("/my-appointments")} className="hover:text-black cursor-pointer">My Appointments</p>
                <p onClick={handleLogout} className="hover:text-black cursor-pointer">Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
