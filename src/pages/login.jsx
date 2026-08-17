import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "./server/server";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const { data } = await API.post("api/login/", {
                username: username.trim(),
                password,
            });

            localStorage.setItem("user_id", data.user.id);
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            navigate("/home");
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Username yoki password noto'g'ri"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">

            <div
                className="card rounded-4 shadow-lg p-4"
                style={{ width: "400px" }}
            >

                {/* Header */}
                <div className="text-center mb-4">
                    <h2 className="fw-bold mb-2">
                        Task Manager
                    </h2>

                    <p className="text-muted mb-0">
                        Accountingizga kiring
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

                {/* Login form */}
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

                    {/* Password */}
                    <div className="mb-4">
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

                    {/* Login button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Kirilmoqda..." : "Login"}
                    </button>
                </form>

                {/* Register */}
                <p className="text-center text-muted mt-4 mb-0">
                    Accountingiz yo'qmi?{" "}

                    <Link
                        to="/register"
                        className="text-decoration-none fw-semibold"
                    >
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;