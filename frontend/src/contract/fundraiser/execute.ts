import {Coin, Fee, TxInfo} from "@terra-money/terra.js";
import {ConnectedWallet} from "@terra-money/wallet-provider";
import {execute} from "../util";
import {Coins} from "@terra-money/terra.js/dist/core/Coins";

const _execFundraiserContract = (msg: any, fee = new Fee(200000, { uluna: 10000 })) => async (contractAddress: string, wallet: ConnectedWallet, coin?: Coins.Input) => {
  return execute(contractAddress)(msg, fee)(wallet, coin)
}

export const setBeneficiary = async (wallet: ConnectedWallet, contractAddress: string, beneficiary: string): Promise<TxInfo> => {
    return _execFundraiserContract( {set_beneficiary: {
        beneficiary: beneficiary,
    }})(contractAddress, wallet)
}

export const donate = async(wallet: ConnectedWallet, contractAddress: string, amount: number): Promise<TxInfo> => {
    const coin = new Coin("uluna", amount);
    return _execFundraiserContract( {donate: {}})(contractAddress, wallet, [coin])
}

export const withDraw = async(wallet: ConnectedWallet, contractAddress: string): Promise<TxInfo> => {
    return _execFundraiserContract( {withdraw: {}})(contractAddress, wallet)
}