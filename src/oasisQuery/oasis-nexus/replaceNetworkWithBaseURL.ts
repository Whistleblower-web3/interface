import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const ensureTrailingSlash = (value: string) => (value.endsWith('/') ? value : `${value}/`)

const replacePrefixWithBase = (config: AxiosRequestConfig, prefix: string, base: string | undefined, name: string) => {
  if (!config.url?.startsWith(prefix)) return false
  const resolvedBase = ensureTrailingSlash(base ?? '')
  if (!base) {
    throw new Error(`[oasisQuery] Missing environment variable ${name}. Please define it in your .env file.`)
  }
  config.url = config.url.replace(prefix, resolvedBase)
  return true
}

export const replaceNetworkWithBaseURL = <T>(
  config: AxiosRequestConfig,
  requestOverrides?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  if (
    !(
      replacePrefixWithBase(config, '/mainnet/', import.meta.env.VITE_API, 'VITE_API') ||
      replacePrefixWithBase(config, '/testnet/', import.meta.env.VITE_TESTNET_API, 'VITE_TESTNET_API') ||
      replacePrefixWithBase(config, '/localnet/', import.meta.env.VITE_LOCALNET_API, 'VITE_LOCALNET_API')
    )
  ) {
    throw new Error(`Expected URL to be prefixed with network: ${config.url}`)
  }

  return axios({ ...config, ...requestOverrides })
}

export default replaceNetworkWithBaseURL
