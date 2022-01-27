import {ConnectedWallet, useConnectedWallet} from "@terra-money/wallet-provider";
import {useEffect, useState} from "react";
import {Fundraiser, getFundraiserList} from "../util/factoryHelper";
import {Container, makeStyles, Typography} from "@material-ui/core";
import FundraiserCard from "../components/FundraiserCard";

const useStyles = makeStyles({
    container: {
        display: "flex"
    },
    h1: {
        textAlign: "center",
        margin: "20px"
    }
});

const Home = () => {
    const connectedWallet = useConnectedWallet();

    useEffect(() => {
        if(connectedWallet) {
            init(connectedWallet)
        }
    }, [connectedWallet]);

    const classes = useStyles();

    const init = async (wallet: ConnectedWallet) => {
        const fundraisers: Fundraiser[] = await getFundraiserList(wallet);
        setFundraisers(fundraisers);
    };

    const [ fundraisers, setFundraisers ] = useState<Fundraiser[]>([]);

    const renderFundraiserList = () => {
        return fundraisers.map((f, index) => {
            return <FundraiserCard fundraiser={f} key={index} />
        })
    }

    return (
        <div>
            <Typography className={classes.h1} component="h1">Fundraisers</Typography>
            <Container className={classes.container}>
                {renderFundraiserList()}
            </Container>
        </div>
    )
}

export default Home