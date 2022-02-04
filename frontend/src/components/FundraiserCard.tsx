import {Fundraiser} from "../util/factoryHelper";
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input,
    makeStyles,
    Typography
} from "@material-ui/core";
import {useEffect, useState} from "react";
import {getExchangeRate} from "../util/luna";
import {ConnectedWallet, useConnectedWallet} from "@terra-money/wallet-provider";
import {donate, setBeneficiary as executeSetBeneficiary, withDraw} from "../contract/fundraiser/execute";
import {queryMyDonations, Donation} from "../contract/fundraiser/query";
import {Link} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        display: 'table-cell'
    },
    card: {
        maxWidth: 450,
        height: 500
    },
    media: {
        height: 200,
    },
    paper: {
        position: 'absolute',
        width: 500,
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        boxShadow: 'none',
        padding: 4,
    },
    button: {
        backgroundColor: '#1a237e',
        color: 'white',
        display: "block",
        marginLeft: "auto",
        marginTop: "20px"
    },
    form: {
        display: "block"
    },
    formFrame: {
        borderRadius: "10px",
        border: "1px solid #0046ff",
        margin: "10px 0",
        padding: "20px",
    }
}));

type FundraiserCardProps = {
    fundraiser: Fundraiser
}

const FundraiserCard = ({ fundraiser }: FundraiserCardProps) => {
    const classes = useStyles();

    const connectedWallet = useConnectedWallet();

    useEffect(() => {
        if(connectedWallet) {
            init(connectedWallet)
        }
    }, [connectedWallet]);

    const init = async (wallet: ConnectedWallet) => {
        const exchangeRate = await getExchangeRate();
        setExchangeRate(exchangeRate);
        const donations = await queryMyDonations(wallet, fundraiser.contractAddress, wallet.terraAddress);
        setDonationList(donations.donations);
        setIsOwner(fundraiser.owner === wallet.terraAddress);
    };

    const [ open, setOpen ] = useState(false);
    const [ donationAmount, setDonationAmount ] = useState(0);
    const [ exchangeRate, setExchangeRate ] = useState(0);
    const [ donationList, setDonationList ] = useState<Donation[]>([]);
    const [ isOwner, setIsOwner ] = useState(false);
    const [ beneficiary, setBeneficiary ] = useState(fundraiser.beneficiary);

    const lunaAmount = (donationAmount / exchangeRate || 0);

    const handleDonate = async () => {
        if(connectedWallet) {
            const result = await donate(connectedWallet, fundraiser.contractAddress, parseInt((lunaAmount*100000).toFixed(0), 10));
            console.log(result.txhash);
        }
    }

    const renderDonationList = () => {
        if(connectedWallet) {
            return donationList.map((donation, index) => {
                const euro = (donation.value * exchangeRate / 100000).toFixed(2);
                const luna = (donation.value/100000).toFixed(6);
                return (
                    <li key={index}>
                        <p>{luna} [Luna], €{euro}</p>
                        <Button variant="contained" className={classes.button} to="/receipts" state={{ fundName: fundraiser.name, donationLunaAmount: luna, donationEuroAmount: euro, donationDate: donation.date} } component={Link}>
                            Receipt
                        </Button>
                    </li>
                )
            })
        }
    }

    const handleSetBeneficiary = async () => {
        if(connectedWallet) {
            const result = await executeSetBeneficiary(connectedWallet, fundraiser.contractAddress, beneficiary);
            console.log(result.txhash);
        }
    }

    const handleWithdraw = async () => {
        if(connectedWallet) {
            const result = await withDraw(connectedWallet, fundraiser.contractAddress);
            console.log(result.txhash);
        }
    }

    return (
        <Container>
            <Dialog open={open} onClose={(_ => setOpen(false))}>
                <DialogTitle>
                    Donate to {fundraiser.name}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <img alt={fundraiser.name} src={fundraiser.imageUrl} className={classes.media} />
                        <p>
                            {fundraiser.description}
                        </p>
                        <div className={classes.formFrame}>
                            <FormControl className={classes.form}>
                                €
                                <Input
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value as unknown as number)}
                                    placeholder="0.0"
                                />

                                <p>LUNA: {lunaAmount.toFixed(4)}</p>
                            </FormControl>
                            <Button onClick={handleDonate} variant="contained" className={classes.button}>
                                Donate
                            </Button>
                            </div>
                        <div>
                            <h3>My donations</h3>
                            <ul>
                                {renderDonationList()}
                            </ul>
                        </div>

                        {isOwner &&
                            <div className={classes.formFrame}>
                                <FormControl className={classes.form}>
                                    Beneficiary:
                                    <Input
                                      value={beneficiary}
                                      onChange={(e => setBeneficiary(e.target.value))}
                                      placeholder="input terra address"
                                    />
                                </FormControl>
                                <Button onClick={handleSetBeneficiary} variant="contained" className={classes.button}>
                                    Set Beneficiary
                                </Button>
                            </div>
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(_) => setOpen(false)} variant="contained" className={classes.button}>
                        Cancel
                    </Button>
                    {isOwner &&
                        <Button onClick={handleWithdraw} variant="contained" className={classes.button}>
                            Withdrawal
                        </Button>
                    }
                </DialogActions>
            </Dialog>
            <Card className={classes.card} onClick={(_ => setOpen(true))}>
                <CardActionArea>
                    <CardMedia
                        image={fundraiser.imageUrl}
                        title={fundraiser.name}
                        className={classes.media} />
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {fundraiser.name}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            <p>{fundraiser.description}</p>
                        </Typography>
                        <Typography variant="h5" component="h2">
                            <p>LUNA: {fundraiser.total_donation/100000}</p>
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button
                        variant="contained"
                        className={classes.button}
                        onClick={(_ => setOpen(true))}
                    >
                        View More
                    </Button>
                </CardActions>
            </Card>
        </Container>
    )
}

export default FundraiserCard