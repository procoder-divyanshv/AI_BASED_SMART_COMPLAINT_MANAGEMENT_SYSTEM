import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/api/auth/signup", form);
            alert("Signup Successful");
            navigate("/");
        } catch (err) {
            alert("Signup Failed");
        }
    };

    return (
        <div className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Signup</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Signup</button>

                <p className="auth-redirect">
                    Already have an account? 
                    <Link to="/">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;