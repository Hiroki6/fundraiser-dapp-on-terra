import {Fundraiser} from "../util/factoryHelper";
import {
    Avatar,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Container, Dialog, DialogContent, DialogContentText, DialogTitle, FormControl, Input,
    makeStyles,
    Typography
} from "@material-ui/core";
import {useEffect, useState} from "react";
import {getExchangeRate} from "../util/luna";
import {useConnectedWallet} from "@terra-money/wallet-provider";
import {donate} from "../contract/fundraiser/execute";

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
        height: 400
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
        color: 'white'
    }
}));

type FundraiserCardProps = {
    fundraiser: Fundraiser
}

const FundraiserCard = ({ fundraiser }: FundraiserCardProps) => {
    const classes = useStyles();

    const connectedWallet = useConnectedWallet();

    useEffect(() => {
        init()
    }, [connectedWallet]);

    const init = async () => {
        const exchangeRate = await getExchangeRate();
        setExchangeRate(exchangeRate);
    };

    const [ open, setOpen ] = useState(false);
    const [ donationAmount, setDonationAmount ] = useState(0);
    const [ exchangeRate, setExchangeRate ] = useState(0);

    const lunaAmount = (donationAmount / exchangeRate || 0);

    const handleDonate = async () => {
        if(connectedWallet) {
            const result = await donate(connectedWallet, fundraiser.contractAddress, parseInt((lunaAmount*100000).toFixed(0), 10));
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
                        <Avatar alt={fundraiser.name} src={fundraiser.imageUrl} />
                        <Typography component="p">
                            {fundraiser.description}
                        </Typography>
                        <FormControl>
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
                    </DialogContentText>
                </DialogContent>
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
                        className={classes.button}>
                        View More
                    </Button>
                </CardActions>
            </Card>
        </Container>
    )
}

export default FundraiserCard