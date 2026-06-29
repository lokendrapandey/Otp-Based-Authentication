export function generateOtp() {
    return Math.floor(10000 + Math.random()* 900000).toString();
}


export function getOtpHtml(otp) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>OTP Verification</title>

<style>
  body {
    margin: 0;
    padding: 0;
    background: #f4f6f9;
    font-family: Arial, Helvetica, sans-serif;
  }

  .wrapper {
    width: 100%;
    padding: 30px 15px;
    box-sizing: border-box;
  }

  .container {
    max-width: 600px;
    margin: auto;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  }

  .header {
    background: #2563eb;
    color: #fff;
    text-align: center;
    padding: 30px 20px;
  }

  .header h1 {
    margin: 0;
    font-size: 26px;
  }

  .content {
    padding: 35px 30px;
    color: #444;
    line-height: 1.7;
    font-size: 16px;
  }

  .otp-box {
    margin: 30px auto;
    width: fit-content;
    background: #f1f5ff;
    border: 2px dashed #2563eb;
    color: #2563eb;
    padding: 16px 32px;
    font-size: 34px;
    font-weight: bold;
    letter-spacing: 8px;
    border-radius: 10px;
  }

  .note {
    margin-top: 20px;
    color: #666;
    font-size: 14px;
  }

  .footer {
    background: #f8f9fa;
    text-align: center;
    padding: 20px;
    font-size: 13px;
    color: #888;
  }

  @media only screen and (max-width: 600px) {
    .content {
      padding: 25px 20px;
    }

    .otp-box {
      font-size: 28px;
      padding: 14px 20px;
      letter-spacing: 5px;
    }

    .header h1 {
      font-size: 22px;
    }
  }
</style>
</head>

<body>
  <div class="wrapper">
    <div class="container">

      <div class="header">
        <h1>Email Verification</h1>
      </div>

      <div class="content">
        <p>Hello,</p>

        <p>
          Your One-Time Password (OTP) for verifying your email address is:
        </p>

        <div class="otp-box">${otp}</div>

        <p>
          This OTP is valid for <strong>10 minutes</strong>.
          Please do not share this code with anyone.
        </p>

        <p class="note">
          If you didn't request this verification, you can safely ignore this email.
        </p>

        <p>
          Regards,<br>
          <strong>Your Team</strong>
        </p>
      </div>


    </div>
  </div>
</body>
</html>
`;
}


