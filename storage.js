import * as SecureStore from 'expo-secure-store';

export async function saveWalletAddress(address) {
  try {
    await SecureStore.setItemAsync('walletAddress', address);
  } catch (error) {
    console.error("Error saving wallet address", error);
  }
}

export async function loadWalletAddress() {
  try {
    const address = await SecureStore.getItemAsync('walletAddress');
    return address;
  } catch (error) {
    console.error("Error loading wallet address", error);
    return null;
  }
}

export async function savePvtKey(pvtKey) {
  try {
    await SecureStore.setItemAsync('pvtKey', pvtKey);
  } catch (error) {
    console.error("Error saving private key", error);
  }
}

export async function loadPvtKey() {
  try {
    const pvtKey = await SecureStore.getItemAsync('pvtKey');
    return pvtKey;
  } catch (error) {
    console.error("Error loading private key", error);
    return null;
  }
}
