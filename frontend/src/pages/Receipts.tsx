import {Container, makeStyles, Typography} from "@material-ui/core";
import {useLocation} from "react-router-dom";

type ReceiptProps = {
    fundName: string,
    donationLunaAmount: string,
    donationEuroAmount: string,
    donationDate: string
}

const useStyles = makeStyles({
    container: {
        textAlign: "center",
        margin: "50px auto",
        padding: "30px",
        width: "600px",
        border: "1px solid #0046ff",
        borderRadius: "20px"
    },
    receiptHeader: {
        marginBottom: "10px",
        borderBottom: "1px solid gray"
    },
    receiptInfo: {
        display: "flex",
        padding: "50px",
        justifyContent: 'space-between'
    }
});

const Receipts = () => {

    const location = useLocation();
    const state = location.state as ReceiptProps;
    const { fundName, donationLunaAmount, donationEuroAmount, donationDate } = state;

    const date = new Date(parseInt(donationDate)/1000000).toLocaleDateString();
    const classes = useStyles();

    return (
        <Container className={classes.container}>
            <div className={classes.receiptHeader}>
                <h3>Thank you for your donation to {fundName}</h3>
            </div>
            <div className={classes.receiptInfo}>
                <div>
                    <p>
                        Date of Donation
                    </p>
                    <p>
                        {date}
                    </p>
                </div>
                <div>
                    <p>
                        Donation Value
                    </p>
                    <p>
                        {donationLunaAmount} [Luna], €{donationEuroAmount}
                    </p>
                </div>
            </div>
        </Container>
    )
}

export default Receipts;