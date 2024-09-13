import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
            <div className = "container">
			<div className="card-group">
            <div className="card">
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                </div>
                <div className="card-footer">
                <small className="text-body-secondary"><button type="button" className="btn btn-secondary">Add to Cart</button></small>
                </div>
            </div>
            <div className="card">
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                </div>
                <div className="card-footer">
                <small className="text-body-secondary"><button type="button" className="btn btn-secondary">Add to Cart</button></small>
                </div>
            </div>
            <div className="card">
                <img src="..." class="card-img-top" alt="..." />
                <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
                </div>
                <div className="card-footer">
                <small className="text-body-secondary"><button type="button" className="btn btn-secondary">Add to Cart</button></small>
                </div>
            </div>
            <div className="card">
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                </div>
                <div className="card-footer">
                <small className="text-body-secondary"><button type="button" className="btn btn-secondary">Add to Cart</button></small>
                </div>
            </div>
            <div className="card">
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                </div>
                <div className="card-footer">
                <small className="text-body-secondary"><button type="button" className="btn btn-secondary">Add to Cart</button></small>
                </div>
            </div>
            <div className="card">
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
                </div>
                <div className="card-footer">
                <small className="text-body-secondary"><button type="button" className="btn btn-secondary">Add to Cart</button></small>
                </div>
            </div>
            </div>
            </div>
		</div>
	);
};
