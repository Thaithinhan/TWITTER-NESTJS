import "./VerifyComponent.css";

import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

const VerifyAccount = () => {
  const [amount, setAmount] = useState(100000);
  const [verificationType, setVerificationType] = useState("monthly");
  const [isVerify, setIsVerify] = useState(false);

  useEffect(() => {
    if (verificationType === "monthly") {
      setAmount(100000);
    } else if (verificationType === "permanent") {
      setAmount(1000000);
    }
  }, [verificationType]);

  // const checkVerificationStatus = async () => {
  //   try {
  //     const response = await dispatch(checkVerifyUser(userLogin._id));
  //     setIsVerify(response.payload?.isVerified);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  useEffect(() => {}, []);

  const handleSelectChange = (event: any) => {
    setVerificationType(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // try {
    //   const newOrder = {
    //     amount: amount,
    //     verificationType: verificationType,
    //   };

    //   // console.log(newOrder);
    //   const response = await dispatch(buyVerifyUser(newOrder)).unwrap();
    //   console.log(response);
    //   setIsVerify(true);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <div className="verify-account">
      <h2 className="text-2xl font-bold text-center">Verify your account</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="me-1">Your Name: </Form.Label>
          <Form.Control
            type="Text"
            placeholder="Verify your name"
            // value={amount}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="me-1">Your Email: </Form.Label>
          <Form.Control
            type="Text"
            placeholder="Verify your email address"
            // value={amount}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="me-1">Amount to pay: </Form.Label>
          <Form.Control
            type="number"
            value={amount}
            name="amount"
            readOnly // Prevent user from changing the amount manually
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="me-1">Type of verify: </Form.Label>
          <Form.Select
            onChange={handleSelectChange}
            value={verificationType}
            name="verificationType"
          >
            <option value="monthly">Monthly - 100.000VND</option>
            <option value="permanent">Forever - 1.000.000VND</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isVerify}>
          {isVerify ? "Already Verified" : "Verify Confirm"}
        </Button>
      </Form>
    </div>
  );
};

export default VerifyAccount;
