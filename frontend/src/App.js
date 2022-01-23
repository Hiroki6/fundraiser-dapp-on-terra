import './App.css'

import { useEffect, useState } from 'react'
import {
  useWallet,
  useConnectedWallet,
  WalletStatus,
} from '@terra-money/wallet-provider'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';
import { instantiate, InstantiateMsg } from './contract/instantiate'
import { ConnectWallet } from './components/ConnectWallet'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
  button: {
    backgroundColor: '#1a237e',
    color: 'white'
  }
}));

function App() {

  const { status } = useWallet()

  const classes = useStyles()

  const connectedWallet = useConnectedWallet()

  useEffect(() => {}, [connectedWallet])
  const [ name, setFundraiserName ] = useState(null)
  const [ url, setFundraiserWebsite ] = useState(null)
  const [ description, setFundraiserDescription ] = useState(null)
  const [ imageURL, setImage ] = useState(null)
  const [ beneficiary, setAddress ] = useState(null)
  const [ custodian, setCustodian ] = useState(null)
  
  const handleSubmit = async() => {
    const instantiateMsg = new InstantiateMsg(beneficiary, beneficiary, description, imageURL, name, url);
    const result = await instantiate(connectedWallet, instantiateMsg);
    if(result.success) {
      console.log("successfully created fundraiser")
    } else {
      console.log("failed to create fundraiser")
    }
  }

  return (
    <div>
      <h2>Create A New Fundraiser</h2>
      <label>Name</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Fundraiser Name"
        margin="normal"
        onChange={(e) => setFundraiserName(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />
      
      <label>Website</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Fundraiser Website"
        margin="normal"
        onChange={(e) => setFundraiserWebsite(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />
      
      <label>Description</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Fundraiser Description"
        margin="normal"
        onChange={(e) => setFundraiserDescription(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />
      
      <label>Image</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Fundraiser Image"
        margin="normal"
        onChange={(e) => setImage(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />
      
      <label>Address</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Fundraiser Ethereum Address"
        margin="normal"
        onChange={(e) => setAddress(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />
      
      <Button
        onClick={handleSubmit}
        variant="contained"
        className={classes.button}>
        Submit
      </Button>
      <ConnectWallet />
    </div>
  )
}

export default App
