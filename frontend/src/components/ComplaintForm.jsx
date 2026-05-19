import { useState } from "react";
import axios from "axios";

function ComplaintForm({ onSuccess }) {

    const [form, setForm] = useState({
        name: "",
        email: "",
        title: "",
        description: "",
        category: "",
        location: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "https://ai-based-smart-complaint-management-ao3p.onrender.com/api/complaints",
                form,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            alert("Complaint Submitted Successfully");

            setForm({
                name: "",
                email: "",
                title: "",
                description: "",
                category: "",
                location: ""
            });

            if (onSuccess) onSuccess();

        } catch (err) {
            console.log(err);
            alert("Failed to submit complaint");
        }
    };

    return (
        <div className="card">

            <h2>Submit Complaint</h2>

            <form onSubmit={handleSubmit}>

                <input
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <input
                    name="category"
                    placeholder="Category (Electricity, Water, etc.)"
                    value={form.category}
                    onChange={handleChange}
                />

                <input
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                />

                <button type="submit">
                    Submit Complaint
                </button>

            </form>

        </div>
    );
}

export default ComplaintForm;