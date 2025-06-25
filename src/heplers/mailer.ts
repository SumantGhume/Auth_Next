import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

type EmailType = "VERIFY" | "RESET";

interface SendEmailProps {
  email: string;
  emailType: EmailType;
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailProps) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    const updateFields =
      emailType === "VERIFY"
        ? {
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 3600000, // 1 hour
          }
        : {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 3600000,
          };

    await User.findByIdAndUpdate(userId, updateFields);

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "a282d582e398d1",
        pass: "17bf0ada343f15",
      },
    });

    const link = `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`;

    const mailOptions = {
      from: "sumantgh@gmail.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${link}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } or copy and paste the link below in your browser:<br> ${link}</p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Email sending error:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error while sending email");
  }
};
