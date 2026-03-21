# O.S.P. Portal — OpenSourcePatents Civic Intelligence Network

Mission control dashboard linking to all OpenSourcePatents civic intelligence tools.

## Apps

|Module             |Description                                                               |Status        |
|-------------------|--------------------------------------------------------------------------|--------------|
|DOCKWATCH          |Community port intelligence — anonymous trafficking/exploitation reporting|Deploy Pending|
|SENTINEL           |Government accountability & corruption detection                          |Deploy Pending|
|NARC               |Opioid crisis geospatial intelligence                                     |Deploy Pending|
|CONGRESSWATCH      |Congressional anomaly scoring                                             |Deploy Pending|
|CANAAN ROAD WATCH  |Citizen road accountability — Canaan, NH                                  |Deploy Pending|
|CANAAN BUDGET WATCH|Town budget transparency — Canaan, NH                                     |Deploy Pending|

## Deploy

```bash
npm install
npm run dev      # local dev at localhost:3000
```

Push to GitHub → connect repo to Vercel → auto-deploys.

## Update App URLs

Edit the `APPS` array in `app/page.js` — replace `url: null` with the live URL for each app as you deploy them.

## License

CC0 Public Domain — OpenSourcePatents
