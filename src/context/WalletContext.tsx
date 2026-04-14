import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { BrowserProvider, JsonRpcProvider, Contract, type Eip1193Provider } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, RPC_URL } from "@/config/contract";

interface WalletContextType {
  walletAddress: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getContract: () => Promise<Contract | null>;
  getReadOnlyContract: () => Contract;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) return;
    setIsConnecting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
  }, []);

  const getContract = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) return null;
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    } catch {
      return null;
    }
  }, []);

  const getReadOnlyContract = useCallback(() => {
    const provider = new JsonRpcProvider(RPC_URL);
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }, []);

  return (
    <WalletContext.Provider value={{ walletAddress, isConnecting, connectWallet, disconnectWallet, getContract, getReadOnlyContract }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
