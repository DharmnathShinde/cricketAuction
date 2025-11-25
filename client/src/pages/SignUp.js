import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
import { register } from "../services/auth.service";
import { useState, useContext } from "react";
import Input from "../components/Input";
import Select from "../components/Select";
import Loader from "./Loading";

import { UserContext } from "../hooks/UserContext";
import {
  handleChange,
  handleEmailChange,
  handlePasswordChange,
} from "../utilities/handleChanges";

const SignUp = (props) => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    role: "",
    form: "",
  });

  const roleOptions = [
    { value: "organizer", label: "Organizer" },
    { value: "captain", label: "Captain" },
    { value: "viewer", label: "Viewer" },
  ];

  const data = [
    {
      type: "username",
      title: "Username",
      placeholder: "Enter your username",
      onChange: (value) => {
        handleChange(value, setUsername);
      },
      icon: faUser,
      error: "",
    },
    {
      type: "email",
      title: "Email",
      placeholder: "Enter your email",
      onChange: (value) => {
        handleEmailChange(value, setEmail, setErrors);
      },
      icon: faEnvelope,
      error: errors.email,
    },
    {
      type: "password",
      title: "Password",
      placeholder: "Enter your Password",
      onChange: (value) => {
        handlePasswordChange(value, setPassword, setErrors);
      },
      icon: faLock,
      error: errors.password,
    },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (errors.email !== "" || errors.password !== "") {
      return;
    }

    if (!role) {
      return setErrors((prev) => ({
        ...prev,
        role: "Please select a role",
      }));
    }

    setLoading(true);
    const data = await register(username, email, password, role);
    setLoading(false);

    if (!data.success) {
      return setErrors((prev) => ({
        ...prev,
        form: data.message,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      form: "",
    }));

    setUser(data.user);
    props.history.push("/auction");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Static background with subtle pattern */}
      <div className="absolute inset-0 bg-background-secondary">
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-background-secondary to-slate-800/50"></div>
      </div>

      <div className="relative z-10 glassmorphism max-w-xl w-full px-10 py-12 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl">
        {/* Modern heading with gradient */}
        <div className="text-center mb-8">
          <h3 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Sign Up
            </span>
          </h3>
          <div className="h-1 w-20 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full mt-3"></div>
        </div>

        <form
          id="form"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6"
        >
          {data.map((inputFields, index) => {
            return <Input key={index} {...inputFields} />;
          })}

          <Select
            type="role"
            title="Role"
            placeholder="Select your role"
            onChange={(value) => {
              setRole(value);
              setErrors((prev) => ({ ...prev, role: "" }));
            }}
            icon={faUserTag}
            error={errors.role}
            options={roleOptions}
            value={role}
          />

          <div className="center mt-8">
            <button
              type="submit"
              disabled={loading}
              className="relative inline-block px-8 py-3 rounded-xl transition-all duration-300 uppercase font-bold overflow-hidden border-none outline-none bg-gradient-to-r from-primary via-secondary to-accent text-white z-10 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transform disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Loader size="2" />
                  <span>Signing Up...</span>
                </span>
              ) : (
                <span className="relative z-10">Sign Up</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-secondary to-accent-hover opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </form>

        {/* Error message with modern styling */}
        {errors.form && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
            <p className="text-center text-red-400 text-sm font-medium">
              {errors.form}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
