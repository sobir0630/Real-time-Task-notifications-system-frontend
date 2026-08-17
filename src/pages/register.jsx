import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "./server/server";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (password !== confirmPassword) {
            setError("Passwordlar bir xil emas");
            return;
        }

        setLoading(true);

        try {
            await API.post("api/register/", {
                username: username.trim(),
                email,
                password,
            });

            navigate("/home");
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Ro'yxatdan o'tishda xatolik yuz berdi"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">

            <div
                className="card border-0 shadow p-4"
                style={{ width: "400px" }}
            >

                {/* Header */}
                <div className="text-center mb-4">
                    <h2 className="fw-bold mb-2">
                        Task Manager
                    </h2>

                    <p className="text-muted mb-0">
                        Yangi account yarating
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div
                        className="alert alert-danger py-2"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {/* Register form */}
                <form onSubmit={handleSubmit}>

                    {/* Username */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            Username
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username kiriting"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* email */}
                    <div>
                        <label className="form-label fw-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email kiriting"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>


                    {/* Password */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            Password
                        </label>

                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Password kiriting"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Confirm password */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Confirm Password
                        </label>

                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Passwordni qayta kiriting"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Register button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Yaratilmoqda..." : "Register"}
                    </button>
                </form>

                {/* Login */}
                <p className="text-center text-muted mt-4 mb-0">
                    Accountingiz bormi?{" "}

                    <Link
                        to="/"
                        className="text-decoration-none fw-semibold"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;