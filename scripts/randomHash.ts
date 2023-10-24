export async function generateRandomHash() {
  const crypto = await import('crypto');
  return crypto.randomBytes(32).toString('hex');
}
