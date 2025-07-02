
export const submitOrderToFormSubmit = async (shippingDetails: any, items: any[], totalAmount: number, deliveryZone: any) => {
  try {
    const formData = new FormData();
    
    // FormSubmit configuration
    formData.append('_captcha', 'false');
    formData.append('_next', 'https://lovable.page/thank-you');
    formData.append('_subject', 'New Checkout Form Submission - Barrush Delivery');
    formData.append('_template', 'table');
    
    // Add order summary
    formData.append('orderSummary', 'Checkout form submission');
    
    // Add shipping details
    formData.append('firstName', shippingDetails.firstName);
    formData.append('lastName', shippingDetails.lastName);
    formData.append('phone', shippingDetails.phone);
    formData.append('email', shippingDetails.email);
    formData.append('street', shippingDetails.street);
    formData.append('building', shippingDetails.building);
    formData.append('area', shippingDetails.area);
    formData.append('city', shippingDetails.city);
    formData.append('instructions', shippingDetails.instructions);
    
    // Add delivery zone details
    formData.append('deliveryZone', deliveryZone?.name || '');
    formData.append('deliveryZoneName', deliveryZone?.name || '');
    formData.append('deliveryZoneFee', deliveryZone?.fee?.toString() || '0');
    
    // Add total amount
    formData.append('totalAmount', totalAmount.toString());
    
    // Add items as a formatted string
    const itemsString = items.map(item => 
      `${item.name} (${item.size}) - Qty: ${item.quantity} - ${item.priceFormatted}`
    ).join(', ');
    formData.append('items', itemsString);
    
    // Submit to FormSubmit
    await fetch('https://formsubmit.co/barrushdelivery@gmail.com', {
      method: 'POST',
      body: formData
    });
    
    console.log('Order details submitted to FormSubmit successfully');
  } catch (error) {
    console.error('Failed to submit to FormSubmit:', error);
  }
};
