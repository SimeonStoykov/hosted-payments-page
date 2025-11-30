// Route helper functions
export const getQuotePageUrl = (uuid: string) => `/payin/${uuid}`;
export const getPayPageUrl = (uuid: string) => `/payin/${uuid}/pay`;
export const getExpiredPageUrl = (uuid: string) => `/payin/${uuid}/expired`;
