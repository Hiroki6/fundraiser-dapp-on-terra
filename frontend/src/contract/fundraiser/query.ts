import {ConnectedWallet} from "@terra-money/wallet-provider";
import {getLCDClient} from "../util";

export const queryFundraiser = async (wallet: ConnectedWallet, contractAddress: string): Promise<FundraiserResponse> => {
    const lcd = getLCDClient(wallet);
    return await lcd.wasm.contractQuery<FundraiserResponse>(contractAddress, { get_fundraiser: {}});
}

export const queryMyDonations = async (wallet: ConnectedWallet, contractAddress: string, address: string): Promise<MyDonationsResponse> => {
    const lcd = getLCDClient(wallet);
    return await lcd.wasm.contractQuery<MyDonationsResponse>(contractAddress, { my_donations: {address: address}});
}

interface FundraiserResponse {
    name: string,
    url: string,
    image_url: string,
    description: string,
    owner: string,
    beneficiary: string
    total_donations: number
}

interface MyDonationsResponse {
    donations: Donation[]
}

export interface Donation {
    value: number,
    date: string
}