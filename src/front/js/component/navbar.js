import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const success = await actions.logout();
        if (success) {
            navigate("/");
        }
    };
    useEffect(() => {
        actions.getTotal();
    }, [store.cart]);

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
                            className="btn btn-primary dropdown-toggle cart-nav mx-5"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fa-solid fa-truck-fast"></i> (
                            {store.cart.length})
                        </button>
                        <ul className="dropdown-menu">
                            {store.cart.map((item, index) => (
                                <li key={index}>
                                    <span className="dropdown-item">
                                        {item.name} - ${item.price}
                                    </span>
                                </li>
                            ))}
                            <li className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    class="btn btn-primary"
                                >
                                    Total: {store.total}
                                </button>
                            </li>
                        </ul>
                    </div>
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
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};
