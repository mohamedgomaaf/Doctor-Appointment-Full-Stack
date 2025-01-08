import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../content/AppContext";

function TopDoctors() {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
        {doctors.slice(0, 10).map((item, index) => {
          return (
            <div
              onClick={() => {
                navigate(`/appointments/${item._id}`);
                scrollTo(0, 0);
              }}
              key={index}
              className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="bg-[#EAEFFF]" src={item.image} alt="" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                  <p className="w-2 h-2 rounded-full bg-green-500"></p>
                  <p>Available</p>
                </div>
                <p className="text-[#262626] text-lg font-medium">
                  {item.name}
                </p>
                <p className="text-[#5C5C5C] text-sm">{item.specialty}</p>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        More
      </button>
    </div>
  );
}

export default TopDoctors;