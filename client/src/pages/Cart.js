import React, { useEffect, useState } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
// import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';

const Cart = () => {
  const productData = useSelector((state) => state.bazar.productData);
  const userInfo = useSelector((state) => state.bazar.userInfo);
  const [payNow, setPayNow] = useState(false);
  const [totalAmt, setTotalAmt] = useState("");
  useEffect(() => {
    let price = 0;
    productData.map((item) => {
      price += item.price * item.quantity;
      return price;
    });
    setTotalAmt(price.toFixed(2));
  }, [productData]);

  const handleCheckout = () => {
    if (userInfo) {
      setPayNow(true);
    } else {
      toast.error("Please sign in to Checkout");
    }
  };
  // const payment = async (token) => {
  //   await axios.post("http://localhost:8001/pay", {
  //     amount: totalAmt * 100,
  //     token: token,
  //   });
  // };

  const stripePromise = loadStripe('pk_test_51NOKzXSGA5VATo8KS9U3k4Qy4PdYDrgRWkRgjaBQkJMaOupqDkkA8wYLPQrpK0RV1V5BCx0uqJAotRCwwSv3adwk00nwJq35Qw'); // Replace with your Stripe publishable key

  // const payment = async (token) => {
  //   const stripe = await stripePromise;
  //   const response = await fetch("http://localhost:8001/pay", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       amount: totalAmt * 100,
  //       token: token.id,
  //     }),
  //   });

  //   const data = await response.json();
  //   await stripe.redirectToCheckout({ sessionId: data.sessionId });
  // };

  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    };

    initializeStripe();
  }, []);

  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:8008/pay", {
        amount: totalAmt, // Pass the total amount in dollars
      });
      const session = response.data;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        console.error(error);
        // Handle error
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <div>
      <img
        className="w-full h-60 object-cover"
        src="https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="cartImg"
      />
      {productData.length > 0 ? (
        <div className="max-w-screen-xl mx-auto py-20 flex flex-col md:flex-row">
          <CartItem />
          <div className="w-full md:w-1/3 bg-[#fafafa] py-6 px-4">
            <div className=" flex flex-col gap-6 border-b-[1px] border-b-gray-400 pb-6">
              <h2 className="text-2xl font-medium ">Cart Totals</h2>
              <p className="flex items-center gap-4 text-base">
                Subtotal{" "}
                <span className="font-titleFont font-bold text-lg">
                  ${totalAmt}
                </span>
              </p>
              <p className="flex items-start gap-4 text-base">
                Shipping{" "}
                <span>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Quos, veritatis.
                </span>
              </p>
            </div>
            <p className="font-titleFont font-semibold flex justify-between mt-6">
              Total <span className="text-xl font-bold">${totalAmt}</span>
            </p>
            <button
              onClick={handleCheckout}
              className="text-base bg-black text-white w-full py-3 mt-6 hover:bg-gray-800 duration-300"
            >
              proceed to checkout
            </button>
            {payNow && (
              <div className="w-full mt-6 flex items-center justify-center">
                {/* <StripeCheckout
                  stripeKey="pk_test_51NOKzXSGA5VATo8KS9U3k4Qy4PdYDrgRWkRgjaBQkJMaOupqDkkA8wYLPQrpK0RV1V5BCx0uqJAotRCwwSv3adwk00nwJq35Qw"
                  name="Bazar Online Shopping"
                  amount={totalAmt * 100}
                  label="Pay to bazar"
                  description={`Your Payment amount is $${totalAmt}`}
                  token={payment}
                  email={userInfo.email}
                /> */}
                {/* <StripeCheckout
                  stripeKey="pk_test_51NOKzXSGA5VATo8KS9U3k4Qy4PdYDrgRWkRgjaBQkJMaOupqDkkA8wYLPQrpK0RV1V5BCx0uqJAotRCwwSv3adwk00nwJq35Qw"
                  name="Bazar Online Shopping"
                  amount={totalAmt * 100}
                  label="Pay to bazar"
                  description={`Your Payment amount is $${totalAmt}`}
                  token={payment}
                  email={userInfo.email}
                /> */}
                <button onClick={handlePayment}>Pay with Stripe</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-screen-xl mx-auto py-10 flex flex-col items-center gap-2 justify-center">
          <p className="text-xl text-orange-600 font-titleFont font-semibold">
            Your Cart is Empty. Please go back to Shopping and add products to
            Cart.
          </p>
          <Link to="/">
            <button className="flex items-center gap-1 text-gray-400 hover:text-black duration-300">
              <span>
                <HiOutlineArrowLeft />
              </span>
              go shopping
            </button>
          </Link>
        </div>
      )}
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Cart;
