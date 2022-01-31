# Fundraiser on LUNA
This is a Dapp on Luna of the fundraiser Dapp of [this book](https://www.oreilly.com/library/view/hands-on-smart-contract/9781492045250/).

The original implementation on Ethereum is in [this repository](https://github.com/RedSquirrelTech/hoscdev/tree/master/chapter-10%2B11).

# Deployment

__Important__: Before you deploy the contracts and run this Dapp locally, [LocalTerra](https://github.com/terra-money/LocalTerra) need to be run.

```shell
make wasm-build
make deploy/fundraiser
make deploy/factory
make CODE_ID=${code_id} initiate/factory
```

# Run app

```shell
cd frontend
npm run start
```