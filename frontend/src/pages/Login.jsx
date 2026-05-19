import { useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import API from "../api";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        email: "",
        password: ""

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

            const res =
                await API.post(
                    "/api/auth/login",
                    form
                );

            localStorage.setItem(
                "token",
                res.data.token
            );

            navigate("/dashboard");

        } catch (err) {

            alert("Login Failed");
        }
    };

    return (

        <div className="container">

            <form
                className="form"
                onSubmit={handleSubmit}
            >

                <h2>Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button type="submit">
                    Login
                </button>

                <p>

                    Don't have account?

                    <Link to="/signup">
                        Signup
                    </Link>

                </p>

            </form>

        </div>
    );
}

export default Login;