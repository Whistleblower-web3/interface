

import truthBoxAbi from '@dapp/artifacts/contracts_23295/TruthBox.json';
import forwarderAbi from '@dapp/artifacts/contracts_23295/Forwarder.json';
import exchangeAbi from '@dapp/artifacts/contracts_23295/Exchange.json';
import fundManagerAbi from '@dapp/artifacts/contracts_23295/FundManager.json';
import addressManagerAbi from '@dapp/artifacts/contracts_23295/AddressManager.json';
import siweAuthAbi from '@dapp/artifacts/contracts_23295/SiweAuthWikiTruth.json';
import userManagerAbi from '@dapp/artifacts/contracts_23295/UserManager.json';

import { Abi } from 'viem';
import { ContractName } from '../types';

export const ABIS: Record<ContractName, Abi> = {
  // Core contracts
  [ContractName.FORWARDER]: forwarderAbi as Abi,
  [ContractName.EXCHANGE]: exchangeAbi as Abi,
  [ContractName.FUND_MANAGER]: fundManagerAbi as Abi,
  [ContractName.TRUTH_BOX]: truthBoxAbi as Abi,
  [ContractName.ADDRESS_MANAGER]: addressManagerAbi as Abi,
  [ContractName.SIWE_AUTH]: siweAuthAbi as Abi,
  [ContractName.USER_MANAGER]: userManagerAbi as Abi,
};

export function getABI(contractName: ContractName): Abi {
  const abi = ABIS[contractName];
  if (!abi) {
    throw new Error(`ABI not found for contract: ${contractName}`);
  }
  return abi;
}

