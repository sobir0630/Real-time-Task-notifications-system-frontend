import { useEffect, useState } from "react";
import API from "./server/server";
import { Link, useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [users, setUsers] = useState([]);

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    // Edit account
    const [editUsername, setEditUsername] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editingUsername, setEditingUsername] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [savingAccount, setSavingAccount] = useState(false);

    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAccount, setShowAccount] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("access");

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // =========================
    // TASKS
    // =========================

    const getTasks = async () => {
        try {
            const response = await API.get("/api/tasks/", { headers });
            setTasks(response.data);
        } catch (error) {
            setError("Tasklarni yuklashda xatolik yuz berdi", `| ${error} |`);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // NOTIFICATIONS
    // =========================

    const getNotifications = async () => {
        try {
            const response = await API.get(
                "/api/notification/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNotifications(response.data);

            console.log("NOTIFICATIONS:", response.data);
        } catch (error) {
            console.log("Notification error:", error);
        }
    };

    // =========================
    // CURRENT USER
    // =========================

    const getCurrentUser = async () => {
        try {
            const id = localStorage.getItem("user_id");

            const response = await API.get(
                `/api/users/${id}/`,
                { headers }
            );

            console.log("Current user:", response.data);

            setEmail(response.data.email || "");
            setUsername(response.data.username || "");

            // Edit uchun boshlang'ich qiymatlar
            setEditEmail(response.data.email || "");
            setEditUsername(response.data.username || "");

        } catch (error) {
            console.log("Current user error:", error);
        }
    };

    // =========================
    // USERS
    // =========================

    const getUsers = async () => {
        try {
            const response = await API.get(
                "/api/users/",
                { headers }
            );

            setUsers(response.data);
        } catch (error) {
            console.log("Users error:", error);
        }
    };

    // =========================
    // USE EFFECT
    // =========================

    useEffect(() => {
        getTasks();
        getNotifications();
        getCurrentUser();
        getUsers();

        const interval = setInterval(() => {
            getNotifications();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // =========================
    // CREATE TASK
    // =========================

    const createTask = async (e) => {
        e.preventDefault();

        setCreating(true);
        setError("");

        try {
            await API.post(
                "/api/tasks/",
                {
                    title,
                    description,
                    assigned_to_id: assignedTo,
                    due_date: dueDate || null,
                },
                { headers }
            );

            setTitle("");
            setDescription("");
            setAssignedTo("");
            setDueDate("");

            setShowModal(false);

            getTasks();
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Task yaratishda xatolik yuz berdi"
            );
        } finally {
            setCreating(false);
        }
    };

    // =========================
    // CHANGE STATUS
    // =========================

    const changeStatus = async (task, status) => {
        try {
            await API.patch(
                `/api/tasks/${task.id}/`,
                { status },
                { headers }
            );

            getTasks();
            getNotifications();

        } catch (error) {
            setError(
                "Statusni o'zgartirishda xatolik yuz berdi"
            );
        }
    };

    // =========================
    // DELETE TASK
    // =========================

    const deleteTask = async (id) => {
        if (!window.confirm("Bu taskni o'chirmoqchimisiz?")) {
            return;
        }

        try {
            await API.delete(
                `/api/tasks/${id}/`,
                { headers }
            );

            setTasks(
                tasks.filter((task) => task.id !== id)
            );

            getNotifications();

        } catch (error) {
            setError(
                "Taskni o'chirishda xatolik yuz berdi"
            );
        }
    };

    // =========================
    // MARK NOTIFICATION READ
    // =========================

    const markAsRead = async (id) => {
        try {
            await API.patch(
                `/api/notification/${id}/read/`,
                {},
                { headers }
            );

            getNotifications();

        } catch (error) {
            console.log(
                "Read notification error:",
                error
            );
        }
    };

    // =========================
    // UPDATE USERNAME
    // =========================

    const updateUsername = async () => {
        if (!editUsername.trim()) {
            return;
        }

        setSavingAccount(true);

        try {
            const id = localStorage.getItem("user_id");

            await API.patch(
                `/api/users/${id}/`,
                {
                    username: editUsername,
                },
                { headers }
            );

            setUsername(editUsername);

            setEditingUsername(false);

        } catch (error) {
            console.log(
                "Username update error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Username o'zgartirishda xatolik yuz berdi"
            );

        } finally {
            setSavingAccount(false);
        }
    };

    // =========================
    // UPDATE EMAIL
    // =========================

    const updateEmail = async () => {
        if (!editEmail.trim()) {
            return;
        }

        setSavingAccount(true);

        try {
            const id = localStorage.getItem("user_id");

            await API.patch(
                `/api/users/${id}/`,
                {
                    email: editEmail,
                },
                { headers }
            );

            setEmail(editEmail);

            setEditingEmail(false);

        } catch (error) {
            console.log(
                "Email update error:",
                error
            );
            if (error.response?.data?.email) {
                setError(
                    error.response.data.email[0]
                )
                console.log("ewmail error", error.response.data.email[0]);
            }


        } finally {
            setSavingAccount(false);
        }
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_id");

        setShowAccount(false);

        navigate("/");
    };

    // =========================
    // FILTER
    // =========================

    const filteredTasks = tasks.filter((task) => {
        const statusMatch =
            filter === "all" ||
            task.status === filter;

        const titleMatch =
            task.title
                .toLowerCase()
                .includes(search.toLowerCase());

        return statusMatch && titleMatch;
    });

    const unreadCount = notifications.filter(
        (notification) =>
            !notification.is_read
    ).length;

    // =========================
    // STATUS BADGE
    // =========================

    const getStatusBadge = (status) => {
        const badges = {
            pending: "bg-secondary",
            in_progress: "bg-warning text-dark",
            completed: "bg-success",
        };

        return badges[status] || "bg-secondary";
    };

    const getStatusText = (status) => {
        const statuses = {
            pending: "Pending",
            in_progress: "In Progress",
            completed: "Completed",
        };

        return statuses[status] || status;
    };

    return (
        <div className="min-vh-100 bg-light">

            {/* ================= NAVBAR ================= */}

            <nav className="navbar navbar-light bg-white border-bottom shadow-sm">
                <div className="container">

                    <span className="navbar-brand fw-bold">
                        Task Manager
                    </span>

                    <div className="d-flex align-items-center gap-2 ms-auto">

                        {/* ACCOUNT BUTTON */}

                        <button
                            type="button"
                            className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                width: "42px",
                                height: "42px",
                            }}
                            onClick={() =>
                                setShowAccount(true)
                            }
                        >
                            👤
                        </button>

                        {/* NOTIFICATION */}

                        <div className="position-relative">

                            <button
                                className="btn btn-light position-relative"
                                onClick={() =>
                                    setShowNotifications(
                                        !showNotifications
                                    )
                                }
                            >
                                🔔

                                {unreadCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div
                                    className="position-absolute end-0 mt-2 bg-white shadow rounded p-3"
                                    style={{
                                        width: "350px",
                                        maxHeight: "450px",
                                        overflowY: "auto",
                                        zIndex: 1000,
                                    }}
                                >
                                    <h6 className="fw-bold mb-3">
                                        Notifications
                                    </h6>

                                    {notifications.length === 0 ? (
                                        <p className="text-muted small">
                                            Notificationlar mavjud emas
                                        </p>
                                    ) : (
                                        notifications.map(
                                            (notification) => (
                                                <div
                                                    key={
                                                        notification.id
                                                    }
                                                    className={`border-bottom py-2 ${
                                                        !notification.is_read
                                                            ? "bg-light"
                                                            : ""
                                                    }`}
                                                >

                                                    <p className="mb-1 small text-primary">
                                                        {
                                                            notification.message
                                                        }
                                                    </p>

                                                    <small className="text-muted p-2">
                                                        {new Date(
                                                            notification.created_at
                                                        ).toLocaleString()}
                                                    </small>

                                                    {!notification.is_read && (
                                                        <Link
                                                            className="btn btn-sm btn-outline-primary mt-4"
                                                            onClick={() =>
                                                                markAsRead(
                                                                    notification.id
                                                                )
                                                            }
                                                            to="/notifications"
                                                        >
                                                            Read
                                                        </Link>
                                                    )}

                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </nav>

            {/* ================= ACCOUNT MODAL ================= */}

            {showAccount && (
                <>
                    {/* BACKDROP */}

                    <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{
                            backgroundColor:
                                "rgba(0,0,0,0.45)",
                            zIndex: 1040,
                        }}
                        onClick={() =>
                            setShowAccount(false)
                        }
                    />

                    {/* MODAL */}

                    <div
                        className="position-fixed top-50 start-50 translate-middle"
                        style={{
                            width: "min(90%, 420px)",
                            zIndex: 1050,
                        }}
                    >

                        <div className="bg-white rounded-4 shadow-lg">

                            {/* HEADER */}

                            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">

                                <div className="d-flex align-items-center">

                                    <div
                                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            fontSize: "22px",
                                        }}
                                    >
                                        👤
                                    </div>

                                    <div>

                                        <h5 className="fw-bold mb-1">
                                            My Account
                                        </h5>

                                        <small className="text-muted">
                                            Account information
                                        </small>

                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setShowAccount(false)
                                    }
                                />

                            </div>

                            {/* BODY */}

                            <div className="p-4">

                                {/* USERNAME */}

                                <div className="d-flex align-items-center p-3 bg-light rounded-3 mb-3">

                                    <div
                                        className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                        }}
                                    >
                                        👤
                                    </div>

                                    <div className="flex-grow-1 overflow-hidden">

                                        <small className="text-muted d-block">
                                            Username
                                        </small>

                                        {editingUsername ? (
                                            <input
                                                type="text"
                                                className="form-control form-control-sm mt-1"
                                                value={
                                                    editUsername
                                                }
                                                onChange={(e) =>
                                                    setEditUsername(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            <span className="fw-semibold text-break">
                                                {username ||
                                                    "Unknown"}
                                            </span>
                                        )}

                                    </div>

                                    {/* EDIT / SAVE */}

                                    {editingUsername ? (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success ms-2"
                                            disabled={
                                                savingAccount
                                            }
                                            onClick={
                                                updateUsername
                                            }
                                        >
                                            ✓
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary ms-2"
                                            onClick={() => {
                                                setEditUsername(
                                                    username
                                                );
                                                setEditingUsername(
                                                    true
                                                );
                                            }}
                                        >
                                            ✏️
                                        </button>
                                    )}

                                </div>

                                {/* EMAIL */}

                                <div className="d-flex align-items-center p-3 bg-light rounded-3 mb-3">

                                    <div
                                        className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                        }}
                                    >
                                        ✉️
                                    </div>

                                    <div className="flex-grow-1 overflow-hidden">

                                        <small className="text-muted d-block">
                                            Email
                                        </small>

                                        {editingEmail ? (
                                            <input
                                                type="email"
                                                className="form-control form-control-sm mt-1"
                                                value={
                                                    editEmail
                                                }
                                                onChange={(e) =>
                                                    setEditEmail(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            <span className="fw-semibold text-break">
                                                {email ||
                                                    "Email mavjud emas"}
                                            </span>
                                        )}

                                    </div>

                                    {/* EDIT / SAVE */}

                                    {editingEmail ? (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success ms-2"
                                            disabled={
                                                savingAccount
                                            }
                                            onClick={
                                                updateEmail
                                            }
                                        >
                                            ✓
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary ms-2"
                                            onClick={() => {
                                                setEditEmail(
                                                    email
                                                );
                                                setEditingEmail(
                                                    true
                                                );
                                            }}
                                        >
                                            ✏️
                                        </button>
                                    )}

                                </div>

                                <hr />

                                {/* LOGOUT */}

                                <div className="d-flex align-items-center p-3 bg-light rounded-3">

                                    <div
                                        className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                        }}
                                    >
                                        🚪
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-danger flex-grow-1 text-start"
                                        onClick={
                                            handleLogout
                                        }
                                    >
                                        <small className="d-block opacity-75">
                                            Account
                                        </small>

                                        <span className="fw-semibold">
                                            Accountdan chiqish
                                        </span>
                                    </button>

                                </div>

                            </div>

                            {/* FOOTER */}

                            <div className="p-3 border-top text-end">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setShowAccount(
                                            false
                                        )
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>
                    </div>
                </>
            )}

            {/* ================= MAIN ================= */}

            <main className="container py-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>
                        <h2 className="fw-bold mb-1">
                            My Tasks
                        </h2>

                        <p className="text-muted mb-0">
                            Vazifalaringizni boshqaring
                        </p>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            setShowModal(true)
                        }
                    >
                        + New Task
                    </button>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="alert alert-danger">
                        {error}

                        <button
                            className="btn-close float-end"
                            onClick={() =>
                                setError("")
                            }
                        />
                    </div>
                )}

                {/* FILTERS */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-body">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        <hr />

                        <div className="d-flex gap-2 flex-wrap">

                            {[
                                ["all", "All"],
                                ["pending", "Pending"],
                                [
                                    "in_progress",
                                    "In Progress",
                                ],
                                [
                                    "completed",
                                    "Completed",
                                ],
                            ].map(
                                ([value, label]) => (
                                    <button
                                        key={value}
                                        className={`btn ${
                                            filter === value
                                                ? "btn-primary"
                                                : "btn-outline-secondary"
                                        }`}
                                        onClick={() =>
                                            setFilter(
                                                value
                                            )
                                        }
                                    >
                                        {label}
                                    </button>
                                )
                            )}

                        </div>

                    </div>
                </div>

                {/* TASKS */}

                {loading ? (
                    <div className="text-center py-5">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                    </div>

                ) : filteredTasks.length === 0 ? (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <h5>
                                Tasklar mavjud emas
                            </h5>

                            <p className="text-muted">
                                Yangi task yaratish uchun
                                "New Task" tugmasini bosing.
                            </p>

                        </div>

                    </div>

                ) : (

                    <div className="row g-4">

                        {filteredTasks.map(
                            (task) => (

                                <div
                                    className="col-12 col-md-6 col-lg-4"
                                    key={task.id}
                                >

                                    <div className="card border-0 shadow-sm h-100">

                                        <div className="card-body">

                                            <div className="d-flex justify-content-between align-items-start mb-3">

                                                <h5 className="fw-bold">
                                                    {task.title}
                                                </h5>

                                                <span
                                                    className={`badge ${getStatusBadge(
                                                        task.status
                                                    )}`}
                                                >
                                                    {getStatusText(
                                                        task.status
                                                    )}
                                                </span>

                                            </div>

                                            <p className="text-muted">
                                                {task.description ||
                                                    "Description mavjud emas"}
                                            </p>

                                            <div className="small text-muted mb-3">

                                                {task.due_date && (
                                                    <div>
                                                        📅{" "}
                                                        {new Date(
                                                            task.due_date
                                                        ).toLocaleDateString()}
                                                    </div>
                                                )}

                                                <div className="fw-semibold">
                                                    👤 Created:{" "}
                                                    {
                                                        task
                                                            .created_by
                                                            .username
                                                    }
                                                </div>

                                                <div className="fw-semibold">
                                                    👤 Assigned:{" "}
                                                    {
                                                        task
                                                            .assigned_to
                                                            .username
                                                    }
                                                </div>

                                            </div>

                                            {/* STATUS */}

                                            <div className="mb-3">

                                                <label className="form-label small fw-semibold">
                                                    Change status
                                                </label>

                                                <hr />

                                                {task.status ===
                                                    "pending" && (
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={
                                                            task.status
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            changeStatus(
                                                                task,
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    >
                                                        <option value="pending">
                                                            Pending
                                                        </option>

                                                        <option value="in_progress">
                                                            In Progress
                                                        </option>
                                                    </select>
                                                )}

                                                {task.status ===
                                                    "in_progress" && (
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={
                                                            task.status
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            changeStatus(
                                                                task,
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    >
                                                        <option value="in_progress">
                                                            In Progress
                                                        </option>

                                                        <option value="completed">
                                                            Completed
                                                        </option>
                                                    </select>
                                                )}

                                                {task.status ===
                                                    "completed" && (
                                                    <span className="badge bg-success p-2">
                                                        ✓
                                                        Completed
                                                    </span>
                                                )}

                                            </div>

                                            {/* DELETE */}

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    deleteTask(
                                                        task.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            )
                        )}

                    </div>
                )}

            </main>

            {/* ================= CREATE TASK MODAL ================= */}

            {showModal && (

                <div
                    className="modal d-block"
                    style={{
                        backgroundColor:
                            "rgba(0,0,0,0.5)",
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title fw-bold">
                                    Create New Task
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() =>
                                        setShowModal(
                                            false
                                        )
                                    }
                                />

                            </div>

                            <form
                                onSubmit={createTask}
                            >

                                <div className="modal-body">

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Title
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Description
                                        </label>

                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={
                                                description
                                            }
                                            onChange={(e) =>
                                                setDescription(
                                                    e.target
                                                        .value
                                                )
                                            }
                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Assign to
                                        </label>

                                        <select
                                            className="form-select"
                                            value={
                                                assignedTo
                                            }
                                            onChange={(e) =>
                                                setAssignedTo(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            required
                                        >

                                            <option value="">
                                                User tanlang
                                            </option>

                                            {users.map(
                                                (user) => (

                                                    <option
                                                        key={
                                                            user.id
                                                        }
                                                        value={
                                                            user.id
                                                        }
                                                    >
                                                        {
                                                            user.username
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Due date
                                        </label>

                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={
                                                dueDate
                                            }
                                            onChange={(e) =>
                                                setDueDate(
                                                    e.target
                                                        .value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setShowModal(
                                                false
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={
                                            creating
                                        }
                                    >
                                        {creating
                                            ? "Creating..."
                                            : "Create Task"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Home;