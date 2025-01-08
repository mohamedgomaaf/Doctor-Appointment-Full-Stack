import React, { useState, useEffect } from "react";
import axios from "axios";
import RescheduleModal from "../components/RescheduleModal";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelStatus, setCancelStatus] = useState("");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view appointments");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
            token: token,
          },
        });

        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setError(error.response?.data?.error || "Failed to load appointments");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    setAppointmentToCancel(bookingId);
    setShowConfirmDialog(true);
  };

  const confirmCancel = async () => {
    try {
      setCancellingId(appointmentToCancel);
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/bookings/${appointmentToCancel}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          token: token,
        },
      });

      setAppointments(appointments.filter((app) => app.id !== appointmentToCancel));
      setCancelStatus("Appointment cancelled successfully");
      setTimeout(() => setCancelStatus(""), 3000);
    } catch (error) {
      setCancelStatus("Failed to cancel appointment");
      setTimeout(() => setCancelStatus(""), 3000);
    } finally {
      setCancellingId(null);
      setShowConfirmDialog(false);
      setAppointmentToCancel(null);
    }
  };

  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleReschedule = async (newDate, newTime) => {
    try {
      setReschedulingId(selectedAppointment.id);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:3000/bookings/${selectedAppointment.id}`,
        {
          appointmentDate: newDate,
          appointmentTime: newTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            token: token,
          },
        }
      );

      setAppointments(
        appointments.map((app) =>
          app.id === selectedAppointment.id
            ? { ...app, appointmentDate: newDate, appointmentTime: newTime }
            : app
        )
      );

      setCancelStatus("Appointment rescheduled successfully");
      setShowRescheduleModal(false);
      setTimeout(() => setCancelStatus(""), 3000);
    } catch (error) {
      setCancelStatus("Failed to reschedule appointment");
      setTimeout(() => setCancelStatus(""), 3000);
    } finally {
      setReschedulingId(null);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading appointments...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">
        My appointments
      </p>
      {cancelStatus && (
        <div
          className={`text-center mt-4 ${
            cancelStatus.includes("Failed") ? "text-red-500" : "text-green-500"
          }`}
        >
          {cancelStatus}
        </div>
      )}
      {appointments.length === 0 ? (
        <div className="text-center mt-8 text-gray-500">
          No appointments found. Book your first appointment now!
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {appointments.map((appointment, index) => (
            <div
              key={appointment.id || index}
              className="bg-white rounded-lg shadow-sm border p-4"
            >
              <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {appointment.doctorName}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {appointment.appointmentTime}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span className="text-green-600">Confirmed</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleRescheduleClick(appointment)}
                    disabled={reschedulingId === appointment.id}
                    className={`px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md
                      ${
                        reschedulingId === appointment.id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-50"
                      }`}
                  >
                    {reschedulingId === appointment.id
                      ? "Rescheduling..."
                      : "Reschedule"}
                  </button>
                  <button
                    onClick={() => handleCancelBooking(appointment.id)}
                    disabled={cancellingId === appointment.id}
                    className={`px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md 
                      ${
                        cancellingId === appointment.id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-red-50"
                      }`}
                  >
                    {cancellingId === appointment.id
                      ? "Cancelling..."
                      : "Cancel"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Cancel Appointment</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to cancel this appointment?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setAppointmentToCancel(null);
                }}
                className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
              >
                No, keep it
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, cancel it
              </button>
            </div>
          </div>
        </div>
      )}

      <RescheduleModal
        show={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onReschedule={handleReschedule}
        currentDate={selectedAppointment?.appointmentDate || ""}
        currentTime={selectedAppointment?.appointmentTime || ""}
      />
    </div>
  );
}

export default MyAppointments;
