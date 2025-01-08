import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../content/AppContext";

function MyProfile() {
  const { user } = useContext(AppContext);
  const [userData, setUserData] = useState({
    name: "",
    image: assets.profile_pic,
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
    },
    gender: "",
    dob: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        ...userData,
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">
      {isEdit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img
              className="w-36 rounded opacity-75"
              src={userData.image}
              alt=""
            />
          </div>
          <input
            type="file"
            onChange={(e) =>
              setUserData({
                ...userData,
                image: URL.createObjectURL(e.target.files[0]),
              })
            }
            id="image"
            hidden
          />
        </label>
      ) : (
        <img className="w-32 h-32 rounded-full" src={userData.image} alt="" />
      )}
      {isEdit ? (
        <input
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          className="bg-gray-50 text-3xl font-medium max-w-60"
          type="text"
          value={userData.name}
        />
      ) : (
        <p className="font-medium text-3xl text-[#262626] mt-4">
          {userData.name}
        </p>
      )}
      <hr className="bg-[#ADADAD] h-[1px] border-none" />
      <div>
        <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
              className="bg-gray-50 max-w-52"
              type="text"
              value={userData.phone}
            />
          ) : (
            <p className="text-blue-500">{userData.phone}</p>
          )}
          <p className="font-medium">Address:</p>
          <p className="text-gray-500">
            {isEdit ? (
              <input
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    address: { ...userData.address, line1: e.target.value },
                  })
                }
                className="bg-gray-50 max-w-52"
                type="text"
                value={userData.address.line1}
              />
            ) : (
              <p>{userData.address.line1}</p>
            )}
            <br />
            {isEdit ? (
              <input
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    address: { ...userData.address, line2: e.target.value },
                  })
                }
                className="bg-gray-50 max-w-52"
                type="text"
                value={userData.address.line2}
              />
            ) : (
              <p>{userData.address.line2}</p>
            )}
          </p>
        </div>
      </div>
      <div>
        <p className="text-[#797979] underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              onChange={(e) =>
                setUserData({ ...userData, gender: e.target.value })
              }
              className="max-w-20 bg-gray-50"
            >
              <option value="Not Selected">Not Selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p>{userData.gender}</p>
          )}
          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              onChange={(e) =>
                setUserData({ ...userData, dob: e.target.value })
              }
              className="bg-gray-50 max-w-52"
              type="date"
              value={userData.dob}
            />
          ) : (
            <p>{userData.dob}</p>
          )}
        </div>
      </div>
      <div className="mt-10">
        {isEdit ? (
          <button
            onClick={() => setIsEdit(!isEdit)}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Save information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(!isEdit)}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
