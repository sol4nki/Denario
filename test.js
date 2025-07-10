import { db } from "./firebaseconfig.js";
import { collection, getDocs } from "firebase/firestore";
import { loadWalletAddress } from "./storage.js"; 
async function fetchLoginHistory(walletAddress) {
  const loginRef = collection(db, "wallets", walletAddress, "loginHistory");

  try {
    const snapshot = await getDocs(loginRef);
    const loginData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Login History:", loginData);
    return loginData;
  } catch (error) {
    console.error("Error fetching login history:", error);
    return [];
  }
}

async function fetchTransactionHistory(walletAddress) {
  const txRef = collection(db, "wallets", walletAddress, "transactionHistory");

  try {
    const snapshot = await getDocs(txRef);
    const txData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Transaction History:", txData);
    return txData;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return [];
  }
}

async function main() {
  const walletAddress = await loadWalletAddress();  
  if (!walletAddress) {
    console.error("No wallet address found in secure storage.");
    return;
  }

  await fetchLoginHistory(walletAddress);
  await fetchTransactionHistory(walletAddress);
}

main();
