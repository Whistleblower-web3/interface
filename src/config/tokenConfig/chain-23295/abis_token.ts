
import officialTokenJson from '@dapp/artifacts/contracts_23295/token/MockERC20.sol/MockERC20.json';
import erc20SecretJson from '@dapp/artifacts/contracts_23295/token/ERC20Secret.sol/ERC20Secret.json';
import wroseSecretJson from '@dapp/artifacts/contracts_23295/token/WROSEsecret.sol/WROSEsecret.json';

import { Abi } from 'viem';
import { TokenName } from '../token/typesToken';

export const ABIS_Token: Record<TokenName, Abi> = {
  // Token contracts
  [TokenName.OFFICIAL_TOKEN]: officialTokenJson.abi as Abi,
  [TokenName.OFFICIAL_TOKEN_PRIVACY]: erc20SecretJson.abi as Abi,
  [TokenName.WROSE_PRIVACY]: wroseSecretJson.abi as Abi,
  // [ContractName.ERC20_SECRET]: erc20SecretJson.abi as Abi,
  [TokenName.WROSE]: officialTokenJson.abi as Abi,
};

