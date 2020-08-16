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

Get a candidate and details about their committee

The `:ncsbeID` parameter must be URIEncoded (ie: `encodeURIComponent`)

Query Params (optional):

Example: `/api/candidate/STA-C0498N-C-002`
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
      "candidate_first_last_name": "ROY COOPER"
    }
  ],
  "count": "1"
}
```

## GET `/api/candidate/:ncsbeID/contributions`

Get a list of all contributions made to a candidate

The `:ncsbeID` parameter must be URIEncoded (ie: `encodeURIComponent`)

Query Params (optional):

- `offset` default value `0`
- `limit` default value `50`
- `toCSV` default value `false`

Example: `/api/candidate/STA-C0498N-C-002/contributions?limit=2`
response:

```json
{
  "data": [
    {
      "full_count": "25059",
      "source_contribution_id": "0359bad6-d26c-4367-9546-5d939fd6c604",
      "contributor_id": "e0aaac84-867a-4d9e-b80e-25145e929eaf",
      "transaction_type": "Individual",
      "committee_sboe_id": "STA-C0498N-C-002",
      "report_name": "2020 First Quarter",
      "date_occurred": "2/11/20",
      "account_code": "Not Available",
      "amount": 40,
      "form_of_payment": "Credit Card",
      "purpose": null,
      "candidate_or_referendum_name": null,
      "declaration": null,
      "id": "e0aaac84-867a-4d9e-b80e-25145e929eaf",
      "name": "SANDRA ACKERMAN",
      "city": "DURHAM",
      "state": "NC",
      "zip_code": "27701",
      "profession": "WRITER",
      "employer_name": "SELF"
    },
    {
      "full_count": "25059",
      "source_contribution_id": "fe5b3577-567f-4813-991f-8fc63e60cd2c",
      "contributor_id": "2423d2db-2dd1-493e-8bf6-d85a44c2a58d",
      "transaction_type": "Individual",
      "committee_sboe_id": "STA-C0498N-C-002",
      "report_name": "2019 Mid Year Semi-Annual",
      "date_occurred": "5/20/19",
      "account_code": "Not Available",
      "amount": 200,
      "form_of_payment": "Credit Card",
      "purpose": null,
      "candidate_or_referendum_name": null,
      "declaration": null,
      "id": "2423d2db-2dd1-493e-8bf6-d85a44c2a58d",
      "name": "Reid Acree Jr",
      "city": "Salisbury",
      "state": "NC",
      "zip_code": "28144-2717",
      "profession": "Attorney",
      "employer_name": "M. Reid Acree Jr. attorney at law"
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

> "full_count","source_contribution_id","contributor_id","transaction_type","committee_sboe_id","report_name","date_occurred","account_code","amount","form_of_payment","purpose","candidate_or_referendum_name","declaration","id","name","city","state","zip_code","profession","employer_name"
> "6","cf9be735-ef73-4f49-a024-0fa3c9c77321","64ef975f-01ae-4207-ad8f-6cb46c732957","Outstanding Loan","177-AGM31F-C-001","2019 Year End Semi-Annual","7/1/19","Not Available",2000,"Check",,,,"64ef975f-01ae-4207-ad8f-6cb46c732957","CHARLES DINGEE","GARNER","NC","27529","SELF GPS TRACKING",
> "6","d3414cc1-2ca7-426d-8a6a-f8427a3b2947","c586843a-4be8-4d34-b50b-ae18922ee9fb","Individual","177-AGM31F-C-001","2019 Mid Year Semi-Annual","6/20/19","Not Available",60,"Credit Card",,,,"c586843a-4be8-4d34-b50b-ae18922ee9fb","BRENNAN BROOKS","CARY","NC","27518","ATTORNEY","LAW OFFICE OF B TYLER BROOKS, PLLC"
> "6","94ba281e-97ec-4593-9f81-86a074df1c09","64ef975f-01ae-4207-ad8f-6cb46c732957","Outstanding Loan","177-AGM31F-C-001","2019 Pre-Election","7/1/19","Not Available",2000,"Check",,,,"64ef975f-01ae-4207-ad8f-6cb46c732957","CHARLES DINGEE","GARNER","NC","27529","SELF GPS TRACKING",
> "6","ae30b904-d7d1-40bf-81b5-633d472b8e70","03d76952-bb20-4b75-9f32-29c6d1ff6ad2","Non-Party Comm","177-AGM31F-C-001","2019 Year End Semi-Annual","10/29/19","Not Available",250,"Check",,,,"03d76952-bb20-4b75-9f32-29c6d1ff6ad2","JOHN HARDISTER FOR NC HOUSE","GREENSBORO","NC","27404",,
> "6","8c1875b1-6660-4e24-8e54-12bfe8891fb1","b3488386-f0ca-4ae9-929d-6cfd86024026","Individual","177-AGM31F-C-001","2019 Year End Semi-Annual","10/29/19","Not Available",100,"Check",,,,"b3488386-f0ca-4ae9-929d-6cfd86024026","CAROL JONES","RALEIGH","NC","27615","RETIRED",
> "6","ce993345-dd38-4610-ba29-fb343789e7ae","aaf94246-1448-44a6-b1dd-5548c23f3a7d","Outside Source","177-AGM31F-C-001","2019 Year End Semi-Annual","10/29/19","Not Available",400,"Check",,,,"aaf94246-1448-44a6-b1dd-5548c23f3a7d","REPUBLICAN WOMEN OF CARY","CARY","NC","27512",,

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
        "last_name_sml": 1,
        "first_last_sml": 0.6363636,
        "full_name_sml": 0.53846157,
        "full_count": "1"
      }
    ],
    "count": "1"
  },
  "donors": {
    "data": [
      {
        "id": "7351285a-cce4-4dfd-aeee-bfc297ee8139",
        "name": "KAY COOPER",
        "city": "HILLSBOROUGH",
        "state": "NC",
        "zip_code": "27278",
        "profession": "RETIRED",
        "employer_name": "RETIRED",
        "full_count": "1",
        "sml": 0.6363636
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
