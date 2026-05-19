import { useState } from "react";

function ComplaintList({ complaints }) {
    const [openId, setOpenId] = useState(null);

    const toggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "Critical":
                return "#ef4444";
            case "High":
                return "#f97316";
            case "Medium":
                return "#eab308";
            case "Low":
                return "#22c55e";
            default:
                return "#6b7280";
        }
    };

    return (
        <div style={styles.container}>

            <h2 style={styles.title}>Complaints Dashboard</h2>

            {complaints.map((c) => {
                const ai = c.aiResponse;
                const isOpen = openId === c._id;

                return (
                    <div key={c._id} style={styles.card}>

                        {/* HEADER */}
                        <div style={styles.header} onClick={() => toggle(c._id)}>

                            <div>
                                <h3 style={styles.heading}>{c.title}</h3>
                                <p style={styles.subText}>{c.location}</p>
                            </div>

                            <span
                                style={{
                                    ...styles.badge,
                                    backgroundColor: getPriorityColor(ai?.priority)
                                }}
                            >
                                {ai?.priority}
                            </span>
                        </div>

                        {/* BODY */}
                        <p style={styles.desc}>{c.description}</p>

                        <p style={styles.status}>
                            <b>Status:</b> {c.status}
                        </p>

                        {/* COLLAPSIBLE AI SECTION */}
                        <button
                            style={styles.button}
                            onClick={() => toggle(c._id)}
                        >
                            {isOpen ? "Hide AI Response ▲" : "View AI Response ▼"}
                        </button>

                        {isOpen && (
                            <div style={styles.aiBox}>

                                <p><b>Department:</b> {ai?.department}</p>

                                <p><b>Summary:</b> {ai?.summary}</p>

                                <hr style={{ margin: "10px 0" }} />

                                <p style={styles.aiText}>
                                    {ai?.professionalResponse}
                                </p>

                            </div>
                        )}

                    </div>
                );
            })}
        </div>
    );
}

/* =========================
   STYLES
========================= */

const styles = {
    container: {
        padding: "20px",
        minHeight: "100vh",
        color: "#fff"
    },

    title: {
        textAlign: "center",
        marginBottom: "20px",
        fontWeight: "700"
    },

    // 1. Modified to let the CSS class control properties like transitions and background blends
    card: {
        padding: "20px",
        marginBottom: "20px",
        borderRadius: "16px",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer"
    },

    heading: {
        margin: 0,
        fontSize: "18px"
    },

    subText: {
        fontSize: "13px",
        color: "#94a3b8",
        marginTop: "4px"
    },

    desc: {
        marginTop: "14px",
        color: "#cbd5e1",
        lineHeight: "1.6"
    },

    status: {
        marginTop: "12px",
        fontSize: "14px",
        color: "#94a3b8"
    },

    badge: {
        padding: "6px 14px",
        borderRadius: "20px",
        color: "#fff",
        fontSize: "12px",
        fontWeight: "600",
        height: "fit-content"
    },

    button: {
        marginTop: "14px",
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#2563eb",
        color: "#fff"
    },

    // 2. Adjusted for internal transparency
    aiBox: {
        marginTop: "15px",
        padding: "16px",
        borderRadius: "12px",
    },

    aiText: {
        whiteSpace: "pre-wrap",
        lineHeight: "1.6",
        color: "#e2e8f0"
    }
};
export default ComplaintList;