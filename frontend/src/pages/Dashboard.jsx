import { useEffect, useState } from "react";
import axios from "axios";
import ComplaintList from "../components/ComplaintList";
import ComplaintForm from "../components/ComplaintForm";
import Navbar from "../components/Navbar"; // <-- Imported the Navbar component

function Dashboard() {
    const [complaints, setComplaints] = useState([]);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get(
                "https://ai-based-smart-complaint-management-ao3p.onrender.com/api/complaints",
                {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                }
            );
            setComplaints(res.data);
        } catch (err) {
            console.error("Error fetching complaints:", err);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    return (
        <>
            {/* The Navbar will now sit elegantly across the top of the page */}
            <Navbar />

            <div style={styles.container}>

                {/* FORM SECTION */}
                <div style={styles.left}>
                    <ComplaintForm onSuccess={fetchComplaints} />
                </div>

                {/* LIST SECTION */}
                <div style={styles.right}>
                    <ComplaintList complaints={complaints} />
                </div>

            </div>
        </>
    );
}

const styles = {
    container: {
        display: "flex",
        gap: "20px",
        padding: "20px",
        marginTop: "10px" // Adds a bit of breathing room below the navbar
    },

    left: {
        flex: 1
    },

    right: {
        flex: 2
    }
};

export default Dashboard;