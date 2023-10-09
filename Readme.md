## Uniswap V3 Staker Frontend

A frontend to be used to perform liquidity mining incentives via the [Uniswap V3 Staker Contract](https://github.com/Uniswap/uniswap-v3-staker).

### Example

This frontend was original used to build a frontend to be used to incentive liquidity mining of the Wrapped Witnet Token. The incentive program(s) use the [Uniswap V3 Staker Contract](https://github.com/Uniswap/uniswap-v3-staker) mentioned above.

## Getting started

#### Configuration

- Deploy the [staker contract](https://github.com/Uniswap/uniswap-v3-staker), and create a future incentive.
- Deploy the [subgraph](https://github.com/MchainNetwork/uniswap-v3-staker-subgraph) to index data.
- Update the config at `src/config.tsx` accordingly.

### Run

- Copy `.env.local.sample` to `.env.local` and configure.
- Run `make` to start the app.
- Visit the dapp at http://localhost:7373

## Stack

- [React](https://reactjs.org/)
- [Material UI](https://material-ui.com/)

## License

MIT
