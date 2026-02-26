export function canUpload(userQuota: number, used: number) {
  return used < userQuota;
}
