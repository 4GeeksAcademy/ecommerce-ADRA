import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    return (
        <nav className="navbar navbar-light bg-dark">
            <Link to="/">
                <span className="navbar-brand mb-0 h1 ms-5 logo text-white">
                    <i className="fa-solid fa-truck-fast"></i> ADRA
                </span>
            </Link>

            <div className="ms-auto d-flex me-5">
                <div className="btn-group">
                    <button
                        type="button"
                        className="btn btn-primary me-2 cart-nav"
                        aria-expanded="false"
                    >
                        Login
                    </button>
                </div>

                <div className="btn-group">
                    <button
                        type="button"
                        className="btn btn-primary me-2 cart-nav"
                        aria-expanded="false"
                    >
                        Register
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
        </nav>
    );
};









