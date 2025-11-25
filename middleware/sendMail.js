import { createTransport } from "nodemailer";

const transport = createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", 
  auth: {
    user: process.env.Gmail,
    pass: process.env.Password,
  },
});

const sendMail = async (email, subject, otp) => {
  if (process.env.NODE_ENV === "development" && process.env.DISABLE_MAIL === "true") {
    console.log(`[MAIL DEV] Would send mail to ${email} with OTP ${otp}`);
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .container {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h1 {
      color: red;
    }
    p {
      margin-bottom: 20px;
      color: #666;
    }
    .otp {
      font-size: 36px;
      color: #7b68ee;
      margin-bottom: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>OTP Verification</h1>
    <p>Hello ${email} your (One-Time Password) for your account verification is.</p>
    <p class="otp">${otp}</p> 
  </div>
</body>
</html>`;

  try {
    const info = await transport.sendMail({
      from: process.env.Gmail,
      to: email,
      subject,
      html,
    });
    console.log("Mail sent:", info.messageId);
  } catch (err) {
    console.error("Error sending mail:", err);
  }
};

export default sendMail;
