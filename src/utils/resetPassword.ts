import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";
import transporter from "./mail";
import { setCache } from "./cache";
const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("Redis client error", err);
});

redisClient.connect();

export default async function sendResetPasswordEmail(email: string) {
  try {
    const resetPasswordToken = uuidv4();
    const resetPassUrl = `${process.env.BASE_URL}/reset-password?token=${resetPasswordToken}`;
    await setCache(resetPasswordToken, email, 60 * 60); // Token expires in 1 hour
    await send(email, resetPassUrl);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw new Error("Failed to send reset password email");
  }
}

async function send(email: string, resetPassUrl: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "My-Mart: Reset Password Request",
    html: `<h1> My-Mart </h1>
           <p>Click the link below to reset your password:</p>
           <a href="${resetPassUrl}">Reset Password</a>
           <p> ${resetPassUrl}</p>`,
  };

  await transporter.sendMail(mailOptions);
  console.log("reset password request email sent to:", email);
}
