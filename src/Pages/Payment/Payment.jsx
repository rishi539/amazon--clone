import React, { useContext, useState } from "react";
import LayOut from "../../components/LayOut/LayOut"; // Importing the layout component for common UI elements
import classes from "./Payment.module.css"; // Importing CSS module for custom payment page styles
import { DataContext } from "../../components/DataProvider/DataProvider"; // Importing global state
import ProductCard from "../../components/Product/ProductCard"; // Importing the ProductCard component to display the products in the basket
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"; // Importing Stripe hooks and components for payment processing
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat"; // Importing custom currency formatting component
import { axiosInstance } from "../../Api/axios"; // Importing axios instance for making HTTP requests
import { ClipLoader } from "react-spinners"; // Importing a loading spinner
import { db } from "../../Utility/firebase"; // Importing Firebase for storing order data
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook for routing
import { Type } from "../../Utility/action.type"; // Importing action types for the reducer

// Functional component for handling the payment process
function Payment() {
  const [{ basket, user }, dispatch] = useContext(DataContext); // Accessing the basket and user from global state
  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0); // Calculating total items in the basket
  const total = basket?.reduce(
    (amount, item) => item.price * item.amount + amount,
    0
  ); // Calculating the total price of items in the basket

  const [cardError, setCardError] = useState(null); // State to track any card-related errors
  const [processing, setProcessing] = useState(false); // State to track if payment is being processed

  const stripe = useStripe(); // Stripe hook to access Stripe functionality
  const elements = useElements(); // Stripe hook to access the card input elements
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle changes in the card input and set card error messages
  const handleChange = (e) => {
    setCardError(e?.error?.message || ""); // Set card error message if any
  };

  // Function to handle the payment process
  const handlePayment = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (basket.length === 0) {
      setCardError("Your basket is empty."); // If the basket is empty, show an error
      return;
    }

    try {
      setProcessing(true); // Start processing the payment

      // Make a request to the backend to create a payment intent with Stripe
      const response = await axiosInstance({
        method: "POST",
        url: `/payment/create?total=${total * 100}`, // Stripe expects the amount in cents, so multiply by 100
      });

      const clientSecret = response.data?.clientSecret; // Get the client secret from the response

      // Confirm the card payment with Stripe
      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement), // Get the card details from the CardElement
        },
      });

      // Store the order in Firebase Firestore
      await db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .doc(paymentIntent.id)
        .set({
          basket: basket, // Store the basket details
          amount: paymentIntent.amount, // Store the total amount paid
          created: paymentIntent.created, // Store the creation timestamp
        });

      // Clear the basket after successful payment
      dispatch({ type: Type.EMPTY_BASKET });

      setProcessing(false); // Stop processing
      navigate("/orders", { state: { msg: "You have placed a new order" } }); // Navigate to the orders page with a success message
    } catch (error) {
      setCardError(error.message || "Payment failed. Please try again."); // Handle payment errors
      setProcessing(false); // Stop processing if there is an error
    }
  };

  return (
    <LayOut>
      {/* Header displaying the number of items in the basket */}
      <div className={classes.payment__header}>
        Checkout ({totalItem}) items
      </div>

      {/* Payment section */}
      <section className={classes.payment__method__wrapper}>
        {/* Delivery information */}
        <div
          className={`${classes.payment__deliveryInfo} ${classes.payment__flex}`}
        >
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div> {/* User's email */}
            <div>123 React Lane</div> {/* Static delivery address */}
            <div>Ethiopia, IL</div> {/* Static delivery location */}
          </div>
        </div>
        <hr />

        {/* Review items and delivery */}
        <div
          className={`${classes.payment__deliveryItem} ${classes.payment__flex}`}
        >
          <h3>Review items and Delivery</h3>
          <div>
            {/* Display each product in the basket */}
            {basket?.map((item, i) => (
              <ProductCard key={i} product={item} flex={true} titleUp={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* Payment method section */}
        <div className={`${classes.payment__card} ${classes.payment__flex}`}>
          <h3>Payment methods</h3>
          <div className={classes.payment__card_methods}>
            <div className={classes.payment__card_details}>
              {/* Payment form */}
              <form onSubmit={handlePayment}>
                {/* Display card errors if any */}
                {cardError && (
                  <small className={classes.payment__card_error}>
                    {cardError}
                  </small>
                )}

                {/* Stripe CardElement for card details input */}
                <CardElement onChange={handleChange} />
                <div className={classes.payment__price}>
                  <div>
                    <span>
                      Total Order | <CurrencyFormat amount={total} />{" "}
                      {/* Display total price */}
                    </span>
                  </div>
                  {/* Submit button to pay now */}
                  <button type="submit" disabled={processing}>
                    {processing ? (
                      <div className={classes.payment__card_details_loader}>
                        <ClipLoader color="#000" size={12} />
                        <p>Please wait .... </p>
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Payment; // Exporting the component for use in other parts of the application
