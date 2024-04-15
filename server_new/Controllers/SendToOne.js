const { transporter } = require("../config/transporter");

exports.SendToOne = async (req, res) => {
  try {
    const { to, subject, message } = req.body.formData;
    const mailOptions = {
      from: "Edu Craft",
      to: "abhinavbld2003@gmail.com",
      subject: "Assignment Form Edu Craft",
      text: "This is a test email sent by Edu Craft Team-> Anshu Abhinav Akshat and Amit",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    return res.json({
      sucess: true,
      message: "Email Sent Succesfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
