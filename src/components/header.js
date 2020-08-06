import React from 'react'
import {
  Header as HeaderComponent,
  NavMenuButton,
  PrimaryNav,
  Title,
} from '@trussworks/react-uswds'

const Header = () => {
  return (
    <>
      <div className="usa-overlay " />
      <HeaderComponent basic>
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <Title>Campaign Finance</Title>
            <NavMenuButton label="Menu" onClick={function noRefCheck() {}} />
          </div>
          <PrimaryNav
            items={[
              <a key="search" className="usa-nav__link" href="/">
                <span>Search</span>
              </a>,
              <a key="about" className="usa-nav__link" href="/candidate">
                <span>About</span>
              </a>,
              <a key="about" className="usa-nav__link" href="/DataDictionary">
                <span>Data Dictionary</span>
              </a>,
            ]}
            onToggleMobileNav={function noRefCheck() {}}
          ></PrimaryNav>
        </div>
      </HeaderComponent>
    </>
  )
}

export default Header
