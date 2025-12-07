import { create } from 'zustand';

type NeoLineInvokeArg = {
  type: string;
  value: unknown;
};

interface NeoLineInvokeParameters {
  scriptHash: string;
  operation: string;
  args?: NeoLineInvokeArg[];
  signers?: Array<{ account: string; scopes: number }>;
  broadcastOverride?: boolean;
}

interface NeoLineAccountResponse {
  address: string;
  label?: string;
}

interface NeoLineBalanceResponse {
  address: string;
  balances: Array<{ contract: string; symbol: string; amount: string }>;
}

interface NeoLineN3Provider {
  getProvider(): Promise<{ protocol: string; chainId: number }>;
  getAccount(): Promise<NeoLineAccountResponse>;
  getBalance(params: { address: string; contracts?: string[] }): Promise<NeoLineBalanceResponse>;
  invoke(params: NeoLineInvokeParameters): Promise<{ txid: string }>;
  invokeFunction(params: NeoLineInvokeParameters): Promise<{ txid?: string; script: string }>;
  send(params: { fromAddress: string; toAddress: string; asset: string; amount: string }): Promise<{ txid: string }>;
}

type NeoLineConstructor = {
  Init: new () => NeoLineN3Provider;
};

declare global {
  interface Window {
    NEOLineN3?: NeoLineConstructor;
    NEOLine?: NeoLineConstructor;
  }
}

interface WalletAccount {
  address: string;
  label?: string;
}

interface WalletState {
  account: WalletAccount | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<string>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  transferGas: (toAddress: string, amount: string | number) => Promise<string>;
  invokeContract: (params: NeoLineInvokeParameters) => Promise<string>;
  isNeoLineAvailable: boolean;
  refreshAvailability: () => boolean;
}

let cachedProvider: NeoLineN3Provider | null = null;

const resolveNeoLineConstructor = (): NeoLineConstructor | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  if (window.NEOLineN3) {
    return window.NEOLineN3;
  }
  if (window.NEOLine) {
    return window.NEOLine;
  }
  return null;
};

const getProvider = (): NeoLineN3Provider => {
  if (cachedProvider) {
    return cachedProvider;
  }
  const ctor = resolveNeoLineConstructor();
  if (!ctor) {
    throw new Error('NeoLine dAPI not detected. Please install or enable the NeoLine browser extension.');
  }
  const provider = new ctor.Init();
  cachedProvider = provider;
  return provider;
};

const useWalletStore = create<WalletState>((set, get) => ({
  account: null,
  isConnecting: false,
  error: null,
  isNeoLineAvailable: typeof window !== 'undefined' && Boolean(window.NEOLineN3 || window.NEOLine),
  refreshAvailability: () => {
    const available = Boolean(resolveNeoLineConstructor());
    set({ isNeoLineAvailable: available });
    return available;
  },
  connect: async () => {
    set({ isConnecting: true });
    try {
      const provider = getProvider();
      await provider.getProvider();
      const result = await provider.getAccount();
      set({ account: { address: result.address, label: result.label }, error: null });
      return result.address;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      set({ error: message });
      throw err;
    } finally {
      set({ isConnecting: false });
    }
  },
  disconnect: () => set({ account: null, error: null }),
  signMessage: async (message: string) => {
    const provider = getProvider();
    if (!(provider as any).signMessage) {
      throw new Error('signMessage is not available in the current NeoLine version');
    }
    const response = await (provider as any).signMessage({ message });
    return response.signature as string;
  },
  transferGas: async (toAddress: string, amount: string | number) => {
    const { account } = get();
    if (!account) {
      throw new Error('Connect wallet before transferring GAS');
    }
    const provider = getProvider();
    const response = await provider.send({
      fromAddress: account.address,
      toAddress,
      asset: 'GAS',
      amount: typeof amount === 'number' ? amount.toString() : amount,
    });
    return response.txid;
  },
  invokeContract: async (params: NeoLineInvokeParameters) => {
    const { account } = get();
    if (!account) {
      throw new Error('Connect wallet before invoking a contract');
    }
    const provider = getProvider();
    const response = await provider.invoke({
      ...params,
      signers: params.signers || [
        {
          account: account.address,
          scopes: 16,
        },
      ],
    });
    return response.txid;
  },
}));

if (typeof window !== 'undefined') {
  const updateAvailability = () => {
    useWalletStore.getState().refreshAvailability();
  };
  window.addEventListener('NEOLine.NEO.EVENT.READY', updateAvailability);
  window.addEventListener('NEOLine.N3.EVENT.READY', updateAvailability);
  window.addEventListener('NEOLine.NEO.EVENT.DISCONNECTED', updateAvailability);
  window.addEventListener('NEOLine.N3.EVENT.DISCONNECTED', updateAvailability);
}

export const useWallet = () => useWalletStore();
