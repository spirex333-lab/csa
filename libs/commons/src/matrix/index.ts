
export const getMatrixId = (username: string, domain?: string): string => {
  if (username.startsWith('@')) {
    return username;
  }
  domain = domain ?? process.env.MATRIX_SERVER_DOMAIN_NAME;
  return `@${username}:${domain}`;
};
