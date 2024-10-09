import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CheckoutForm } from '../component/checkout'

export const Payment = () => {
	const { store, actions } = useContext(Context);
	//la clave en .env!!! ----------- esta de abajo es la clave
	const stripePromise = loadStripe('pk_test_51Q7eNvD31DD0ObEkXIyiIucI0nzbWTbtnQaB2KE0aBZKLYiu3xf9wWYwjjFFS9EhfUlapkxSSAcYP6I3vaFRZTd80096xivpHo');
	
	
	return (
		<div className="text-center mt-5">
			<h1>Stripe payment</h1>
			<Elements stripe={stripePromise}>
				<CheckoutForm />
			</Elements>
		</div>
	);
};