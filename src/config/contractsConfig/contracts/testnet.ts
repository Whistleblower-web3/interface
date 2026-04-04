import { ContractAddresses, ContractName } from '../types';
import contractsAddress from '../chain-23295/contracts_address.json';

export const TESTNET_ADDRESSES: ContractAddresses = {
  // Core contracts
  [ContractName.FORWARDER]: contractsAddress['Forwarder'] as `0x${string}`,
  [ContractName.EXCHANGE]: contractsAddress['Exchange'] as `0x${string}`,
  [ContractName.FUND_MANAGER]: contractsAddress['FundManager'] as `0x${string}`,
  [ContractName.TRUTH_BOX]: contractsAddress['TruthBox'] as `0x${string}`,
  [ContractName.ADDRESS_MANAGER]: contractsAddress['AddressManager'] as `0x${string}`,
  [ContractName.SIWE_AUTH]: contractsAddress['SiweAuth'] as `0x${string}`,
  [ContractName.USER_MANAGER]: contractsAddress['UserManager'] as `0x${string}`,
};
