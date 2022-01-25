import {Fee, LCDClient, MsgExecuteContract, MsgSend, TxInfo} from "@terra-money/terra.js";
import {ConnectedWallet, TxResult} from "@terra-money/wallet-provider";
import {Coins} from "@terra-money/terra.js/dist/core/Coins";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;

export const execute =
    (contractAddress: string) =>
        (msg: any, fee?: Fee) =>
            async (wallet: ConnectedWallet, coins?: Coins.Input) => {
                const lcd = getLCDClient(wallet);

                const result = await wallet.post({
                    fee,
                    msgs: [
                        new MsgExecuteContract(
                            wallet.walletAddress,
                            contractAddress,
                            msg,
                            coins
                        ),
                    ],
                    gas: 'auto'
                });

                const tx = await handleTxResult(lcd, result);
                console.log(result.success);
                return tx
            };

export const sendMoney =
    async (wallet: ConnectedWallet, recipient: string, coin: Coins.Input, fee = new Fee(200000, { uluna: 10000 })) => {
        const lcd = getLCDClient(wallet);

        const result = await wallet.post({
            fee,
            msgs: [
                new MsgSend(
                    wallet.walletAddress,
                    recipient,
                    coin
                ),
            ],
        });

        return handleTxResult(lcd, result);
    }

const handleTxResult: (lcd: LCDClient, txResult: TxResult) => Promise<TxInfo> = async (lcd: LCDClient, txResult: TxResult) => {
    while (true) {
        try {
            return await lcd.tx.txInfo(txResult.result.txhash);
        } catch (e) {
            if (Date.now() < untilInterval) {
                await sleep(500);
            } else if (Date.now() < until) {
                await sleep(1000 * 10);
            } else {
                throw new Error(
                    `Transaction queued. To verify the status, please check the transaction hash: ${txResult.result.txhash}`
                );
            }
        }
    }
}

export const getLCDClient: (wallet: ConnectedWallet) => LCDClient = (wallet: ConnectedWallet) => {
    return new LCDClient({
        URL: wallet.network.lcd,
        chainID: wallet.network.chainID,
    })
}