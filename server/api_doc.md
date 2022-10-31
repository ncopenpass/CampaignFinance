# Endpoints

## GET `/api/search/contributors/:name`

Search for contributors by name. The search uses trigram fuzzy matching to find results and orders the results by the match similarity.

The `:name` parameter must be URIEncoded (ie: `encodeURIComponent`)

Query Params (optional):

- `offset` default value `0`
- `limit` default value `50`
- `sortBy` default value `sml`(similarity). Sort by `sml` or `name`. Prefix with `-` for `DESC` order
- `name` fuzzy match results on contributor name
- `profession` fuzzy match results on profession
- `cityState` fuzzy match results on city or state

Example: `/api/search/contributors/john%20smith?limit=2&offset=0`
response:

```json
{
  "data": [
    {
      "contributor_id": 219157,
      "name": "JOHN & EUNICE SMITH",
      "city": "EDEN",
      "state": "NC",
      "zipcode": "27289",
      "profession": "",
      "employer_name": ""
    },
    {
      "contributor_id": 215665,
      "name": "JOE SMITH",
      "city": "MOUNT OLIVE",
      "state": "NC",
      "zipcode": "28365",
      "profession": "ARCHITECTURAL ENGINEER",
      "employer_name": "SMITH ENGINEERING AND DESIGN PA"
    }
  ],
  "count": "47"
}
```

## GET `/api/search/candidates/:name`

Search for a candidate by name. The search uses trigram fuzzy matching to find results and orders the results by the match similarity.

The `:name` parameter must be URIEncoded (ie: `encodeURIComponent`)

Query Params (optional):

- `offset` default value `0`
- `limit` default value `50`
- `sortBy` default value `first_last_sml`(similarity). Sort by `first_last_sml` or `candidate_full_name`. Prefix with `-` for `DESC` order
- `name` fuzzy match results on candidate name
- `party` fuzzy match results on pary name
- `contest` fuzzy match on juris or office name

Example: `/api/search/candidates/roy%20cooper?limit=1&offset=0`
response:

```json
{
  "data": [
    {
      "candidate_first_last_name": "ROY COOPER",
      "candidate_first_name": "ROY",
      "candidate_full_name": "ROY A COOPER",
      "candidate_last_name": "COOPER",
      "candidate_middle_name": "A",
      "current_status": "Unknown",
      "juris": "",
      "office": "Governor",
      "party": "Democratic",
      "committee_sboe_id": "STA-C0498N-C-002"
    }
  ],
  "count": "1"
}
```

## GET `/api/search/committees/:name`

Search for a committee by name. The search uses trigram fuzzy matching to find results and orders the results by the match similarity.

The `:name` parameter must be URIEncoded (ie: `encodeURIComponent`)

Query Params (optional):

- `offset` default value `0`
- `limit` default value `50`
- `sortBy` default value `committee_name_sml`(similarity). Sort by `committee_name_sml` or `candidate_name`. Prefix with `-` for `DESC` order
- `name` fuzzy match results on committee name
- `party` fuzzy match results on pary name
- `contest` fuzzy match on juris or office name

Example: `/api/search/committees/cooper?limit=1&offset=0`
response:

```json
{
  "data": [
    {
      "committee_name": "COOPER FOR NORTH CAROLINA",
      "office": "Governor",
      "party": "Democratic",
      "committee_sboe_id": "STA-C0498N-C-002"
    },
    {
      "committee_name": "SCOTT COOPER FOR CONGRESS",
      "office": "NULL",
      "party": "NULL",
      "committee_sboe_id": "FED-H543YG-C-001"
    },
    {
      "committee_name": "NATIONAL RURAL ELECTRIC COOPERATIVE ASSOCIATION'S ACTION COMMITTEE FOR RURAL ELECTRIFICATION",
      "office": "NULL",
      "party": "NULL",
      "committee_sboe_id": "FED-I6M71S-C-001"
    },
    {
      "committee_name": "LINDA COOPER SUGGS FOR NC",
      "office": "NULL",
      "party": "NULL",
      "committee_sboe_id": "STA-6QD149-C-001"
    },
    {
      "committee_name": "NC ASSN OF ELECTRIC COOPERATIVES RURAL ELECTRIC ACTION PROGRAM",
      "office": "NULL",
      "party": "NULL",
      "committee_sboe_id": "STA-C3341N-C-001"
    },
    {
      "committee_name": "CAROLINA LINK TELEPHONE COOPERATIVE PAC",
      "office": "NULL",
      "party": "NULL",
      "committee_sboe_id": "STA-C3352N-C-001"
    },
    {
      "committee_name": "VOTE SAM COOPER",
      "office": "NULL",
      "party": "NULL",
      "committee_sboe_id": "STA-OY590I-C-001"
    },
    {
      "committee_name": "STANFORD FOR CLERK",
      "office": "Clerk of Superior Court",
      "party": "Democratic",
      "committee_sboe_id": "ORA-I2J52O-C-001"
    },
    {
      "committee_name": "JESSICA FOR CHAPEL HILL",
      "office": "Council Member",
      "party": "Democratic",
      "committee_sboe_id": "089-R9677W-C-001"
    }
  ],
  "count": "9"
}
```

## GET `/api/candidate/:ncsbeID`

Get a candidate and details about their committee

The `:ncsbeID` parameter must be URIEncoded (ie: `encodeURIComponent`)

Query Params (optional):

Example: `/api/candidate/STA-C0498N-C-002`
response:

```json
{
  "data": {
    "candidate_first_last_name": "ROY COOPER",
    "candidate_first_name": "ROY",
    "candidate_full_name": "ROY A COOPER",
    "candidate_last_name": "COOPER",
    "candidate_middle_name": "A",
    "current_status": "Unknown",
    "juris": "",
    "office": "Governor",
    "party": "Democratic",
    "committee_sboe_id": "STA-C0498N-C-002"
  }
}
```

## GET `/api/candidate/:ncsbeID/contributions`

Get a list of all contributions made to a candidate

The `:ncsbeID` parameter must be URIEncoded (ie: `encodeURIComponent`)

Query Params (optional):

- `offset` default value `0`
- `limit` default value `50`
- `toCSV` default value `false`
- `sortBy` sort by `name`, `amount` or `date_occurred`. Prefix with `-` for `DESC` order
- `name` fuzzy match results on contributor name
- `transaction_type` exact match
- `amount` exact match
- `amount_lte` match results with `amount` less than and equal to the provided amount
- `amount_gte` match results with `amount` greater than and equal to the provided amount
- `form_of_payment` exact match
- `date_occurred_gte` match results with `date_occurred` greater than and equal to the provided date (`1/1/2020`)
- `date_occurred_lte` match results with `date_occurred` greater than and equal to the provided date (`1/1/2020`)
- `year` match results with `date_occured` containing provided year

Example: `/api/candidate/STA-C0498N-C-002/contributions?limit=2`
response:

```json
{
  "data": [
    {
      "contributor_id": 21907,
      "name": "ANN M. ZIELINSKI",
      "city": "ENDICOTT",
      "state": "NY",
      "zipcode": "13760",
      "profession": "HOMEMAKER",
      "employer_name": "RETIRED",
      "account_code": "NOT AVAILABLE",
      "amount": 25,
      "candidate_referendum_name": "",
      "committee_sboe_id": "STA-C0498N-C-002",
      "date_occurred": "2020-02-19T05:00:00.000Z",
      "declaration": "",
      "form_of_payment": "CHECK",
      "purpose": "",
      "report_name": "2020 SECOND QUARTER (AMENDMENT)",
      "transaction_type": "INDIVIDUAL"
    },
    {
      "contributor_id": 3494,
      "name": "AGGREGATED INDIVIDUAL CONTRIBUTION",
      "city": "",
      "state": "",
      "zipcode": "",
      "profession": "",
      "employer_name": "",
      "account_code": "NOT AVAILABLE",
      "amount": 50,
      "candidate_referendum_name": "",
      "committee_sboe_id": "STA-C0498N-C-002",
      "date_occurred": "2020-08-15T04:00:00.000Z",
      "declaration": "",
      "form_of_payment": "CREDIT CARD",
      "purpose": "",
      "report_name": "2020 THIRD QUARTER",
      "transaction_type": "INDIVIDUAL"
    }
  ],
  "count": "135057",
  "summary": {
    "sum": 37950100,
    "avg": 281.041759813853,
    "max": 3500000,
    "count": 135057,
    "aggregated_contributions_count": "0",
    "aggregated_contributions_sum": null
  }
}
```

Example: `/api/candidate/177-AGM31F-C-001/contributions?toCSV=true`
response: A CSV file

When `toCSV` is true, the `offset` and `limit` will be ignored.
When `toCSV` is true, the endpoint will work as an `href` or with a `fetch` call. Using it as an `href` should automatically download it as a file

> "contributor_id","name","city","state","zipcode","profession","employer_name","account_code","amount","candidate_referendum_name","committee_sboe_id","date_occurred","declaration","form_of_payment","purpose","report_name","transaction_type"
> 21907,"ANN M. ZIELINSKI","ENDICOTT","NY","13760","HOMEMAKER","RETIRED","NOT AVAILABLE",25,"","STA-C0498N-C-002","2020-02-19T05:00:00.000Z","","CHECK","","2020 SECOND QUARTER (AMENDMENT)","INDIVIDUAL"
> 3494,"AGGREGATED INDIVIDUAL CONTRIBUTION","","","","","","NOT AVAILABLE",50,"","STA-C0498N-C-002","2020-08-15T04:00:00.000Z","","CREDIT CARD","","2020 THIRD QUARTER","INDIVIDUAL"
> 3494,"AGGREGATED INDIVIDUAL CONTRIBUTION","","","","","","NOT AVAILABLE",50,"","STA-C0498N-C-002","2020-08-15T04:00:00.000Z","","CREDIT CARD","","2020 THIRD QUARTER","INDIVIDUAL"
> 3494,"AGGREGATED INDIVIDUAL CONTRIBUTION","","","","","","NOT AVAILABLE",50,"","STA-C0498N-C-002","2020-08-15T04:00:00.000Z","","CREDIT CARD","","2020 THIRD QUARTER","INDIVIDUAL"
> 3494,"AGGREGATED INDIVIDUAL CONTRIBUTION","","","","","","NOT AVAILABLE",50,"","STA-C0498N-C-002","2020-08-15T04:00:00.000Z","","CREDIT CARD","","2020 THIRD QUARTER","INDIVIDUAL"
> 3494,"AGGREGATED INDIVIDUAL CONTRIBUTION","","","","","","NOT AVAILABLE",50,"","STA-C0498N-C-002","2020-08-15T04:00:00.000Z","","CREDIT CARD","","2020 THIRD QUARTER","INDIVIDUAL"

## GET `/api/committee/:ncsbeID`

Get a candidate and non-candidate political action committees (PAC) and details about the committees

The `:ncsbeID` parameter must be URIEncoded (ie: `encodeURIComponent`)

Query Params (optional):

Candidate Committee Example: `/api/candidate/STA-C0498N-C-002`

Non-candidate Committee Example: `/api/committee/STA-29M3E4-C-001`

Candidate Committee response:

```json
{
  "data": {
    "candidate_first_last_name": "ROY COOPER",
    "candidate_first_name": "ROY",
    "candidate_full_name": "ROY A COOPER",
    "candidate_last_name": "COOPER",
    "candidate_middle_name": "A",
    "current_status": "Unknown",
    "juris": "",
    "office": "Governor",
    "party": "Democratic",
    "committee_sboe_id": "STA-C0498N-C-002"
  }
}
```

Non-Candidate Committee response:

```json
{
  "data": {
    "committee_name": "NC DEMOCRATIC LEADERSHIP COMMITTEE (NCDLC)",
    "office": NULL,
    "party": "Democratic",
    "committee_sboe_id": "STA-29M3E4-C-001",
    "city": "RALEIGH",
    "state": "NC"
  }
}
```

## GET `/committee/:ncsbeID/contributions/years`

Get the years that a committee has received contributions

Example: `/api/committee/STA-29M3E4-C-001/contributions/years`

response:

status code: 200

```json
{
  "data": {
    "years": [2021, 2020, 2019, 2018],
    "count": 4
  }
}
```

## GET `/candidate/:ncsbeID/contributions/years`

Get the years that an individual candidate received contributions

Example: `/api/candidate/177-AGM31F-C-001/contributions/years`

response:

status code: 200

```json
{
  "data": {
    "years": [2021, 2020, 2019, 2018],
    "count": 4
  }
}
```

## GET `/api/contributor/:contributorId/contributions`

Retrieve contributions for a contributor id.

Query Params (optional):

- `offset` default value `0`
- `limit` default value `50`
- `toCSV` default value `false`
- `date_occurred_gte` match results with `date_occurred` greater than and equal to the provided date
- `date_occurred_lte` match results with `date_occurred` greater than and equal to the provided date
- `year` match results with `date_occured` containing provided year

Example: `/api/contributor/5123/contributions?limit=2&offset=0`
response:

```json
{
  "data": [
    {
      "account_code": "NOT AVAILABLE",
      "amount": 250,
      "candidate_referendum_name": "",
      "committee_sboe_id": "STA-42T4MV-C-001",
      "contributor_id": 5123,
      "date_occurred": "2020-06-18T04:00:00.000Z",
      "declaration": "",
      "form_of_payment": "ELECTRONIC FUNDS TRANSFER",
      "purpose": "",
      "report_name": "2020 SECOND QUARTER (AMENDMENT)",
      "transaction_type": "INDIVIDUAL",
      "candidate_full_name": "CECELIA DULA SURRATT",
      "committee_name": "COMMITTEE TO ELECT CECELIA SURRATT- HOUSE 86 REPRESENTATIVE",
      "total_contributions_to_committee": 250
    }
  ],
  "count": "1"
}
```

Example: `/api/contributor/2423d2db-2dd1-493e-8bf6-d85a44c2a58d/contributions?toCSV=true`  
response:

```CSV
{
  "data": [
    {
      "account_code": "NOT AVAILABLE",
      "amount": 0.17,
      "candidate_referendum_name": "",
      "committee_sboe_id": "STA-C3372N-C-001",
      "contributor_id": 3494,
      "date_occurred": "2019-01-02T05:00:00.000Z",
      "declaration": "",
      "form_of_payment": "",
      "purpose": "",
      "report_name": "2019 MID YEAR SEMI-ANNUAL",
      "transaction_type": "INDIVIDUAL",
      "candidate_full_name": "NULL NULL NULL",
      "committee_name": "NCAE PAC",
      "total_contributions_to_committee": 91785.4
    },
    {
      "account_code": "NOT AVAILABLE",
      "amount": 0.17,
      "candidate_referendum_name": "",
      "committee_sboe_id": "STA-C3372N-C-001",
      "contributor_id": 3494,
      "date_occurred": "2019-01-02T05:00:00.000Z",
      "declaration": "",
      "form_of_payment": "",
      "purpose": "",
      "report_name": "2019 MID YEAR SEMI-ANNUAL",
      "transaction_type": "INDIVIDUAL",
      "candidate_full_name": "NULL NULL NULL",
      "committee_name": "NCAE PAC",
      "total_contributions_to_committee": 91785.4
    }
  ],
  "count": "1076394"
}
```

## GET `/api/contributor/:contributorId`

Get an individual contributor by ID

Example: `/api/contributor/8ce7bc9f-2c13-45ac-8395-3e46b4191490`

response:

status code: 200

```json
{
  "data": {
    "contributor_id": 5123,
    "name": "AL BACCHI",
    "city": "MORGANTON",
    "state": "NC",
    "zipcode": "28655",
    "profession": "BANKER",
    "employer_name": "REGIONS BANK"
  }
}
```

If the contributor id is not found, the `data` field will be `null` and the response code will be `404`

Example: `/api/contributor/0`

status code: 404

```json
{
  "data": null
}
```

## GET `/contributor/:ncsbeID/contributions/years`

Get an individual's years contributed

Example: `/api/contributor/8ce7bc9f-2c13-45ac-8395-3e46b4191490/contributions/years`

response:

status code: 200

```json
{
  "data": {
    "years": [2021, 2020, 2019, 2018],
    "count": 4
  }
}
```

## GET `/api/expenditures/:ncsbeID`

Get a list of expenditures associated with an ncbseID

The `:ncsbeID` parameter must be URIEncoded (ie: `encodeURIComponent`)

Query Params (optional):

- `offset` default value `0`
- `limit` default value `50`
- `sortBy` sort by `amount` or `date_occurred`. Prefix with `-` for `DESC` order
- `date_occurred_gte` match results with `date_occurred` greater than and equal to the provided date
- `date_occurred_lte` match results with `date_occurred` greater than and equal to the provided date
- `year` match results with `date_occured` containing provided year

Example: `/api/expenditures/STA-C0498N-C-002?limit=3&sortBy=-amount`
response:

```json
{
  "data": [
    {
      "date_occurred": "2020-08-21T04:00:00.000Z",
      "form_of_payment": "DRAFT",
      "transaction_type": "LOAN REPAYMENT",
      "purpose": "",
      "amount": 9206.08
    },
    {
      "date_occurred": "2018-11-29T05:00:00.000Z",
      "form_of_payment": "DEBIT CARD",
      "transaction_type": "OPERATING EXP",
      "purpose": "PUSH CARDS",
      "amount": 2487.76
    },
    {
      "date_occurred": "2017-08-14T04:00:00.000Z",
      "form_of_payment": "CHECK",
      "transaction_type": "OPERATING EXP",
      "purpose": "T-SHIRTS",
      "amount": 1545.21
    }
  ],
  "count": "178"
}
```

## Error handling

By default, error messages are not passed to the client. For development though, you can get full error messages in response from API by adding `NODE_ENV=development` to the `.env` file in /server.
