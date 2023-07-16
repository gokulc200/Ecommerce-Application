const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT;
// const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.post("/pay", async (req, res) => {
//   console.log(req.body.token);
//   await Stripe.charges.create({
//     source: req.body.token.id,
//     amount: req.body.amount,
//     currency: "usd",
//   });
// });

// app.post("/pay", async (req, res) => {
//   const { amount, token } = req.body;

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: 'Bazar Online Shopping',
//             },
//             unit_amount: amount,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: 'http://localhost:8001/success', // Replace with your success URL
//       cancel_url: 'http://localhost:8001/cancel', // Replace with your cancel URL
//     });

//     res.json({ sessionId: session.id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Payment failed");
//   }
// });

app.post("/pay", async (req, res) => {
  

  try {
    const { amount, token } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Bazar Online Shopping",
            },
            unit_amount: amount * 100, // Replace with the actual amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3005/success", // Replace with your success URL
      cancel_url: "http://localhost:8015/cancel", // Replace with your cancel URL
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Payment failed");
  }
});

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
