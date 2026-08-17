import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./server/server";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const token = localStorage.getItem("access");

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Notificationsni olish
    const getNotifications = async () => {
        try {
            const response = await API.get(
                "api/notification/",
                { headers }
            );

            const sorted = [...response.data].sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            );

            setNotifications(sorted);

        } catch (error) {
            console.log(error);
            setError(
                "Notificationlarni yuklashda xatolik yuz berdi"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getNotifications();
    }, []);

    // Read qilish
    const markAsRead = async (notification) => {
        if (notification.is_read) {
            return;
        }

        try {
            await API.patch(
                `api/notification/${notification.id}/read/`,
                {},
                { headers }
            );

            setNotifications((prev) =>
                prev.map((item) =>
                    item.id === notification.id
                        ? {
                            ...item,
                            is_read: true,
                        }
                        : item
                )
            );

        } catch (error) {
            console.log(error);
        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.is_read
    ).length;

    return (
        <div className="min-vh-100 bg-light">

            {/* Navbar */}
            <nav className="navbar bg-white border-bottom shadow-sm">
                <div className="container">

                    <button
                        className="btn btn-link text-decoration-none text-dark"
                        onClick={() => navigate("/home")}
                    >
                        Back
                    </button>

                    <h5 className="mb-0 fw-bold">
                        Notifications
                    </h5>

                    <span className="badge bg-primary">
                        {unreadCount} unread
                    </span>

                </div>
            </nav>

            {/* Main */}
            <main className="container py-4">

                <div className="row justify-content-center">

                    <div className="col-12 col-md-8 col-lg-6">

                        {/* Header */}
                        <div className="mb-4">

                            <h3 className="fw-bold mb-1">
                                Messages
                            </h3>

                            <p className="text-muted mb-0">
                                Barcha notificationlaringiz
                            </p>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        {/* Loading */}
                        {loading ? (
                            <div className="text-center py-5">

                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                />

                                <p className="text-muted mt-3">
                                    Loading...
                                </p>

                            </div>
                        ) : notifications.length === 0 ? (

                            /* Empty */
                            <div className="card border-0 shadow-sm">

                                <div className="card-body text-center py-5">

                                    <div
                                        style={{
                                            fontSize: "50px",
                                        }}
                                    >
                                        🔔
                                    </div>

                                    <h5 className="mt-3">
                                        No notifications
                                    </h5>

                                    <p className="text-muted">
                                        Hozircha notificationlar mavjud emas.
                                    </p>

                                </div>

                            </div>
                        ) : (

                            /* Messages */
                            <div
                                className="bg-white rounded-4 shadow-sm p-3"
                                style={{
                                    maxHeight: "650px",
                                    overflowY: "auto",
                                }}
                            >

                                {notifications.map(
                                    (notification) => (
                                        <div
                                            key={
                                                notification.id
                                            }
                                            className={`d-flex mb-3 ${
                                                notification.is_read
                                                    ? ""
                                                    : "justify-content-end"
                                            }`}
                                        >

                                            <div
                                                onClick={() =>
                                                    markAsRead(
                                                        notification
                                                    )
                                                }
                                                className={`p-3 rounded-4 ${
                                                    notification.is_read
                                                        ? "bg-light"
                                                        : "bg-primary text-white"
                                                }`}
                                                style={{
                                                    maxWidth:
                                                        "85%",
                                                    cursor:
                                                        notification.is_read
                                                            ? "default"
                                                            : "pointer",
                                                }}
                                            >

                                                {/* Message */}
                                                <div className="mb-2">
                                                    {
                                                        notification.message
                                                    }
                                                </div>

                                                {/* Time */}
                                                <div
                                                    className={
                                                        notification.is_read
                                                            ? "text-muted"
                                                            : "text-white-50"
                                                    }
                                                    style={{
                                                        fontSize:
                                                            "12px",
                                                    }}
                                                >
                                                    {new Date(
                                                        notification.created_at
                                                    ).toLocaleString()}
                                                </div>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Notifications;