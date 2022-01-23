optimize:
	cd contracts/fundraiser && cargo wasm && cargo schema
	cd contracts/fundraiser-factory && cargo wasm && cargo schema
	docker run --rm -v "$$(pwd)":/code --mount type=volume,source="$$(basename "$$(pwd)")_cache",target=/code/target --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/workspace-optimizer:0.12.4
	cp artifacts/fundraiser.wasm contracts/fundraiser/artifacts
	cp artifacts/fundraiser_factory.wasm contracts/fundraiser-factory/artifacts

deploy/fandraiser:
	terrain code:store fundraiser --signer validator --no-rebuild

deploy/factory:
	terrain code:store fundraiser-factory --signer validator --no-rebuild

initiate/factory:
	terrain task:run sync-fundraiser-code-id
	terrain contract:instantiate fundraiser-factory --code-id $(CODE_ID) --signer validator
