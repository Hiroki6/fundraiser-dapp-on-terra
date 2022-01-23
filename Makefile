deploy:
	terrain deploy fundraiser --signer validator

initiate:
	terrad tx wasm instantiate 1 '{"name": "fundraiser", "symbol": "fundraiser"}' --from test1 --chain-id=localterra --fees=10000uluna --gas=auto --broadcast-mode=block
