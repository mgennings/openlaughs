export function getUserDisplayName(opts: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  shortLastName?: boolean;
}): string {
  const first = (opts.firstName || '').trim();
  const last = (opts.lastName || '').trim();
  const email = (opts.email || '').trim();
  const short = opts.shortLastName ?? true;

  if (first && last) {
    return short ? `${first} ${last.charAt(0)}` : `${first} ${last}`;
  }
  if (first) return first;
  if (email) return email;
  return 'User';
}

export function getInitials(opts: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}): string {
  const first = (opts.firstName || '').trim();
  const last = (opts.lastName || '').trim();
  if (first || last)
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || 'U';
  const email = (opts.email || '').trim();
  return email ? email.charAt(0).toUpperCase() : 'U';
}
