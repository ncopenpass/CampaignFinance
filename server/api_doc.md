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
      "id": "eaf72678-370f-47cd-a826-69c050c9c689",
      "name": "JOHN J SMITH III",
      "city": "WINSTON-SALEM",
      "state": "NC",
      "zip_code": "27103",
      "profession": "PHYSICIAN",
      "employer_name": "NOVANT HEALTH UROLOGY PARTNERS",
      "sml": 0.6875
    },
    {
      "id": "ce69d5a5-3724-4497-b554-15c4a9bd5c1c",
      "name": "JOHN SMITH",
      "city": "RALEIGH",
      "state": "NC",
      "zip_code": "27615",
      "profession": "CHIROPRACTOR",
      "employer_name": "SELF EMPLOYED",
      "sml": 1
    }
  ],
  "count": 2
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
      "sboe_id": "STA-C0498N-C-002",
      "current_status": "Active (Non-Exempt)",
      "committee_name": "COOPER FOR NORTH CAROLINA",
      "committee_type": "Candidate Committee",
      "committee_street_1": "434 FAYETTEVILLE ST   SUITE 2020",
      "committee_street_2": null,
      "committee_city": "RALEIGH",
      "committee_state": "NC",
      "committee_full_zip": "27601",
      "candidate_first_name": "ROY",
      "candidate_middle_name": "A",
      "candidate_last_name": "COOPER",
      "treasurer_first_name": "JAMES",
      "treasurer_middle_name": "B",
      "treasurer_last_name": "STEPHENSON",
      "treasurer_email": "JBS@STEPHENSON-LAW.COM",
      "asst_treasurer_first_name": null,
      "asst_treasurer_middle_name": null,
      "asst_treasurer_last_name": null,
      "asst_treasurer_email": null,
      "treasurer_street_1": "434 FAYETTEVILLE ST.   SUITE 2020",
      "treasurer_street_2": null,
      "treasurer_city": "RALEIGH",
      "treasurer_state": "NC",
      "treasurer_full_zip": "27601",
      "party": "Democratic",
      "office": "Governor",
      "juris": null,
      "candidate_full_name": "ROY A COOPER",
      "candidate_first_last_name": "ROY COOPER",
      "first_last_sml": 1,
      "full_name_sml": 0.846154
    }
  ],
  "count": 1
}
```

## GET `/api/candidate/:ncsbeID`

Get a candidate and a list of contributions made to them

The `:ncsbeID` parameter must be URIEncoded (ie: `encodeURIComponent`)

Query Params (optional):

- `offset` default value `0`
- `limit` default value `50`

Example: `/api/candidate/STA-C0498N-C-002?limit=2`
response:

```json
{
  "data": [
    {
      "sboe_id": "STA-C0498N-C-002",
      "current_status": "Active (Non-Exempt)",
      "committee_name": "COOPER FOR NORTH CAROLINA",
      "committee_type": "Candidate Committee",
      "committee_street_1": "434 FAYETTEVILLE ST   SUITE 2020",
      "committee_street_2": null,
      "committee_city": "RALEIGH",
      "committee_state": "NC",
      "committee_full_zip": "27601",
      "candidate_first_name": "ROY",
      "candidate_middle_name": "A",
      "candidate_last_name": "COOPER",
      "treasurer_first_name": "JAMES",
      "treasurer_middle_name": "B",
      "treasurer_last_name": "STEPHENSON",
      "treasurer_email": "JBS@STEPHENSON-LAW.COM",
      "asst_treasurer_first_name": null,
      "asst_treasurer_middle_name": null,
      "asst_treasurer_last_name": null,
      "asst_treasurer_email": null,
      "treasurer_street_1": "434 FAYETTEVILLE ST.   SUITE 2020",
      "treasurer_street_2": null,
      "treasurer_city": "RALEIGH",
      "treasurer_state": "NC",
      "treasurer_full_zip": "27601",
      "party": "Democratic",
      "office": "Governor",
      "juris": null,
      "candidate_full_name": "ROY A COOPER",
      "candidate_first_last_name": "ROY COOPER",
      "source_contribution_id": "27d1b119-ab89-4e9d-b2d6-f934e1220a5e",
      "contributor_id": "5f924058-28e8-40f9-9440-89d69a231109",
      "transaction_type": "Individual",
      "committee_sboe_id": "STA-C0498N-C-002",
      "committee_zip_code": "27601",
      "report_name": "2019 Year End Semi-Annual",
      "date_occurred": "10/10/19",
      "account_code": "Not Available",
      "amount": 20,
      "form_of_payment": "Check",
      "purpose": null,
      "candidate_or_referendum_name": null,
      "declaration": null,
      "full_count": "25059"
    },
    {
      "sboe_id": "STA-C0498N-C-002",
      "current_status": "Active (Non-Exempt)",
      "committee_name": "COOPER FOR NORTH CAROLINA",
      "committee_type": "Candidate Committee",
      "committee_street_1": "434 FAYETTEVILLE ST   SUITE 2020",
      "committee_street_2": null,
      "committee_city": "RALEIGH",
      "committee_state": "NC",
      "committee_full_zip": "27601",
      "candidate_first_name": "ROY",
      "candidate_middle_name": "A",
      "candidate_last_name": "COOPER",
      "treasurer_first_name": "JAMES",
      "treasurer_middle_name": "B",
      "treasurer_last_name": "STEPHENSON",
      "treasurer_email": "JBS@STEPHENSON-LAW.COM",
      "asst_treasurer_first_name": null,
      "asst_treasurer_middle_name": null,
      "asst_treasurer_last_name": null,
      "asst_treasurer_email": null,
      "treasurer_street_1": "434 FAYETTEVILLE ST.   SUITE 2020",
      "treasurer_street_2": null,
      "treasurer_city": "RALEIGH",
      "treasurer_state": "NC",
      "treasurer_full_zip": "27601",
      "party": "Democratic",
      "office": "Governor",
      "juris": null,
      "candidate_full_name": "ROY A COOPER",
      "candidate_first_last_name": "ROY COOPER",
      "source_contribution_id": "3e7e64fa-bd88-4fdb-9db7-c7f7f7a4726b",
      "contributor_id": "5ff15dd8-f49e-4571-a0af-df8284705374",
      "transaction_type": "Individual",
      "committee_sboe_id": "STA-C0498N-C-002",
      "committee_zip_code": "27601",
      "report_name": "2019 Year End Semi-Annual",
      "date_occurred": "10/10/19",
      "account_code": "Not Available",
      "amount": 50,
      "form_of_payment": "Check",
      "purpose": null,
      "candidate_or_referendum_name": null,
      "declaration": null,
      "full_count": "25059"
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
      "source_contribution_id": "d418ce8e-b2b4-4cf0-b1f9-ad72a4cceb7d",
      "contributor_id": "2423d2db-2dd1-493e-8bf6-d85a44c2a58d",
      "transaction_type": "Individual",
      "committee_name": "JUSTICE MARK DAVIS COMMITTEE",
      "committee_sboe_id": "STA-196F43-C-002",
      "committee_street_1": "PO BOX 807",
      "committee_street_2": null,
      "committee_city": "RALEIGH",
      "committee_state": "NC",
      "committee_zip_code": "27602",
      "report_name": "2019 Mid Year Semi-Annual (Amendment)",
      "date_occurred": "6/27/19",
      "account_code": "Not Available",
      "amount": 500,
      "form_of_payment": "Credit Card",
      "purpose": null,
      "candidate_or_referendum_name": null,
      "declaration": null,
      "full_count": "2"
    },
    {
      "source_contribution_id": "e7f83a5e-c948-4d4f-a151-fd91d18143c7",
      "contributor_id": "2423d2db-2dd1-493e-8bf6-d85a44c2a58d",
      "transaction_type": "Individual",
      "committee_name": "JOSH STEIN FOR ATTORNEY GENERAL",
      "committee_sboe_id": "STA-WP1LKA-C-001",
      "committee_street_1": "434 FAYETTEVILLE STREET, SUITE 2020",
      "committee_street_2": null,
      "committee_city": "RALEIGH",
      "committee_state": "NC",
      "committee_zip_code": "27601",
      "report_name": "2019 Year End Semi-Annual",
      "date_occurred": "8/1/19",
      "account_code": "Not Available",
      "amount": 500,
      "form_of_payment": "Credit Card",
      "purpose": null,
      "candidate_or_referendum_name": null,
      "declaration": null,
      "full_count": "2"
    },
    "count": "2"
  ]
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
      "id": "146755ab-c8b9-4b7d-8ba8-81d66bd725e1",
      "name": ".PAM MINSHEW",
      "city": "PRINCETON",
      "state": "NC",
      "zip_code": "27569-7117",
      "profession": "RETIRED",
      "employer_name": null,
      "source_contribution_id": "e8864a3e-a22a-4056-b592-6e4677901f9d",
      "contributor_id": "146755ab-c8b9-4b7d-8ba8-81d66bd725e1",
      "transaction_type": "Individual",
      "committee_name": "WAYNE DEC",
      "committee_sboe_id": "STA-C3941N-C-001",
      "committee_street_1": "PO BOX 2024",
      "committee_street_2": null,
      "committee_city": "GOLDSBORO",
      "committee_state": "NC",
      "committee_zip_code": "27533",
      "report_name": "2019 Mid Year Semi-Annual (Amendment)",
      "date_occurred": "2/20/19",
      "account_code": "Not Available",
      "amount": 100,
      "form_of_payment": "Check",
      "purpose": null,
      "candidate_or_referendum_name": null,
      "declaration": null,
      "full_count": "133614"
    },
    {
      "id": "21fd4377-fe56-4889-accd-a0ef3a29f7b7",
      "name": "03RD CONGRESSIONAL DISTRICT REC",
      "city": "WASHINGTON",
      "state": "NC",
      "zip_code": "27889",
      "profession": null,
      "employer_name": null,
      "source_contribution_id": "1b69b74a-c594-43bf-a8a0-3239c7fb7179",
      "contributor_id": "21fd4377-fe56-4889-accd-a0ef3a29f7b7",
      "transaction_type": "Party Comm",
      "committee_name": "CRAVEN RBF",
      "committee_sboe_id": "STA-13Y14M-C-001",
      "committee_street_1": "P O BOX 13466",
      "committee_street_2": null,
      "committee_city": "NEW BERN",
      "committee_state": "NC",
      "committee_zip_code": "28561",
      "report_name": "2019 Year End Semi-Annual",
      "date_occurred": "9/27/19",
      "account_code": "Not Available",
      "amount": 500,
      "form_of_payment": "Check",
      "purpose": null,
      "candidate_or_referendum_name": null,
      "declaration": null,
      "full_count": "133614"
    }
  ],
  "count": "133614"
}
```
