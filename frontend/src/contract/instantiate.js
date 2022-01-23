/*
import { LCDClient, MsgInstantiateContract, isTxError, Fee, } from "@terra-money/terra.js";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;


export const instantiate = async (wallet, instantiateMsg) => {
    const terra = new LCDClient({
      URL: wallet.network.lcd,
      chainID: wallet.network.chainID,
    });

    const instantiate = new MsgInstantiateContract(
        wallet.walletAddress,
        undefined,
        32,
        {
            beneficiary: instantiateMsg.beneficiary,
            custodian: instantiateMsg.custodian,
            description: instantiateMsg.description,
            image_url: instantiateMsg.image_url,
            name: instantiateMsg.name,
            url: instantiateMsg.url,
        },
    );

    const result = await wallet.post({
        msgs: [instantiate],
        gas: 'auto'
      });

    console.log(result);

    while (true) {
      try {
        return await terra.tx.txInfo(result.result.txhash);
      } catch (e) {
        if (Date.now() < untilInterval) {
          await sleep(500);
        } else if (Date.now() < until) {
          await sleep(1000 * 10);
        } else {
          throw new Error(
            `Transaction queued. To verify the status, please check the transaction hash: ${result.txhash}`
          );
        }
      }
    }
}

export class InstantiateMsg {
    constructor(beneficiary, custodian, description, image_url, name, url) {
        this.beneficiary = beneficiary;
        this.custodian = custodian;
        this.description = description;
        this.image_url = image_url;
        this.name = name;
        this.url = url;
    }
}
*/
