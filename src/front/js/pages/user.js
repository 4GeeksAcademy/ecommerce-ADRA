import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const User = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        last_name: '',  
        email: '',
        mobile: '',
        address: ''
    });

    useEffect(() => {
        if (!store.token) {
            navigate("/login"); // Redirigir si no hay token
        } else {
            actions.loadUserData(); // Cargar los datos del usuario si hay token
            setUserData({
                name: store.user?.name || '',
                last_name: store.user?.last_name || '', 
                email: store.user?.email || '',
                mobile: store.user?.mobile || '',
                address: store.user?.address || ''
            });
        }
    }, [store.token, store.user]); // Verificar el token al montar el componente

    // Manejo de la modificación de datos
    const handleUpdate = async (e) => {
        e.preventDefault();
        const result = await actions.updateUserData(userData); // Implementa la función updateUserData en actions
        if (result) {
            alert("Datos actualizados exitosamente");
        } else {
            alert("Error al actualizar datos");
        }
    };

    // Manejo de la eliminación de cuenta
    const handleDelete = async (e) => {
        e.preventDefault();
        const deleted = await actions.deleteAccount();
        if (deleted) {
            alert("Cuenta eliminada correctamente");
            navigate("/"); // Redirigir después de eliminar la cuenta
        } else {
            alert("Error al eliminar la cuenta. Intenta nuevamente.");
        }
    };

    return (
        <div className="container mt-5">
            {store.user ? (
                <div>
                    <h2 className="mb-4">Perfil de Usuario</h2>
                    <form onSubmit={handleUpdate} className="form-group">
                        <div className="mb-3">
                            <label className="form-label">Nombre:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={userData.name}
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Apellido:</label> {/* Nuevo campo de apellido */}
                            <input
                                type="text"
                                className="form-control"
                                value={userData.last_name}
                                onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Teléfono:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={userData.mobile}
                                onChange={(e) => setUserData({ ...userData, mobile: e.target.value })}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Dirección:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={userData.address}
                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Actualizar</button>
                    </form>

                    <button onClick={handleDelete} className="btn btn-danger mt-3">Eliminar Cuenta</button>
                </div>
            ) : (
                <p>Cargando datos del usuario...</p>
            )}
        </div>
    );
};
