import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

            </Routes>

        </BrowserRouter>
    );
}

const styles = {
    nav: {
        padding: "15px",
        background: "#1e293b",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    }
};

export default App;