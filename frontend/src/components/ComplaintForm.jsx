import { useState } from "react";

import API from "../api";

function ComplaintForm({ refresh }) {

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

            [e.target.name]:
            e.target.value

        });
    };

    const handleSubmit =
    async (e) => {

        e.preventDefault();

        try {

            await API.post(
                "/api/complaints",
                form
            );

            alert(
                "Complaint Submitted"
            );

            setForm({

                name: "",
                email: "",
                title: "",
                description: "",
                category: "",
                location: ""

            });

            refresh();

        } catch (err) {

            console.log(err);

            alert("Error");
        }
    };

    return (

        <form
            className="form"
            onSubmit={handleSubmit}
        >

            <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
            />

            <input
                type="text"
                name="title"
                placeholder="Complaint Title"
                value={form.title}
                onChange={handleChange}
            />

            <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
            />

            <input
                type="text"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
            />

            <input
                type="text"
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
            />

            <button type="submit">
                Submit Complaint
            </button>

        </form>
    );
}

export default ComplaintForm;