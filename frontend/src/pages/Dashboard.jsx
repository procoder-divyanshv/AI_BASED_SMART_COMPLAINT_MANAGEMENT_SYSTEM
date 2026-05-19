import {
    useEffect,
    useState
} from "react";

import API from "../api";

import Navbar
from "../components/Navbar";

import ComplaintForm
from "../components/ComplaintForm";

import ComplaintList
from "../components/ComplaintList";

function Dashboard() {

    const [complaints,
    setComplaints] = useState([]);

    const fetchComplaints =
    async () => {

        try {

            const res =
                await API.get(
                    "/api/complaints"
                );

            setComplaints(
                res.data
            );

        } catch (err) {

            console.log(err);
        }
    };

    useEffect(() => {

        fetchComplaints();

    }, []);

    return (

        <div>

            <Navbar />

            <ComplaintForm
                refresh={fetchComplaints}
            />

            <ComplaintList
                complaints={complaints}
            />

        </div>
    );
}

export default Dashboard;