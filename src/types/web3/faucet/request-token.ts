export default interface RequestToken {
  id: string,
  requester: string;  
  receiver: string;
  token: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: number;
}

export type RequestTokensData = {
  requestTokens: RequestToken[];
};
