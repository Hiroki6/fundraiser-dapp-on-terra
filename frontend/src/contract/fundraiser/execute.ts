import {Fee, TxInfo} from "@terra-money/terra.js";
import {ConnectedWallet} from "@terra-money/wallet-provider";
import {execute} from "../util";

const _execFundraiserContract = (msg: any, fee = new Fee(200000, { uluna: 10000 })) => async (contractAddress: string, wallet: ConnectedWallet) => {
  return execute(contractAddress)(msg, fee)(wallet)
}

export const setBeneficiary = async (wallet: ConnectedWallet, contractAddress: string, beneficiary: string): Promise<TxInfo> => {
    return _execFundraiserContract( {set_beneficiary: {
        beneficiary: beneficiary,
    }})(contractAddress, wallet)
}

export const donate = async(wallet: ConnectedWallet, contractAddress: string, amount: number) => {
    return _execFundraiserContract( {donate: {}},
        new Fee(200000, { uluna: amount })
    )(contractAddress, wallet)
}

export const withDraw = async(wallet: ConnectedWallet, contractAddress: string, amount: number) => {
    return _execFundraiserContract( {with_draw: {}},
        new Fee(200000, { uluna: amount })
    )(contractAddress, wallet)
}