import React from "react";
import { FcGoogle } from "react-icons/fc";
import { axiosInstance } from "../utils/axios.util";
import { toast } from "sonner"

export default function SignupScreen() {
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    if (values.password !== values.confirm_password) {
      toast.error("Passwords do not match!");
      return;
    }

    axiosInstance
      .post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
      })
      .then((response) => {
        toast.success("Signup successful! Please log in.");
        window.location.href = "/login";
        setValues({
          name: "",
          email: "",
          password: "",
          confirm_password: "",
        });
      })
      .catch((error) => {
        console.error("Signup error:", error);
        toast.error("Signup failed! Please try again.");
      });
  }

  return (
    <div className="min-h-screen w-[100%] flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Name"
              required
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              required
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
              value={values.confirmPassword}
              onChange={(e) =>
                setValues({ ...values, confirm_password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition duration-200"
            onClick={handleSubmit}
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 flex items-center justify-center">
          <button className="flex items-center gap-2 py-2 px-4 border border-gray-300 rounded-xl w-full justify-center hover:bg-gray-50 transition duration-200">
            <FcGoogle className="text-xl" />
            Sign Up with Google
          </button>
        </div>
      </div>
    </div>
  );
}
