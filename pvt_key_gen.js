import { HDNodeWallet } from "ethers";
import * as bip39 from "bip39";

/**
 * Converts a BIP39 mnemonic to a private key
 * @param {string} mnemonic - 12-word recovery phrase
 * @param {string} path - derivation path (default m/44'/60'/0'/0/0)
 * @returns {string} private key (0x...)
 * @throws if the mnemonic is invalid
 */
export function getPrivateKeyFromMnemonic(mnemonic, path = "m/44'/60'/0'/0/0") {
  if (!bip39.validateMnemonic(mnemonic)) {
    
    throw new Error("Invalid recovery phrase. Please enter a valid 12-word BIP39 mnemonic.");
  }

  try {
    const wallet = HDNodeWallet.fromPhrase(mnemonic, path);
    return wallet.privateKey;
  } catch (error) {
    console.error("Error generating wallet from phrase:", error);
    throw new Error("Failed to generate wallet from mnemonic.");
  }
}


