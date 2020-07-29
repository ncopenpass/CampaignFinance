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
