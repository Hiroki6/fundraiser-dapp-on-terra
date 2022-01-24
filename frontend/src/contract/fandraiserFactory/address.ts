// sync-ed from root via `tr sync-refs`
import config from "../../refs.terrain.json"
import {ConnectedWallet} from "@terra-money/wallet-provider";

// @ts-ignore
export const contractAddress = (wallet: ConnectedWallet) => config[wallet.network.name]["fundraiser-factory"].contractAddresses.default
