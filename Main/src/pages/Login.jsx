import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../content/AppContext";

function Login() {
  const { user, setUser } = useContext(AppContext);
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setName("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (state === "Sign Up") {
      try {
        await axios.post("http://localhost:3000/register", {
          name,
          email,
          password,
        });
        setNotification({ 
          message: "Account created successfully!", 
          type: "success" 
        });
        setState("Login");
        clearForm();
      } catch {
        setNotification({ 
          message: "Failed to create account.", 
          type: "error" 
        });
      }
    } else if (state === "Login") {
      try {
        const response = await axios.post("http://localhost:3000/login", {
          email,
          password,
        });
        
        localStorage.setItem("token", response.data.token);

        const userResponse = await axios.get('http://localhost:3000/user', {
          headers: { Authorization: `Bearer ${response.data.token}` }
        });
        
        setUser(userResponse.data.user);
        setNotification({ 
          message: response.data.message, 
          type: "success" 
        });
        clearForm();
        navigate("/");
      } catch {
        setNotification({ 
          message: "Invalid email or password.", 
          type: "error" 
        });
      }
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        {notification.message && (
          <div 
            className={`w-full p-3 mb-4 rounded-md text-center ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-400' 
                : 'bg-red-100 text-red-700 border border-red-400'
            }`}
          >
            {notification.message}
          </div>
        )}
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "Sign Up" : "Login"} to book appointment
        </p>
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 my-2 rounded-md text-base"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              Sign Up here
            </span>
          </p>
        )}
      </div>
    </form>
  );
}

export default Login;
