import React from "react";
import { Link } from "react-router-dom";
import { specialtyData } from "../assets/assets";

function SpecialtyMenu() {
  return (
    <div
      id="Specialty"
      className="flex flex-col items-center gap-4 py-16 text-[#262626]"
    >
      <h1 className="text-3xl font-medium">Find by Specialty</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>
      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll no-scrollbar">
        {specialtyData.map((item, index) => {
          return (
            <Link
              to={`/doctors/${item.specialty}`}
              key={index}
              className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="w-16 sm:w-24 mb-2 " src={item.image} alt="" />
              <p>{item.specialty}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SpecialtyMenu;
