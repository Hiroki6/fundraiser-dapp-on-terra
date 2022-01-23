import { LCDClient, MsgExecuteContract, Fee } from "@terra-money/terra.js";
import { contractAddress } from "./address";

// ==== utils ====

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;

const _exec =
  (msg, fee = new Fee(200000, { uluna: 10000 })) =>
  async (wallet) => {
    const lcd = new LCDClient({
      URL: wallet.network.lcd,
      chainID: wallet.network.chainID,
    });

    const { result } = await wallet.post({
      fee,
      msgs: [
        new MsgExecuteContract(
          wallet.walletAddress,
          contractAddress(wallet),
          msg
        ),
      ],
    });

    while (true) {
      try {
        return await lcd.tx.txInfo(result.result.txhash);
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
  };

// ==== execute contract ====

export const createFundraiser = (createFundraiserMsg) => {
    _exec( {
        beneficiary: createFundraiserMsg.beneficiary,
        custodian: createFundraiserMsg.custodian,
        description: createFundraiserMsg.description,
        image_url: createFundraiserMsg.image_url,
        name: createFundraiserMsg.name,
        url: createFundraiserMsg.url,
    })
}

export const setBeneficiary = (setBeneficiaryMsg) => {
    _exec( {
        fundraiser_id: setBeneficiaryMsg.beneficiary,
        beneficiary: setBeneficiaryMsg.beneficiary,
    })
}

export const donate = (donateMsg) => {
    _exec( {
            fundraiser_id: donateMsg.fundraiser_id,
        },
        new Fee(200000, { uluna: donateMsg.amount })
    )
}

export class CreateFundraiserMsg {
    constructor(beneficiary, custodian, description, image_url, name, url) {
        this.beneficiary = beneficiary;
        this.custodian = custodian;
        this.description = description;
        this.image_url = image_url;
        this.name = name;
        this.url = url;
    }
}

export class SetBeneficiaryMsg {
    constructor(fundraiser_id, beneficiary) {
        this.fundraiser_id = fundraiser_id;
        this.beneficiary = beneficiary;
    }
}

export class DonateMsg {
    constructor(fundraiser_id, amount) {
        this.fundraiser_id = fundraiser_id;
        this.amount = amount;
    }
}