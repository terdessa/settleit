import { requireEscrowContract } from '../config/blockchain';
import { useWallet } from './useWallet';

const toFixed8 = (amount: number) => Math.round(amount * 1e8).toString();

interface CreateBetParams {
  disputeId: string;
  creatorStake: number;
  opponentStake: number;
  token: string;
  opponentAddress: string;
  neofsObjectId: string;
}

interface ResolveBetParams {
  disputeId: string;
  winner: 'creator' | 'opponent';
  notesHash?: string;
}

interface ClaimParams {
  disputeId: string;
}

export const useNeoIntegration = () => {
  const wallet = useWallet();

  const createBetOnChain = async (params: CreateBetParams) => {
    const scriptHash = requireEscrowContract();
    if (!wallet.account) {
      throw new Error('Connect your Neo wallet before creating an on-chain bet');
    }

    const txid = await wallet.invokeContract({
      scriptHash,
      operation: 'createBet',
      args: [
        { type: 'String', value: params.disputeId },
        { type: 'String', value: wallet.account.address },
        { type: 'String', value: params.opponentAddress },
        { type: 'Integer', value: toFixed8(params.creatorStake) },
        { type: 'Integer', value: toFixed8(params.opponentStake) },
        { type: 'String', value: params.token },
        { type: 'String', value: params.neofsObjectId },
      ],
    });
    return txid;
  };

  const claimStake = async ({ disputeId }: ClaimParams) => {
    const scriptHash = requireEscrowContract();
    const txid = await wallet.invokeContract({
      scriptHash,
      operation: 'claim',
      args: [{ type: 'String', value: disputeId }],
    });
    return txid;
  };

  const resolveBetOnChain = async ({ disputeId, winner, notesHash }: ResolveBetParams) => {
    const scriptHash = requireEscrowContract();
    const txid = await wallet.invokeContract({
      scriptHash,
      operation: 'resolveBet',
      args: [
        { type: 'String', value: disputeId },
        { type: 'String', value: winner },
        { type: 'String', value: notesHash || '' },
      ],
    });
    return txid;
  };

  return {
    wallet,
    createBetOnChain,
    resolveBetOnChain,
    claimStake,
  };
};
