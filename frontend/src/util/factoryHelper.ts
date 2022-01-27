import {ConnectedWallet} from "@terra-money/wallet-provider";
import {queryFundraiserAddrs} from "../contract/fandraiserFactory/query";
import {queryFundraiser} from "../contract/fundraiser/query";

export const getFundraiserList = async(wallet: ConnectedWallet, limit: number = 20, offset: number = 0): Promise<Fundraiser[]> => {
    const addrs = await queryFundraiserAddrs(wallet, limit, offset);
    let fundraisers = [];

    for(const addr of addrs) {
        const fundraiserRes = await queryFundraiser(wallet, addr);
        const fundraiser = new Fundraiser(fundraiserRes.name, fundraiserRes.description, fundraiserRes.image_url, fundraiserRes.url, fundraiserRes.owner, fundraiserRes.beneficiary, addr, fundraiserRes.total_donations);
        fundraisers.push(fundraiser);
    }

    return fundraisers;
}

// @todo add total donation
export class Fundraiser {
    name: string;
    url: string;
    imageUrl: string;
    description: string;
    owner: string;
    beneficiary: string;
    contractAddress: string;
    total_donation: number;

    constructor(name: string, description: string, imageUrl: string, url: string, owner: string, beneficiary: string, contractAddress: string, total_donation: number) {
        this.name = name;
        this.url = url;
        this.imageUrl = imageUrl;
        this.description = description;
        this.owner = owner;
        this.beneficiary = beneficiary;
        this.contractAddress = contractAddress;
        this.total_donation = total_donation;
    }

    isOwner (address: string): boolean {
        return this.owner === address
    }
}