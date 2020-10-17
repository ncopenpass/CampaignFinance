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
      "contributor_id": "8ce7bc9f-2c13-45ac-8395-3e46b4191490",
      "name": "John D. Smith II",
      "city": "Eden",
      "state": "NC",
      "zip_code": "27289-0590",
      "profession": "Property Management",
      "employer_name": "Self"
    },
    {
      "contributor_id": "eaf72678-370f-47cd-a826-69c050c9c689",
      "name": "JOHN J SMITH III",
      "city": "WINSTON-SALEM",
      "state": "NC",
      "zip_code": "27103",
      "profession": "PHYSICIAN",
      "employer_name": "NOVANT HEALTH UROLOGY PARTNERS"
    }
  ],
  "count": "3"
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
      "current_status": "Active (Non-Exempt)",
      "juris": null,
      "office": "Governor",
      "party": "Democratic",
      "committee_sboe_id": "STA-C0498N-C-002"
    }
  ],
  "count": "1"
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
    "current_status": "Active (Non-Exempt)",
    "juris": null,
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
      "account_code": "Not Available",
      "amount": 40,
      "candidate_or_referendum_name": null,
      "committee_sboe_id": "STA-C0498N-C-002",
      "contributor_id": "e0aaac84-867a-4d9e-b80e-25145e929eaf",
      "date_occurred": "2/11/20",
      "declaration": null,
      "form_of_payment": "Credit Card",
      "purpose": null,
      "report_name": "2020 First Quarter",
      "source_contribution_id": "0359bad6-d26c-4367-9546-5d939fd6c604",
      "transaction_type": "Individual"
    },
    {
      "account_code": "Not Available",
      "amount": 200,
      "candidate_or_referendum_name": null,
      "committee_sboe_id": "STA-C0498N-C-002",
      "contributor_id": "2423d2db-2dd1-493e-8bf6-d85a44c2a58d",
      "date_occurred": "5/20/19",
      "declaration": null,
      "form_of_payment": "Credit Card",
      "purpose": null,
      "report_name": "2019 Mid Year Semi-Annual",
      "source_contribution_id": "fe5b3577-567f-4813-991f-8fc63e60cd2c",
      "transaction_type": "Individual"
    }
  ],
  "count": "25059",
  "summary": {
    "sum": 7348500,
    "avg": 293.247912627501,
    "max": 158187,
    "count": 25059
  }
}
```

Example: `/api/candidate/177-AGM31F-C-001/contributions?toCSV=true`
response: A CSV file

When `toCSV` is true, the `offset` and `limit` will be ignored.
When `toCSV` is true, the endpoint will work as an `href` or with a `fetch` call. Using it as an `href` should automatically download it as a file

> "account_code","amount","candidate_or_referendum_name","committee_sboe_id","contributor_id","date_occurred","declaration","form_of_payment","purpose","report_name","source_contribution_id","transaction_type"
> "Not Available",60,,"177-AGM31F-C-001","c586843a-4be8-4d34-b50b-ae18922ee9fb","6/20/19",,"Credit Card",,"2019 Mid Year Semi-Annual","d3414cc1-2ca7-426d-8a6a-f8427a3b2947","Individual"
> "Not Available",250,,"177-AGM31F-C-001","03d76952-bb20-4b75-9f32-29c6d1ff6ad2","10/29/19",,"Check",,"2019 Year End Semi-Annual","ae30b904-d7d1-40bf-81b5-633d472b8e70","Non-Party Comm"
> "Not Available",100,,"177-AGM31F-C-001","b3488386-f0ca-4ae9-929d-6cfd86024026","10/29/19",,"Check",,"2019 Year End Semi-Annual","8c1875b1-6660-4e24-8e54-12bfe8891fb1","Individual"
> "Not Available",400,,"177-AGM31F-C-001","aaf94246-1448-44a6-b1dd-5548c23f3a7d","10/29/19",,"Check",,"2019 Year End Semi-Annual","ce993345-dd38-4610-ba29-fb343789e7ae","Outside Source"
> "Not Available",2000,,"177-AGM31F-C-001","64ef975f-01ae-4207-ad8f-6cb46c732957","7/1/19",,"Check",,"2019 Year End Semi-Annual","cf9be735-ef73-4f49-a024-0fa3c9c77321","Outstanding Loan"
> "Not Available",2000,,"177-AGM31F-C-001","64ef975f-01ae-4207-ad8f-6cb46c732957","7/1/19",,"Check",,"2019 Pre-Election","94ba281e-97ec-4593-9f81-86a074df1c09","Outstanding Loan"

## GET `/api/contributors/:contributorId/contributions`

Retrieve contributions for a contributor id.

Query Params (optional):

- `offset` default value `0`
- `limit` default value `50`

Example: `/api/contributors/2423d2db-2dd1-493e-8bf6-d85a44c2a58d/contributions?limit=2&offset=0`
response:

```json
{
  "data": [
    {
      "account_code": "Not Available",
      "amount": 250,
      "candidate_or_referendum_name": null,
      "committee_sboe_id": "STA-D34P1G-C-001",
      "contributor_id": "2423d2db-2dd1-493e-8bf6-d85a44c2a58d",
      "date_occurred": "11/20/19",
      "declaration": null,
      "form_of_payment": "Credit Card",
      "purpose": null,
      "report_name": "2019 Year End Semi-Annual",
      "source_contribution_id": "1223e0c7-05d3-411f-932f-d1ac90fde0b7",
      "transaction_type": "Individual"
    },
    {
      "account_code": "Not Available",
      "amount": 500,
      "candidate_or_referendum_name": null,
      "committee_sboe_id": "STA-D34P1G-C-001",
      "contributor_id": "2423d2db-2dd1-493e-8bf6-d85a44c2a58d",
      "date_occurred": "1/27/20",
      "declaration": null,
      "form_of_payment": "Credit Card",
      "purpose": null,
      "report_name": "2020 First Quarter",
      "source_contribution_id": "306a9814-876c-405b-9f53-9b0301d37bdb",
      "transaction_type": "Individual"
    }
  ],
  "count": "5"
}
```

## GET `/api/contributors/:year

Retrieve all contributors for a given year.

Query Params (optional):

- `offset` default value `0`
- `limit` default value `50`

Example: `/api/contributors/2019?limit=2&offset=1`
response:

```json
{
  "data": [
    {
      "contributor_id": "21fd4377-fe56-4889-accd-a0ef3a29f7b7",
      "name": "03RD CONGRESSIONAL DISTRICT REC",
      "city": "WASHINGTON",
      "state": "NC",
      "zip_code": "27889",
      "profession": null,
      "employer_name": null
    },
    {
      "contributor_id": "21fd4377-fe56-4889-accd-a0ef3a29f7b7",
      "name": "03RD CONGRESSIONAL DISTRICT REC",
      "city": "WASHINGTON",
      "state": "NC",
      "zip_code": "27889",
      "profession": null,
      "employer_name": null
    }
  ],
  "count": "183929"
}
```

## GET `/api/candidates/:year`

Get all candidates who received donations in a given year. Note that in rare cases, individuals have more than one candidacy. In that case, there will be unique entries returned for each candidacy/committee for that single individual.

Query Params (optional):

- `offset` default value `0`
- `limit` default value `50`

Example: `api/candidates/2020?limit=2&offset=0`
response:

```json
{
  "data": [
    {
      "sboe_id": "STA-C2342N-C-004",
      "candidate_last_name": "JONES",
      "candidate_first_name": "ABRAHAM",
      "candidate_middle_name": "PENN",
      "party": "Democratic",
      "office": "N.C. House",
      "candidate_full_name": "ABRAHAM PENN JONES",
      "candidate_first_last_name": "ABRAHAM JONES",
      "full_count": "523"
    },
    {
      "sboe_id": "STA-5JHUJB-C-001",
      "candidate_last_name": "ERICSON",
      "candidate_first_name": "ADAM",
      "candidate_middle_name": "FLETCHER",
      "party": "Democratic",
      "office": "N.C. House",
      "candidate_full_name": "ADAM FLETCHER ERICSON",
      "candidate_first_last_name": "ADAM ERICSON",
      "full_count": "523"
    }
  ],
  "count": "523"
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
        "candidate_first_last_name": "ROY COOPER",
        "candidate_first_name": "ROY",
        "candidate_full_name": "ROY A COOPER",
        "candidate_last_name": "COOPER",
        "candidate_middle_name": "A",
        "current_status": "Active (Non-Exempt)",
        "juris": null,
        "office": "Governor",
        "party": "Democratic",
        "committee_sboe_id": "STA-C0498N-C-002"
      }
    ],
    "count": "1"
  },
  "donors": {
    "data": [
      {
        "contributor_id": "7351285a-cce4-4dfd-aeee-bfc297ee8139",
        "name": "KAY COOPER",
        "city": "HILLSBOROUGH",
        "state": "NC",
        "zip_code": "27278",
        "profession": "RETIRED",
        "employer_name": "RETIRED"
      }
    ],
    "count": "1"
  },
  "pacs": {
    "data": [],
    "count": "0"
  }
}
```

## Error handling

By default, error messages are not passed to the client. For development though, you can get full error messages in response from API by adding `NODE_ENV=development` to the `.env` file in /server.
