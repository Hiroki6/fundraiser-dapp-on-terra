import { useWallet, WalletStatus } from '@terra-dev/use-wallet'
import {Button, makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
  button: {
    color: "white",
    backgroundColor: "#0046ff",
    borderRadius: "5px"
  }
})

export const ConnectWallet = () => {
  const {
    status,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install,
    disconnect,
  } = useWallet()

  const classes = useStyles();

  return (
    <div>
      {status === WalletStatus.WALLET_NOT_CONNECTED && (
        <>
          {availableInstallTypes.map((connectType) => (
            <Button
              key={`install-${connectType}`}
              variant="contained"
              onClick={() => install(connectType)}
              className={classes.button}
            >
              Install {connectType}
            </Button>
          ))}
          {availableConnectTypes.map((connectType) => (
            <Button
              key={`connect-${connectType}`}
              variant="contained"
              onClick={() => connect(connectType)}
              className={classes.button}
            >
              Connect {connectType}
            </Button>
          ))}
        </>
      )}
      {status === WalletStatus.WALLET_CONNECTED && (
        <Button onClick={() => disconnect()} variant="contained" className={classes.button}>
          Disconnect
        </Button>
      )}
    </div>
  )
}
