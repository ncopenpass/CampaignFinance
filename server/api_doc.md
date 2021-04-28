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
- `form_of_payment` exact match
- `date_occurred_gte` match results with `date_occurred` greater than and equal to the provided date (`1/1/2020`)
- `date_occurred_lte` match results with `date_occurred` greater than and equal to the provided date (`1/1/2020`)

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

Candidate Committee Example: `/api/candidate/STA-C0498N-C-002

Non-candidate Committee Example: `/api/committee/###`

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
    "committee_name": "COMMITTEE NAME",
    "office": NULL,
    "party": NULL,
    "committee_sboe_id": "SBOE-ID",
    "city": "CITY",
    "state": "STATE"
  }
}
```

## GET `/api/contributor/:contributorId/contributions`

Retrieve contributions for a contributor id.

Query Params (optional):

- `offset` default value `0`
- `limit` default value `50`
- `toCSV` default value `false`

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

## GET `/api/search/candidates-donors-pacs/:name`

Search for candidates, donors, and PACs by name.

Query Params (optional):

- `limit` default value `50`

Example: `/api/search/candidates-donors-pacs/cooper?limit=1`

response:

```json
{
  "candidates": {
    "data": [
      {
        "candidate_first_last_name": "JAMES STANFORD",
        "candidate_first_name": "JAMES",
        "candidate_full_name": "JAMES COOPER STANFORD",
        "candidate_last_name": "STANFORD",
        "candidate_middle_name": "COOPER",
        "current_status": "Unknown",
        "juris": "COUNTY",
        "office": "Clerk of Superior Court",
        "party": "Democratic",
        "committee_sboe_id": "ORA-I2J52O-C-001"
      }
    ],
    "count": "3"
  },
  "donors": {
    "data": [
      {
        "contributor_id": 335348,
        "name": "NORTH CAROLINA ASSOCIATION OF ELECTRIC COOPERATIVES RURAL ELECTRIC ACTION PROGRAM",
        "city": "RALEIGH",
        "state": "NC",
        "zipcode": "27611-6566",
        "profession": "",
        "employer_name": ""
      }
    ],
    "count": "780"
  },
  "pacs": {
    "data": [],
    "count": "0"
  }
}
```

## Error handling

By default, error messages are not passed to the client. For development though, you can get full error messages in response from API by adding `NODE_ENV=development` to the `.env` file in /server.
