import React from 'react'

const About = () => {
  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col-12">
          <h1>Bringing Transparency to North Carolina Politics</h1>
        </div>

        <div className="grid-col-12">
          <p>
            This project from the{' '}
            <a
              href="https://ncopenpass.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Raleigh Brigade
            </a>{' '}
            of{' '}
            <a
              href="https://www.codeforamerica.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Code for America
            </a>{' '}
            is available here in an initial “minimally viable” form. The new
            campaign finance dashboard aims to make campaign finance more
            accessible and understandable than it has ever been before in North
            Carolina.
          </p>

          <p>
            Yes, we hope that those familiar with campaign finance find plenty
            to feast on here. But we also want to make this too little-known
            realm of political life accessible and available for voters across
            North Carolina.{' '}
          </p>

          <p>
            A lack of easy access to campaign finance data — that any citizen
            can search, sort and understand — undermines a transparent
            democracy. Our ability as voters to understand the people and
            corporations who fund the campaigns of our elected officials is key
            to making sense of policy outcomes and ensuring our elected
            officials have the public interest in mind when making vital
            decisions.
          </p>

          <p>
            This dashboard, when completed, will provide both a comprehensive
            and, with only key search terms, granular look at a candidate’s
            donors, expenses and outside independent group spending. We want to
            allow users to more easily answer key questions about who funds
            candidates’ campaigns, what they spend money on and why and how that
            affects policy outcomes for all North Carolinians.
          </p>

          <p>
            This “minimally viable” version provides a limited amount of data
            and only access to Candidate pages. We plan to add pages that focus
            on Contributors and Political Action Committees, among other
            features, in the near future. (See more in the About our Data
            section).
          </p>

          <p>
            That said there is no true “finish line” as the funding of
            campaigns, PACs and political expenditures means this tool will need
            to be continually updated on a regular basis. Planning and
            fundraising for doing so is ongoing. Thoughts? Advice? Want to get
            in touch?{' '}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScvwz_WsSad_rnhIz429UTjLXItDUZvRm3nvsAvHJwqOMwkag/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact us
            </a>
            .
          </p>

          <p>
            Want a look behind the curtain? Everything presented here is
            completely open source and completed by tech, journalism and public
            policy volunteers from North Carolina beginning in March 2020. The
            project’s code and more information is available on the Open Raleigh
            Brigade’s{' '}
            <a
              href="https://github.com/ncopenpass/CampaignFinance"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github page
            </a>
            .
          </p>
        </div>

        {/* ABOUT DATA */}
        <div className="grid-col-12">
          <h2>
            <strong>About Our Data</strong>
          </h2>

          <p>
            <strong>
              The data portrayed on this “minimally viable” prototype represents
              contributions during the period of January 1, 2019 through May 5,
              2020 and was downloaded in bulk from the North Carolina State
              Board of Elections{' '}
              <a
                href="https://cf.ncsbe.gov/CFTxnLkup/AdvancedSearch/"
                target="_blank"
                rel="noopener noreferrer"
              >
                website
              </a>
              .
            </strong>
          </p>

          <p>
            The data made available on this site is exclusively from the North
            Carolina State Board of Elections website. We do not substantially
            clean or edit the data provided by the state. All errors in the data
            — misspelled names, addresses, accidental blank fields and other
            common errors — were present in the raw files presented here. We
            plan to add functionality in the future so that users can more
            easily flag potential data issues.
          </p>

          <p>
            However, we have made an effort to combine contributions under their
            contributors and ensure that they are linked to the campaign,
            political or corporate committees to which they belong. We have used
            algorithmic and{' '}
            <a
              href="https://github.com/ncopenpass/campaign-finance-data-cleaning"
              target="_blank"
              rel="noopener noreferrer"
            >
              manual approaches
            </a>{' '}
            to combine contributors and link them. No process for doing so is
            perfect. If you see a mistake or a potential error about linked
            contributions — but not about errors in the dataset likely present
            in the raw file from the Board of Elections — please use our{' '}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdRlmtZw4yJa9ZWW9RjKecdq2Em7Ac0LtYs2ItVlVbO_ZMtSg/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              error form
            </a>{' '}
            to report those issues.
          </p>

          <p>
            This project from Code for America’s Open Raleigh Brigade is not in
            any way affiliated or endorsed by the North Carolina State Board of
            Elections.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
