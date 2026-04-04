import { generateRandomString_0_9_A_Z_a_z } from "../../../../utils/random/random";


export const fileNameCreate = {

  // nftImageName: (): string => {
  //   return `WikiTruth_nftImage_${generateRandomString_0_9_A_Z_a_z(12)}`;
  // },

  metadataBoxName: (): string => {
    return `WikiTruth_metadataBox_${generateRandomString_0_9_A_Z_a_z(12)}`;
  },

  // metadataNFTName: (): string => {
  //   return `WikiTruth_metadataNFT_${generateRandomString_0_9_A_Z_a_z(12)}`;
  // },

  resultDataName: (): string => {
    return `WikiTruth_resultData_${generateRandomString_0_9_A_Z_a_z(12)}`;
  },

}; 