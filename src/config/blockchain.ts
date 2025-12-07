export const NEO_RPC_URL = import.meta.env.VITE_NEO_RPC_URL || 'https://n3seed2.ngd.network:20332';
export const NEO_NETWORK_MAGIC = Number(import.meta.env.VITE_NEO_NETWORK_MAGIC || 894710606);
export const NEO_CHAIN = import.meta.env.VITE_NEO_CHAIN || 'Neo N3 TestNet';
export const ESCROW_CONTRACT_HASH = import.meta.env.VITE_ESCROW_CONTRACT_HASH || '';
export const GAS_TOKEN_HASH = import.meta.env.VITE_GAS_TOKEN_HASH || '0xd2a4cff31913016155e38e474a2c06d08be276cf';
export const NEOFS_GATEWAY_URL = import.meta.env.VITE_NEOFS_GATEWAY_URL || '';

export const requireEscrowContract = () => {
    if (!ESCROW_CONTRACT_HASH) {
        throw new Error('Missing VITE_ESCROW_CONTRACT_HASH. Update your .env to include the escrow contract script hash.');
    }
    return ESCROW_CONTRACT_HASH;
};
