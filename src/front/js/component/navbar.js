import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate(); // Inicializa el hook useNavigate

    const handleLogout = async () => {
        const success = await actions.logout(); // Espera el resultado del logout
        if (success) {
            navigate("/"); // Redirige al home si el logout fue exitoso
        }
    };

    return (
        <nav className="navbar navbar-light bg-dark">
            <Link to="/">
                <span className="navbar-brand mb-0 h1 ms-5 logo text-white">
                    <i className="fa-solid fa-truck-fast"></i> ADRA
                </span>
            </Link>
            {store.token == null ? (
                <div className="ms-auto d-flex me-5">
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-primary me-2 cart-nav"
                            aria-expanded="false"
                        >
                            <Link to="/login" className="text-white">
                                Login
                            </Link>
                        </button>
                    </div>

                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-primary me-2 cart-nav"
                            aria-expanded="false"
                        >
                            <Link to="/signup" className="text-white">
                                Register
                            </Link>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="ms-auto d-flex me-5">
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-primary me-2 cart-nav"
                        >
                            <Link to="/user" className="text-white">
                                User
                            </Link>
                        </button>
                    </div>
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-primary me-2 cart-nav"
                            onClick={handleLogout} // Usa handleLogout aquí
                        >
                            Logout
                        </button>
                    </div>
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-primary dropdown-toggle cart-nav"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fa-solid fa-truck-fast"></i>
                        </button>
                        <ul className="dropdown-menu"></ul>
                    </div>
                </div>
            )}
        </nav>
    );
};
