import './App.css'

import { useEffect } from 'react'
import {
    useConnectedWallet,
} from '@terra-money/wallet-provider'

import { BrowserRouter as Router, NavLink, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import { AppBar, makeStyles, Toolbar, Typography } from "@material-ui/core";
import {ConnectWallet} from "./components/ConnectWallet";
import Receipts from "./pages/Receipts";

const useStyles = makeStyles({
    navLink: {
        color: '#1a237e',
        textDecoration: 'none',
        marginRight: '15px'
    }
})

function App() {
    const connectedWallet = useConnectedWallet()

    const classes = useStyles();

    useEffect(() => {
    }, [connectedWallet])

    return (
        <Router>
            <AppBar position="static" color="default" style={{ margin: 0 }}>
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        <NavLink className={classes.navLink} to="/">Home</NavLink>
                    </Typography>
                    <Typography variant="h6" color="inherit">
                        <NavLink className={classes.navLink} to="/new">New</NavLink>
                    </Typography>
                    <ConnectWallet />
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/" element={Home()}>
                </Route>
                <Route path="/new" element={New()}>
                </Route>
                <Route path="/receipts" element={<Receipts />}>
                </Route>
                <Route path="*">{() => <p>404 Page</p>}</Route>
            </Routes>
        </Router>
    )
}

export default App
