import {Fee} from "@terra-money/terra.js";
import {ConnectedWallet} from "@terra-money/wallet-provider";
import {execute} from "../util";
import {contractAddress} from "./address";

const _execFactoryContract = (msg: any, fee?: Fee) => async (wallet: ConnectedWallet) => {
    return execute(contractAddress(wallet))(msg, fee)(wallet)
}

export const createFundraiser = async (wallet: ConnectedWallet, createFundraiserMsg: CreateFundraiserMsg) => {
    return _execFactoryContract( {create_fundraiser: {
        beneficiary: createFundraiserMsg.beneficiary,
        description: createFundraiserMsg.description,
        image_url: createFundraiserMsg.imageUrl,
        name: createFundraiserMsg.name,
        url: createFundraiserMsg.url,
    }}, undefined)(wallet)
}

export class CreateFundraiserMsg {
    name: string;
    description: string;
    imageUrl: string;
    url: string;
    beneficiary: string;
    constructor(name: string, description: string, imageUrl: string, url: string, beneficiary: string) {
        this.beneficiary = beneficiary;
        this.description = description;
        this.imageUrl = imageUrl;
        this.name = name;
        this.url = url;
    }
}