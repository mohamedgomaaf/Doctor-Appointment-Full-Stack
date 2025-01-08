import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../content/AppContext";
import { assets } from "../assets/assets";
import RelateDoctors from "../components/RelateDoctors";
import axios from "axios";

function Appointments() {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotTime, setSlotTime] = useState("");
  const [slotIndex, setSlotIndex] = useState(0);
  const [bookingStatus, setBookingStatus] = useState("");
  const [error, setError] = useState("");

  const handleBookAppointment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!slotTime) {
      setError("Please select an appointment time");
      return;
    }

    try {
      setError("");
      const response = await axios.post(
        "http://localhost:3000/bookings",
        {
          doctorName: docInfo.name,
          appointmentDate: docSlots[slotIndex][0].datetime
            .toISOString()
            .split("T")[0],
          appointmentTime: slotTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            token: token,
          },
        }
      );

      if (response.status === 201) {
        setBookingStatus("Appointment booked successfully!");
        setTimeout(() => navigate("/my-appointments"), 500);
      }
    } catch (error) {
      setBookingStatus(
        error.response?.data?.error ||
          "Failed to book appointment. Please try again."
      );
    }
  };
  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const CLINIC_START_HOUR = 10;
  const CLINIC_END_HOUR = 21;
  const SLOT_DURATION = 30;

  const getAvailableSlots = async () => {
    try {
      setDocSlots([]);
      const today = new Date();
      today.setSeconds(0, 0);

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        let startTime = new Date(currentDate);
        startTime.setHours(CLINIC_START_HOUR, 0, 0, 0);

        if (i === 0) {
          const now = new Date();
          if (now > startTime) {
            startTime = new Date(now);
            startTime.setMinutes(now.getMinutes() + SLOT_DURATION);
            startTime.setSeconds(0, 0);

            if (startTime.getHours() >= CLINIC_END_HOUR) {
              continue;
            }
          }
        }

        const endTime = new Date(currentDate);
        endTime.setHours(CLINIC_END_HOUR, 0, 0, 0);

        const timeSlots = [];
        const currentTime = new Date(startTime);

        while (currentTime < endTime) {
          const formattedTime = currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          timeSlots.push({
            datetime: new Date(currentTime),
            time: formattedTime,
            available: true,
          });

          currentTime.setMinutes(currentTime.getMinutes() + SLOT_DURATION);
        }

        if (timeSlots.length > 0) {
          setDocSlots((prev) => [...prev, timeSlots]);
        }
      }
    } catch (error) {
      console.error("Error generating time slots:", error);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    if (docInfo && docSlots.length > 0) {
      setSlotIndex(0);
    }
  }, [docInfo, docSlots]);

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.specialty}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
                About <img className="w-3" src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-600 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-800">
                {currencySymbol}
                {docInfo.fees}
              </span>{" "}
            </p>
          </div>
        </div>
        <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4 no-scrollbar">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4 no-scrollbar">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  key={index}
                  className={`text-sm font-light  flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                >
                  {item.time}
                </p>
              ))}
          </div>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {bookingStatus && (
            <p
              className={`text-center mt-2 ${
                bookingStatus.includes("Failed")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {bookingStatus}
            </p>
          )}
          <button
            onClick={handleBookAppointment}
            className={`w-full sm:w-auto bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6 
              ${!slotTime ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!slotTime}
          >
            {!slotTime ? "Select date and time" : "Book an appointment"}
          </button>
        </div>
        <RelateDoctors docId={docId} specialty={docInfo.specialty} />
      </div>
    )
  );
}

export default Appointments;
