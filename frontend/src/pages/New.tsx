import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core";
import {useConnectedWallet} from "@terra-money/wallet-provider";
import {useEffect, useState} from "react";
import {createFundraiser, CreateFundraiserMsg} from "../contract/fandraiserFactory/execute";

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

const New = () => {
    const classes = useStyles();

    const connectedWallet = useConnectedWallet();

    useEffect(() => {
    }, [connectedWallet]);

    const [name, setFundraiserName] = useState("");
    const [url, setFundraiserWebsite] = useState("");
    const [description, setFundraiserDescription] = useState("");
    const [imageURL, setImage] = useState("");
    const [beneficiary, setAddress] = useState("");

    const handleSubmit = async () => {
        if(connectedWallet) {
            const createFundraiserMsg = new CreateFundraiserMsg(name, description, imageURL, url, beneficiary);
            await createFundraiser(connectedWallet, createFundraiserMsg);
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
                inputProps={{'aria-label': 'bare'}}
            />

            <label>Website</label>
            <TextField
                id="outlined-bare"
                className={classes.textField}
                placeholder="Fundraiser Website"
                margin="normal"
                onChange={(e) => setFundraiserWebsite(e.target.value)}
                variant="outlined"
                inputProps={{'aria-label': 'bare'}}
            />

            <label>Description</label>
            <TextField
                id="outlined-bare"
                className={classes.textField}
                placeholder="Fundraiser Description"
                margin="normal"
                onChange={(e) => setFundraiserDescription(e.target.value)}
                variant="outlined"
                inputProps={{'aria-label': 'bare'}}
            />

            <label>Image</label>
            <TextField
                id="outlined-bare"
                className={classes.textField}
                placeholder="Fundraiser Image"
                margin="normal"
                onChange={(e) => setImage(e.target.value)}
                variant="outlined"
                inputProps={{'aria-label': 'bare'}}
            />

            <label>Address</label>
            <TextField
                id="outlined-bare"
                className={classes.textField}
                placeholder="LunaTerra Wallet Address"
                margin="normal"
                onChange={(e) => setAddress(e.target.value)}
                variant="outlined"
                inputProps={{'aria-label': 'bare'}}
            />

            <Button
                onClick={handleSubmit}
                variant="contained"
                className={classes.button}>
                Submit
            </Button>
        </div>
    )
}

export default New