import React, { useState, useEffect, useContext } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Context } from "../store/appContext";

export const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const { actions, store } = useContext(Context);

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch(
            "https://humble-chainsaw-9664gw4grw4377v7-3001.app.github.dev/api/create-payment",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                //la cantidad ha pagar esta puesta fija, pero puede recibir un objeto desde el contexto
                body: JSON.stringify({ amount: store.total, currency: "usd" }), // Amount in cents
            }
        )
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const { error, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            }
        );

        setLoading(false);

        if (error) {
            console.log("[error]", error);
        } else if (paymentIntent.status === "succeeded") {
            console.log("Payment succeeded!");
        } else {
            console.log("some error");
        }
    };

    return (
        <form className="w-25 m-auto mt-4" onSubmit={handleSubmit}>
            <CardElement />
            <button
                type="submit"
                className="btn btn-primary mt-5"
                disabled={!stripe || loading}
                onClick={() => {
                    alert("Pago exitoso");
                    window.location.href = "/";
                }}
            >
                Pay
            </button>
        </form>
    );
};
