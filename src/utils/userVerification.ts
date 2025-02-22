import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";
import transporter from "./mail";
import { setCache } from "./cache";
const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("Redis client error", err);
});

redisClient.connect();

export default async function sendVerificationEmail(userInfo) {
  try {
    const verificationToken = uuidv4();
    const verificationUrl = `${process.env.BASE_URL}/api/v1/complete-signup?token=${verificationToken}`;
    await setCache(verificationToken, JSON.stringify(userInfo), 60 * 60); // Token expires in 1 hour
    await send(userInfo.email, verificationUrl);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

async function send(userEmail: string, verificationUrl: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "My-Mart: Verify Your Email",
    html: `<h1> My-Mart </h1>
           <p>Click the link below to verify your email:</p>
           <a href="${verificationUrl}">Verify Email</a>
           <p> ${verificationUrl}</p>`,
  };

  await transporter.sendMail(mailOptions);
  console.log("Verification email sent to:", userEmail);
}
