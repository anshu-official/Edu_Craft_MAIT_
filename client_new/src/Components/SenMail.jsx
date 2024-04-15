import { useState } from "react";
import Axios from "axios";

function SendMail() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMail = async () => {
    setLoading(true);
    try {
      const response = await Axios.post(
        "http://localhost:5000/sendMail",
        to,
        subject,
        message
      );

      setResponseMessage(response.data.message);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Send Email</h1>
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To"
          className="w-full mb-4 p-2 border text-black border-gray-400 rounded"
        />
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full mb-4 p-2 border text-black border-gray-400 rounded"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="w-full h-32 mb-4 p-2 text-black border border-gray-400 rounded"
        />
        <button
          onClick={sendMail}
          disabled={loading}
          className={`w-full py-2 text-white  rounded ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
        {responseMessage && (
          <p className="mt-4 text-green-500">{responseMessage}</p>
        )}
      </div>
    </div>
  );
}

export default SendMail;
