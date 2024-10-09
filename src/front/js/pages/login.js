import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "../../styles/home.css";

export const Login = () => {
    const { store, actions } = useContext(Context); // Obtenemos el store y las acciones
    const [email, setEmail] = useState(""); // Estado para el email
    const [password, setPassword] = useState(""); // Estado para la contraseña
    const [errorMsg, setErrorMsg] = useState(""); // Estado para los mensajes de error
    const navigate = useNavigate(); // Hook para redirigir al home

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Formulario enviado");

        if (email === "" || password === "") {
            setErrorMsg("Por favor, complete todos los campos.");
            return;
        }

        const success = await actions.login(email, password); // Llamar a la acción de login

        if (success) {
            navigate("/");
        } else {
            setErrorMsg("Error al iniciar sesión. Verifique sus credenciales.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="mb-4 text-center">Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingInput"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingInput">
                                Dirección de Email
                            </label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingPassword">Contraseña</label>
                        </div>

                        {errorMsg && <p className="text-danger">{errorMsg}</p>}

                        <button
                            type="submit"
                            className="btn btn-primary w-100 mt-3"
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
