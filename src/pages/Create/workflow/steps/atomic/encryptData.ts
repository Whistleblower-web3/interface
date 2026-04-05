import { CryptionService } from '@dapp/services/cryption';
import { EncryptDataOutput } from '../../../types/stepType';

export interface EncryptDataParams {
  fileCidList: string[];
  password?: string;
  slicesMetadataCid?: string;
  mintMethod: 'create' | 'createAndPublish';
}

/**
 * Step 3: Encrypt sensitive data (CIDs and passwords) using a generated key pair.
 * Skipped for 'createAndPublish' mode.
 */
export const step_EncryptData = async (
  { fileCidList, password, slicesMetadataCid, mintMethod, isTestMode }: EncryptDataParams & { isTestMode?: boolean }
): Promise<EncryptDataOutput> => {
  if (isTestMode) {
    console.log('[Step 3: Encrypt] Starting encryption...');
  }
  const now = new Date();

  if (mintMethod === 'createAndPublish') {
    if (isTestMode) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('[Step 3: Encrypt] createAndPublish mode: Skipping encryption');
    }
    return {
      encryption_slices_metadata_cid: { encryption_data: '', encryption_iv: '' },
      encryption_file_cid: [],
      encryption_passwords: { encryption_data: '', encryption_iv: '' },
      key_pair: { private_key_minter: '', public_key_minter: '' },
      current_time: {
        create_date: now.toISOString(),
        timestamp: now.getTime(),
      },
    };
  }

  if (!fileCidList || fileCidList.length === 0) {
    throw new Error('File CID list is missing');
  }

  const keyPair = await CryptionService.generateKeyPair();

  // Encrypt slices metadata CID
  const metadataResult = await CryptionService.encryptList(
    keyPair.publicKey_bytes,
    keyPair.privateKey_bytes,
    slicesMetadataCid ? [slicesMetadataCid] : []
  );

  // Encrypt file CIDs
  const cidResult = await CryptionService.encryptList(
    keyPair.publicKey_bytes,
    keyPair.privateKey_bytes,
    fileCidList
  );

  // Encrypt password
  const passwordResult = await CryptionService.encryptList(
    keyPair.publicKey_bytes,
    keyPair.privateKey_bytes,
    [password ?? '']
  );

  if (!cidResult.success || !cidResult.data || !passwordResult.success || !passwordResult.data) {
    throw new Error('Encryption failed: ' + (cidResult.error || passwordResult.error || 'Unknown error'));
  }

  if (isTestMode) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('[Step 3: Encrypt] Key pair generated:', {
      publicKey: keyPair.publicKey_bytes.slice(0, 20) + '...',
      privateKey: 'PROTECTED'
    });
    console.log('[Step 3: Encrypt]  Data encrypted successfully');
  }

  return {
    encryption_slices_metadata_cid: {
      encryption_data: metadataResult.data?.[0]?.encrypted_bytes ?? '',
      encryption_iv: metadataResult.data?.[0]?.iv_bytes ?? '',
    },
    encryption_file_cid: cidResult.data.map(item => ({
      encryption_data: item.encrypted_bytes,
      encryption_iv: item.iv_bytes,
    })),
    encryption_passwords: {
      encryption_data: passwordResult.data[0].encrypted_bytes,
      encryption_iv: passwordResult.data[0].iv_bytes,
    },
    key_pair: {
      private_key_minter: keyPair.privateKey_bytes,
      public_key_minter: keyPair.publicKey_bytes,
    },
    current_time: {
      create_date: now.toISOString(),
      timestamp: now.getTime(),
    },
  };
};
