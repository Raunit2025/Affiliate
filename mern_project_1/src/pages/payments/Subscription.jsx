import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { serverEndpoint } from "../../config/config";

function formatDate(isoDateString) {
  if (!isoDateString) return "";

  try {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Invalid date:", isoDateString);
    return "";
  }
}

function Subscription() {
  const userDetails = useSelector((state) => state.userDetails);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const subscription = userDetails.subscription;

  const handleCancel = async () => {
    try {
      await axios.post(
        `${serverEndpoint}/payments/cancel-subscription`,
        {
          subscription_id: subscription?.id,
        },
        { withCredentials: true }
      );

      setMessage(
        "Subscription cancelled. It may take up to 5 minutes to reflect the status."
      );
    } catch (error) {
      console.log(error);
      setErrors({ message: "Unable to cancel subscription" });
    }
  };

  return (
    <div className="py-10 px-4 max-w-2xl mx-auto">
      {errors.message && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.message}
        </div>
      )}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4">Subscription Summary</h3>
        <hr className="mb-4" />

        <div className="space-y-3 text-gray-800">
          <p>
            <strong>Start Date:</strong> {formatDate(subscription.start)}
          </p>
          <p>
            <strong>End Date:</strong> {formatDate(subscription.end)}
          </p>
          <p>
            <strong>Last Payment Date:</strong>{" "}
            {formatDate(subscription.lastBillDate)}
          </p>
          <p>
            <strong>Next Payment Date:</strong>{" "}
            {formatDate(subscription.nextBillDate)}
          </p>
          <p>
            <strong>Total Payments Made:</strong> {subscription.paymentsMade}
          </p>
          <p>
            <strong>Payments Remaining:</strong>{" "}
            {subscription.paymentsRemaining}
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
            onClick={handleCancel}
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
