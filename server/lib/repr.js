// @ts-check

const apiReprCandidate = (row) => {
  return {
    candidate_first_last_name: row.candidate_first_last_name,
    candidate_first_name: row.candidate_first_name,
    candidate_full_name: row.candidate_full_name,
    candidate_last_name: row.candidate_last_name,
    candidate_middle_name: row.candidate_middle_name,
    current_status: row.current_status,
    juris: row.juris,
    office: row.office,
    party: row.party,
    committee_sboe_id: row.sboe_id,
  }
}

const apiReprContributor = (row) => {
  return {
    contributor_id: row.id,
    name: row.name,
    city: row.city,
    state: row.state,
    zipcode: row.zipcode,
    profession: row.profession,
    employer_name: row.employer_name,
  }
}

const apiReprContribution = (row) => {
  return {
    account_code: row.account_code,
    amount: row.amount,
    candidate_referendum_name: row.candidate_referendum_name,
    committee_sboe_id: row.committee_sboe_id,
    contributor_id: row.contributor_id,
    date_occurred: row.date_occurred,
    declaration: row.declaration,
    form_of_payment: row.form_of_payment,
    purpose: row.purpose,
    report_name: row.report_name,
    transaction_type: row.transaction_type,
  }
}

const apiReprCommittee = (row) => {
  return {
    committee_name: row.committee_name,
    office: row.office,
    party: row.party,
    committee_sboe_id: row.sboe_id,
    city: row.committee_city,
    state: row.committee_state,
  }
}

const apiReprContributionCommittee = (row) => {
  return {
    ...apiReprContribution(row),
    candidate_full_name: row.candidate_full_name,
    committee_name: row.committee_name,
    total_contributions_to_committee: row.total_contributions_to_committee,
  }
}

// the combined view for contributor + contributions
const apiReprContributorContributions = (row) => {
  return {
    ...apiReprContributor(row),
    ...apiReprContribution(row),
  }
}

module.exports = {
  apiReprCandidate,
  apiReprCommittee,
  apiReprContribution,
  apiReprContributor,
  apiReprContributionCommittee,
  apiReprContributorContributions,
}
