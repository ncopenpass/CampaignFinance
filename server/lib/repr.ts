export const apiReprCandidate = (row: Record<string, unknown>) => {
  return {
    candidate_first_last_name: row.candidate_first_last_name,
    candidate_first_name: row.candidate_first_name,
    candidate_full_name: row.candidate_full_name,
    candidate_last_name: row.candidate_last_name,
    candidate_middle_name: row.candidate_middle_name,
    committee_name: row.committee_name,
    current_status: row.current_status,
    juris: row.juris,
    office: row.office,
    party: row.party,
    committee_sboe_id: row.sboe_id,
  }
}

export const apiReprContributor = (row: Record<string, unknown>) => {
  return {
    contributor_id: row.account_id,
    name: row.name,
    city: row.city,
    state: row.state,
    zipcode: row.zip_code,
    profession: row.profession,
    employer_name: row.employer_name,
  }
}

export const apiReprContribution = (row: Record<string, unknown>) => {
  return {
    account_code: row.account_code,
    amount: row.amount,
    candidate_referendum_name: row.candidate_referendum_name,
    committee_sboe_id: row.canon_committee_sboe_id,
    contributor_id: row.contributor_id,
    date_occurred: row.date_occurred,
    declaration: row.declaration,
    form_of_payment: row.form_of_payment,
    purpose: row.purpose,
    report_name: row.report_name,
    transaction_type: row.transaction_type,
  }
}

export const apiReprCommittee = (row: Record<string, unknown>) => {
  return {
    committee_name: row.committee_name,
    office: row.office,
    party: row.party,
    committee_sboe_id: row.sboe_id,
    city: row.committee_city,
    state: row.committee_state,
  }
}

export const apiReprContributionCommittee = (row: Record<string, unknown>) => {
  return {
    ...apiReprContribution(row),
    candidate_full_name: row.candidate_full_name,
    committee_name: row.committee_name,
    total_contributions_to_committee: row.total_contributions_to_committee,
  }
}

export const apiReprExpenditure = ({
  date_occurred,
  form_of_payment,
  transaction_type,
  purpose,
  amount,
  name,
}: {
  date_occurred: string
  form_of_payment: string
  transaction_type: string
  purpose: string
  amount: number
  name: string
}) => ({
  date_occurred,
  form_of_payment,
  transaction_type,
  purpose,
  amount,
  name,
})

// the combined view for contributor + contributions
export const apiReprContributorContributions = (
  row: Record<string, unknown>
) => {
  return {
    ...apiReprContributor(row),
    ...apiReprContribution(row),
  }
}
