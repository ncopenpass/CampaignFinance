# Endpoints

## GET `/api/search/contributors/:name`

Search for contributors by name. The search uses trigram fuzzy matching to find results and orders the results by the match similarity.

The `:name` parameter must be URIEncoded (ie: `encodeURIComponent)

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

The `:name` parameter must be URIEncoded (ie: `encodeURIComponent)

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
