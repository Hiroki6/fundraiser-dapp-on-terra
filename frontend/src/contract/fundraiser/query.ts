import {ConnectedWallet} from "@terra-money/wallet-provider";
import {getLCDClient} from "../util";

export const queryFundraiser = async (wallet: ConnectedWallet, contractAddress: string): Promise<FundraiserResponse> => {
    const lcd = getLCDClient(wallet);
    return await lcd.wasm.contractQuery<FundraiserResponse>(contractAddress, { get_fundraiser: {}});
}

interface FundraiserResponse {
    name: string,
    url: string,
    image_url: string,
    description: string,
    owner: string,
    beneficiary: string
}