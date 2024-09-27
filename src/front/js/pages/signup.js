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
    const [errorMsg, setErrorMsg] = useState(null); // Estado para errores
    
    const navigate = useNavigate();  // Hook para redirigir

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar que todos los campos estén completos
        if (!name || !lastName || !email || !mobile || !address || !password) {
            setErrorMsg("Todos los campos son obligatorios");
            return;
        }

        try {
            // Llamar a la acción signup
            const response = await actions.signup(name, lastName, email, password, mobile, address);

            // Si la respuesta es exitosa, redirigir al usuario al home
            if (response) {
                navigate("/");  // Redirige al home
            } else {
                setErrorMsg("Error al registrarse. Intente nuevamente.");
            }
        } catch (error) {
            setErrorMsg("Ocurrió un error durante el registro. Por favor, intente más tarde.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="mb-4 text-center">Registro</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingName"
                                placeholder="Nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
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
                                required
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
                                required
                            />
                            <label htmlFor="floatingEmail">Dirección de Email</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className="form-control"
                                id="floatingMobile"
                                placeholder="Número de Teléfono"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingMobile">Número de Teléfono</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingAddress"
                                placeholder="Dirección"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingAddress">Dirección</label>
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

                        {/* Mostrar mensaje de error si existe */}
                        {errorMsg && <p className="text-danger">{errorMsg}</p>}

                        <button type="submit" className="btn btn-primary w-100 mt-3">
                            Registrarse
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
