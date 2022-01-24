import {Fundraiser} from "../util/factoryHelper";
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    makeStyles,
    Typography
} from "@material-ui/core";

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

    return (
        <Container>
            <Card className={classes.card}>
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