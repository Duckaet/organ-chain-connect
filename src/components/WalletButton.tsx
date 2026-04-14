import { useWallet } from "@/context/WalletContext";
import { Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WalletButton() {
  const { walletAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();

  if (walletAddress) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-md">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </span>
        <Button variant="ghost" size="icon" onClick={disconnectWallet} className="h-8 w-8">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={connectWallet} disabled={isConnecting} className="gap-2">
      <Wallet className="w-4 h-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
