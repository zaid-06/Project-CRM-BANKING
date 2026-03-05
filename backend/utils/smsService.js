const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

let twilioClient = null;
if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
}

// Normalize Indian mobile numbers to E.164 (+91XXXXXXXXXX)
const normalizePhone = (raw) => {
  if (!raw) return raw;

  // Remove spaces, hyphens, parentheses
  let phone = String(raw).replace(/[^\d+]/g, "");

  // If already starts with +, assume it's correct E.164
  if (phone.startsWith("+")) {
    return phone;
  }

  // Remove leading 0 if present (e.g., 0933...)
  if (phone.startsWith("0")) {
    phone = phone.slice(1);
  }

  // If it's 10 digits, assume Indian mobile and prefix +91
  if (/^\d{10}$/.test(phone)) {
    return `+91${phone}`;
  }

  // Fallback: prefix + if missing (may still fail if invalid)
  if (!phone.startsWith("+")) {
    phone = `+${phone}`;
  }

  return phone;
};

const sendOtpSms = async (phone, otp) => {
  if (!twilioClient || !fromNumber) {
    console.error(
      "Twilio configuration missing. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER."
    );
    throw new Error("SMS configuration missing");
  }

  const to = normalizePhone(phone);

  await twilioClient.messages.create({
    body: `Your BankFinance CRM login OTP is ${otp}`,
    from: fromNumber,
    to,
  });
};

module.exports = {
  sendOtpSms,
};



