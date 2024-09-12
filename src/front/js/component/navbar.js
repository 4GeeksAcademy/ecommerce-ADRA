import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";


export const Navbar = () => {

    const {store, actions} = useContext(Context);

    return (
        <nav className="navbar navbar-light bg-dark mb-3">
            <Link to="/">
                <span className="navbar-brand mb-0 h1 ms-5">
                <i class="fa-solid fa-truck-fast"></i>ADRA 
                </span>
            </Link>
            <div className="ml-auto">
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-primary dropdown-toggle me-5"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i class="fa-solid fa-truck-fast"></i>
                        </button>
                        <ul className="dropdown-menu">
                            
                            
                        </ul>
                    </div>
            </div>
        </nav>
    );
};