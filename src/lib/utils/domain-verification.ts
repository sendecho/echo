export function canSendEmails(verificationStatus: string | null) {
  return verificationStatus === 'verified';
} 