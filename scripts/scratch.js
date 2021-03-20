// TODO: update test fixture

/*

Chris data:

Contributions:
candidate_refereendum_name => candidate_referendum_name
date_occured => date_occurred

My data

Contributions:
candidate_or_referendum_name => candidate_referendum_name
+original_committee_id
+original_contributor_id
+trans_id
+transaction_category
-source_contribution_id



*/

const old = `sboe_id,current_status,committee_name,committee_type,committee_street_1,committee_street_2,committee_city,committee_state,committee_full_zip,candidate_first_name,candidate_middle_name,candidate_last_name,treasurer_first_name,treasurer_middle_name,treasurer_last_name,treasurer_email,asst_treasurer_first_name,asst_treasurer_middle_name,asst_treasurer_last_name,asst_treasurer_email,treasurer_street_1,treasurer_street_2,treasurer_city,treasurer_state,treasurer_full_zip,party,office,juris`.split(
  ','
)
// .sort()

const n = `"comm_id","sboe_id","current_status","committee_name","committee_type","committee_street_1","committee_street_2","committee_city","committee_state","committee_zip_code","candidate_first_name","candidate_middle_name","candidate_last_name","candidate_full_name","candidate_first_last_name","treasurer_first_name","treasurer_middle_name","treasurer_last_name","treasurer_email","asst_treasurer_first_name","asst_treasurer_middle_name","asst_treasurer_last_name","asst_treasurer_email_name","treasurer_street_1","treasurer_street_2","treasurer_city","treasurer_state","treasurer_full_zip","treasurer_id","asst_treasurer_id","party","office","juris"`
  .split(',')
  .map((x) => x.slice(1, x.length - 1), 'test')
// .sort()

console.log('old', old)
console.log('old.length', old.length)

console.log('new', n)
console.log('new.length', n.length)

const diff = (a, b) => {
  const result = []

  for (const el of a) {
    if (!b.includes(el)) {
      result.push(el)
    }
  }

  for (const el of b) {
    if (!a.includes(el)) {
      result.push(el)
    }
  }

  return result
}

console.log(diff(old, n).sort())
