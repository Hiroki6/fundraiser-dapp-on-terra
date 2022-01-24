import {ConnectedWallet} from "@terra-money/wallet-provider";
import {getLCDClient} from "../util";
import {contractAddress} from "./address";

export const queryFundraiserAddrs = async (wallet: ConnectedWallet, limit: number = 20, offset: number = 0): Promise<string[]> => {
   const lcd = getLCDClient(wallet);
   const res = await lcd.wasm.contractQuery<GetFundraisersResponse>(contractAddress(wallet), { get_fundraisers: { limit: limit, offset: offset }});
   return res.addrs;
}

interface GetFundraisersResponse {
    addrs: string[]
}