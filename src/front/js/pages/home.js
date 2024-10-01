import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getProducts();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                {store.products.map((product) => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div className="card">
                            <img
                                src={product.url}
                                className="card-img-top"
                                alt={product.name}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">
                                    <strong>Price:</strong> ${product.price}
                                </p>
                            </div>
                            <div className="card-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => actions.addToCart(product)} // Llamada a la acción para añadir al carrito
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
