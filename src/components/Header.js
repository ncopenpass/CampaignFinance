import React from 'react'
import {
  Header as HeaderComponent,
  NavMenuButton,
  PrimaryNav,
  Title,
} from '@trussworks/react-uswds'
import {
  ABOUT_PAGE_ROUTE,
  DEFAULT_ROUTE,
  DATA_DICTIONARY_ROUTE,
} from '../constants'

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
              <a key="search" className="usa-nav__link" href={DEFAULT_ROUTE}>
                <span>Search</span>
              </a>,
              <a key="about" className="usa-nav__link" href={ABOUT_PAGE_ROUTE}>
                <span>About</span>
              </a>,
              <a
                key="about"
                className="usa-nav__link"
                href={DATA_DICTIONARY_ROUTE}
              >
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
