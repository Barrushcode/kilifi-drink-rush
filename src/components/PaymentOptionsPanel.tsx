
import React from "react";
import MpesaStkPush from "./MpesaStkPush";
import PaystackCheckout from "./PaystackCheckout";
import { CartItem } from "@/contexts/CartContext";

interface PaymentOptionsPanelProps {
  totalAmount: number;
  shippingDetails: any;
  TILL_NUMBER: string;
  handleSimulatePayment: () => void;
  items: CartItem[];
}

const PaymentOptionsPanel: React.FC<PaymentOptionsPanelProps> = ({
  totalAmount,
  shippingDetails,
  TILL_NUMBER,
  handleSimulatePayment,
  items
}) => (
  <div className="w-full max-w-full space-y-4">
    <MpesaStkPush
      amount={totalAmount}
      phone={shippingDetails.phone}
      till={TILL_NUMBER}
      shippingDetails={shippingDetails}
      onPaymentSuccess={handleSimulatePayment}
      items={items}
    />
    <PaystackCheckout
      amount={totalAmount}
      shippingDetails={shippingDetails}
      cartItems={items}
      onValidationRequired={() => true} // No additional validation, as form is validated already
    />
  </div>
);

export default PaymentOptionsPanel;
