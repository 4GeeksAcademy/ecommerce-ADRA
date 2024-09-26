import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";  // Importa useNavigate
import "../../styles/home.css";

export const Signup = () => {
    const { actions } = useContext(Context);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();  // Hook para redirigir

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Llamar a la acción signup
        const response = await actions.signup(name, lastName, email, password, mobile, address);

        // Si la respuesta es exitosa, redirigir al usuario al home
        if (response) {
            navigate("/");  // Redirige al home
        }
    };

    return (
        <div className="text-center m-5">
            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingName"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="floatingName">Nombre</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingLastName"
                        placeholder="Apellido"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <label htmlFor="floatingLastName">Apellido</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        id="floatingEmail"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="floatingEmail">Email address</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="number"
                        className="form-control"
                        id="floatingMobile"
                        placeholder="Mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                    />
                    <label htmlFor="floatingMobile">Mobile</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingAddress"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <label htmlFor="floatingAddress">Address</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <button type="submit" className="btn btn-primary mt-2">
                    Submit
                </button>
            </form>
        </div>
    );
};
