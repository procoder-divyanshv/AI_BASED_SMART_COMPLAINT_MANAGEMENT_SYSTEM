import { useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import API from "../api";

function Signup() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        name: "",
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

            await API.post(
                "/api/auth/signup",
                form
            );

            alert(
                "Signup Successful"
            );

            navigate("/");

        } catch (err) {

            alert("Signup Failed");
        }
    };

    return (

        <div className="container">

            <form
                className="form"
                onSubmit={handleSubmit}
            >

                <h2>Signup</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                />

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
                    Signup
                </button>

                <p>

                    Already have account?

                    <Link to="/">
                        Login
                    </Link>

                </p>

            </form>

        </div>
    );
}

export default Signup;