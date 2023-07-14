
## ETAP Mock Rest API

Built with next [Nest](https://github.com/nestjs/nest) , TypeScript, PostGresSql.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev


```

## Databese config
```bash
config/typeorm.config.ts #mofidy accordingly
```

## Endpoints

```bash
-> Sign Up
-> Sign In 
-> Create Wallet
-> Get Wallet
-> Initiate Fund Wallet #link for payment and reference (NB: Save the reference)
-> Confirm Fund Wallet #Use for reference
-> Fund Webhook #can wok on test server
-> Wallet Transfer 
-> Confirm Wallet Transfer #for ADMIN to confirm transfer above 1000000
-> Get Pending Wallet Transfers
-> Get Report


postman collection included
```

## Support



## Stay in touch

- Developed By - [Olawale Ajala ](https://quadrillionx.com)

## License

Nest is [MIT licensed](LICENSE).
