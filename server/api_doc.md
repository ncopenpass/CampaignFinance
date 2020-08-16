# Endpoints

## GET `/api/search/contributors/:name`

Search for contributors by name. The search uses trigram fuzzy matching to find results and orders the results by the match similarity.

The `:name` parameter must be URIEncoded (ie: `encodeURIComponent`)

Query Params (optional):

- `offset` default value `0`
- `limit` default value `50`

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
  "count": "25059"
}
```

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
