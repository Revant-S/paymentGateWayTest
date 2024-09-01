const express = require("express");
const axios = require("axios");
const sha256 = require("sha256")
const URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const merchant_Id = "FromTheenv";
const salt_index = "FromTheenv";
const salt_key = "FromTheenv";

const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});
app.get("/pay", (req, res) => {
  const payUrl = "/pg/v1/pay";
  const merchantTransactionId = "MT7850590068188104"
  const payLoad = {
    "merchantId": merchant_Id,
    "merchantTransactionId": merchantTransactionId,
    "merchantUserId": "MUID123",
    "amount": 100, 
    "redirectUrl" : `http://localhost:3000/redirect-url/${merchantTransactionId}`,
    "redirectMode" : "REDIRECT",
    "mobileNumber": "9284094273",
    "paymentInstrument": {
      "type": "PAY_PAGE"
    }
  }

  const bufferObj = Buffer.from(JSON.stringify(payLoad), "utf-8")
  const base64EncodedPayload = bufferObj.toString("base64") 
  const xVerify = sha256(base64EncodedPayload + payUrl+salt_key) + "###" + salt_index
  const options = {
    method: "post",
    url: `${URL}${payUrl}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY" : xVerify
    },
    data: {
        request : base64EncodedPayload
    },
  };
  try {
    axios
    .request(options)
    .then(function (response) {
 
    console.log(response.data.data);
    res.redirect(response.data.data.instrumentResponse.redirectInfo.url)
    // res.send("ok")
    //   res.send(response.data.data.instrumentResponse.qrData)
    })
    .catch(function (error) {
      console.error(error);
    });
  } catch (error) {
    console.log(error.message);
  }
});
const port = 3000;
app.listen(port, () => {
  console.log(`server running on the port ${port}`);
});
