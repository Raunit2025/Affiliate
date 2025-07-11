import { useSelector } from "react-redux";
import PurchaseCredit from "./PurchaseCredit";
import Subscription from "./Subscription";

function ManagePayments() {
  const userDetails = useSelector((state) => state.userDetails);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {userDetails.subscription?.status === "active" ? (
        <Subscription />
      ) : (
        <PurchaseCredit />
      )}
    </div>
  );
}

export default ManagePayments;
