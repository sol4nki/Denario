import axios from "axios";
import { db } from "./firebaseconfig.js";
import { collection, addDoc } from "firebase/firestore";
import { Platform } from "react-native";

const axiosInstance = axios.create();
async function getPublicIP() {
  try {
    const res = await axiosInstance.get("https://api.ipify.org?format=json");
    return res.data.ip;
  } catch (err) {
    console.error("Failed to fetch IP:", err.message);
    return "Unknown";
  }
}

async function getLocationFromIP(ip) {
  try {
    if (ip === "Unknown") return null;

    const res = await axiosInstance.get(`https://ipapi.co/${ip}/json/`);
    return {
      city: res.data.city || null,
      region: res.data.region || null,
      country: res.data.country_name || null,
      org: res.data.org || null,
    };
  } catch (err) {
    console.error("Failed to fetch location:", err.message);
    return null;
  }
}

function getDeviceInfo() {
  return {
    os: Platform.OS,
    platformVersion: Platform.Version,
  };
}

/**
 * Logs a user login event to Firestore under "loginHistory"
 * @param {string} walletAddress - The user's wallet address
 */
export async function logUserLogin(walletAddress) {
  const now = new Date();
  const ip = await getPublicIP();
  const location = await getLocationFromIP(ip);

  const loginData = {
    timestamp: now.toISOString(),
    ipAddress: ip,
    walletAddress: walletAddress,
    deviceInfo: getDeviceInfo(),
    location: location,
    event: "User Login",
  };

  try {
    await addDoc(
      collection(db, "wallets", walletAddress, "loginHistory"),
      loginData
    );
    console.log("Login data saved to Firestore.");
  } catch (err) {
    console.error("Error saving login data:", err);
  }
}
