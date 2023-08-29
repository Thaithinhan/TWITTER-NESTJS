import "./VerifyAccount.css";

import React, { useState } from "react";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

function VerifyAccount() {
  const [isPaid, setIsPaid] = useState(false);

  const createOrder = async () => {
    // Gọi API từ phía server để tạo đơn hàng và lấy thông tin đơn hàng từ PayPal API
    const response = await fetch("/api/paypal/create-order");
    const order = await response.json();

    return order.id;
  };

  const onApprove = (data: any, actions: any) => {
    // Thực hiện xử lý sau khi thanh toán thành công
    setIsPaid(true);

    // Gọi API từ phía server để xác nhận đơn hàng
    // Ví dụ: gửi thông tin đơn hàng và ID giao dịch cho server
  };

  return (
    <div className="App">
      <h1>PayPal Payment Example</h1>
      <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
        <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
      </PayPalScriptProvider>
      {isPaid && <p>Payment successful!</p>}
    </div>
  );
}

export default VerifyAccount;
