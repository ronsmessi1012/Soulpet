import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Loader,
  Unlock,
  Copy,
  DollarSign
} from 'lucide-react';
import { algorandService, AlgorandWallet } from '../services/algorandService';

interface AlgorandWalletConnectProps {
  onWalletConnect?: (wallet: AlgorandWallet) => void;
  onWalletDisconnect?: () => void;
  className?: string;
}

const AlgorandWalletConnect: React.FC<AlgorandWalletConnectProps> = ({
  onWalletConnect,
  onWalletDisconnect,
  className = ''
}) => {
  const [connectedWallet, setConnectedWallet] = useState<AlgorandWallet | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [networkInfo, setNetworkInfo] = useState({ network: '', explorer: '' });
  const [algoPrice, setAlgoPrice] = useState(0.25);

  useEffect(() => {
    // Initialize
    setNetworkInfo(algorandService.getNetworkInfo());
    loadAlgoPrice();
    
    // Check for existing connection
    const existingWallet = algorandService.getConnectedWallet();
    if (existingWallet) {
      setConnectedWallet(existingWallet);
      onWalletConnect?.(existingWallet);
    }
  }, [onWalletConnect]);

  const loadAlgoPrice = async () => {
    try {
      const price = await algorandService.getAlgoPrice();
      setAlgoPrice(price);
    } catch (error) {
      console.error('Failed to load ALGO price:', error);
    }
  };

  const handleConnect = async (walletType: 'pera' | 'defly') => {
    setConnecting(true);
    try {
      const wallet = await algorandService.connectWallet(walletType);
      setConnectedWallet(wallet);
      onWalletConnect?.(wallet);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert(`Failed to connect ${walletType} wallet. Please ensure the wallet is installed and try again.`);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    algorandService.disconnectWallet();
    setConnectedWallet(null);
    onWalletDisconnect?.();
  };

  const copyAddress = () => {
    if (connectedWallet) {
      navigator.clipboard.writeText(connectedWallet.address);
      alert('Address copied to clipboard!');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  if (connectedWallet) {
    return (
      <div className={`backdrop-blur-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-white/30 rounded-3xl shadow-2xl p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-800 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-600" />
                Wallet Connected
              </div>
              <div className="text-gray-600 flex items-center">
                <button 
                  onClick={copyAddress}
                  className="hover:text-blue-600 transition-colors duration-300 flex items-center"
                  title="Click to copy address"
                >
                  {formatAddress(connectedWallet.address)}
                  <Copy className="h-3 w-3 ml-1" />
                </button>
              </div>
              <div className="text-sm text-gray-500 flex items-center space-x-4">
                <span className="flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  {networkInfo.network}
                </span>
                <span className="flex items-center font-bold text-green-600">
                  {connectedWallet.balance.toFixed(2)} ALGO
                </span>
                <span className="text-xs text-gray-400">
                  ≈ ${(connectedWallet.balance * algoPrice).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <a
              href={`${networkInfo.explorer}/address/${connectedWallet.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors duration-300"
              title="View on Algorand Explorer"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
            <button
              onClick={handleDisconnect}
              className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors duration-300"
              title="Disconnect Wallet"
            >
              <Unlock className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`backdrop-blur-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-white/30 rounded-3xl shadow-2xl p-8 ${className}`}>
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Algorand Wallet</h3>
        <p className="text-gray-600 mb-8">
          Connect your wallet to buy, sell, and manage your pet NFTs on the Algorand blockchain
        </p>

        {/* Algorand Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/60 p-4 rounded-2xl border border-white/40">
            <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <div className="font-bold text-gray-800">4.5s Finality</div>
            <div className="text-xs text-gray-600">Instant transactions</div>
          </div>
          <div className="bg-white/60 p-4 rounded-2xl border border-white/40">
            <DollarSign className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="font-bold text-gray-800">0.001 ALGO</div>
            <div className="text-xs text-gray-600">Low fees</div>
          </div>
          <div className="bg-white/60 p-4 rounded-2xl border border-white/40">
            <Shield className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="font-bold text-gray-800">Pure PoS</div>
            <div className="text-xs text-gray-600">Secure & green</div>
          </div>
        </div>

        {/* Wallet Options */}
        <div className="space-y-4">
          <button
            onClick={() => handleConnect('pera')}
            disabled={connecting}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
          >
            {connecting ? (
              <Loader className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Wallet className="h-5 w-5 mr-2" />
            )}
            Connect Pera Wallet
          </button>
          
          <button
            onClick={() => handleConnect('defly')}
            disabled={connecting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
          >
            {connecting ? (
              <Loader className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Wallet className="h-5 w-5 mr-2" />
            )}
            Connect Defly Wallet
          </button>
        </div>

        {/* Network Info */}
        <div className="mt-6 p-4 bg-white/40 rounded-2xl border border-white/30">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Globe className="h-4 w-4 mr-2" />
            Connected to Algorand {networkInfo.network}
            <a
              href={networkInfo.explorer}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="font-bold text-yellow-800">Secure Connection</span>
          </div>
          <p className="text-yellow-700 text-sm">
            Your wallet connection is secured by Algorand's blockchain technology. 
            We never store your private keys or have access to your funds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlgorandWalletConnect;