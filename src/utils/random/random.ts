

export const generateRandomString_0_9_A_Z_a_z = (length: number = 28): string => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const randomLength = Math.max(25, Math.min(32, length)); // Limit length between 25-32
  
  for (let i = 0; i < randomLength; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}; 


export const generateRandomString_A_Z_a_z = (length: number = 28): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const randomLength = Math.max(25, Math.min(32, length)); // Limit length between 25-32
  
  for (let i = 0; i < randomLength; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}; 
