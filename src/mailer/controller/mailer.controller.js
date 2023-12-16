import nodemailer from "nodemailer";
import __dirname from "../../dirname.js";
import dotenv from "dotenv";
dotenv.config();

const Suscriptionhtml = `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <style>
      * {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin: 0;
        padding: 0;
      }
      body {
        background-color: #fff;
        color: #000;
        font-size: 16px;
        line-height: 1.5;
        text-align: center;
      }
      header {
        background-color: #fff;
        color: #000;
        padding: 20px;
        text-align: center;
      }
      h1 {
        font-size: 36px;
        margin-bottom: 20px;
      }
      p {
        font-size: 20px;
        margin-bottom: 20px;
      }
      .logo {
        display: block;
        margin: 0 auto;
        width: 100px;
        height: 100px;
        background-image: url('');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      footer {
        background-color: #fff;
        color: #000;
        padding: 20px;
        text-align: center;
      }
      a {
        color: #ff0000;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Welcome to Fragances Shop</h1>
    </header>
    <div class="container">
    <p>
      Thanks to register in Fragances Shop! We hope to see you soon!
    </p>
    </div>
  </body>`;

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendSuscriptionMail = async (email) => {
  await transport.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Fragances Shop",
    html: Suscriptionhtml,
    attachments: [
      {
        filename: "fragances.jpg",
        path: __dirname + "/public/images/fragances.jpg",
        cid: "fragances",
      },
    ],
  });
};
