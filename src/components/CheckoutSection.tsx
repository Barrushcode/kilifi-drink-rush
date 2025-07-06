import React from 'react';
import { useCart } from '@/contexts/CartContext';
import ShippingInfoForm from './ShippingInfoForm';
import ZapierWebhookInput from './ZapierWebhookInput';
import OrderSummaryCard from './OrderSummaryCard';
import PaymentOptionsPanel from './PaymentOptionsPanel';
import AlternativePaymentInfo from './AlternativePaymentInfo';
import { useCheckout } from '@/hooks/useCheckout';

const DELIVERY_ZONES = [{
  name: 'Mnarani',
  value: 'mnarani',
  fee: 150
}, {
  name: 'Bofa',
  value: 'bofa',
  fee: 200
}, {
  name: 'Mtondia',
  value: 'mtondia',
  fee: 250
}, {
  name: 'CBD',
  value: 'cbd',
  fee: 100
}, {
  name: 'Old Ferry',
  value: 'old_ferry',
  fee: 100
}];
const TILL_NUMBER = '5950470';

const CheckoutSection: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalAmount,
    getTotalItems
  } = useCart();

  // Use refactored checkout logic hook
  const {
    shippingDetails,
    errors,
    zapierWebhookUrl,
    setZapierWebhookUrl,
    selectedZone,
    selectedRiders,
    selectedDistributor,
    handleInputChange,
    handleZoneChange,
    handleRidersChange,
    handleDistributorChange,
    zoneObject,
    subtotal,
    deliveryFee,
    totalAmount,
    handleSimulatePayment
  } = useCheckout(DELIVERY_ZONES, items, getTotalAmount);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-barrush-midnight py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-rose-300">Your Cart is Empty</h1>
          <p className="text-white mb-6">Add some products to your cart to continue</p>
          <button onClick={() => window.location.href = '/products'} className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded font-semibold">Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-barrush-midnight py-12 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neon-pink mb-4 text-zinc-50">
            Checkout
          </h1>
          <p className="text-xl text-white">
            Complete your order securely
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 max-w-none">
          {/* Order Summary */}
          <div className="w-full max-w-full">
            <OrderSummaryCard
              items={items}
              getTotalItems={getTotalItems}
              getTotalAmount={getTotalAmount}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              zoneObject={zoneObject}
              deliveryFee={deliveryFee}
              subtotal={subtotal}
              totalAmount={totalAmount}
            />
          </div>
          {/* Right Column - Forms and Payment */}
          <div className="space-y-6 w-full max-w-full">
            <ShippingInfoForm
              shippingDetails={shippingDetails}
              errors={errors}
              deliveryZones={DELIVERY_ZONES}
              selectedZone={selectedZone}
              selectedRiders={selectedRiders}
              selectedDistributor={selectedDistributor}
              handleInputChange={handleInputChange}
              handleZoneChange={handleZoneChange}
              handleRidersChange={handleRidersChange}
              handleDistributorChange={handleDistributorChange}
            />
            <ZapierWebhookInput
              zapierWebhookUrl={zapierWebhookUrl}
              setZapierWebhookUrl={setZapierWebhookUrl}
            />
            <PaymentOptionsPanel
              totalAmount={totalAmount}
              shippingDetails={shippingDetails}
              TILL_NUMBER={TILL_NUMBER}
              handleSimulatePayment={handleSimulatePayment}
              items={items}
              deliveryZone={zoneObject}
            />
            <AlternativePaymentInfo totalAmount={totalAmount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSection;
