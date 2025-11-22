# NotateQ Frontend Repo

## Project Setup

Download or clone this repo:

```sh
git clone git@github.com:LukiBert/NotateQ-frontend.git
```

And run the following commands:

```sh
yarn
yarn dev

yarn build
```

### Other

- IDE VSCode + Volar
- Package Manager: yarn

### Creating `.env` file
Create `.env` file in the `NotateQ-frontend` directory with following variables:\
`VITE_STRIPE_PUBLISHABLE_KEY` your **Stripe publishable key** (starts with `pk_test_...`). You can find it in the Stripe Dashboard under Developers → API keys. This key is required for the frontend to initialize Stripe and handle payment forms.

