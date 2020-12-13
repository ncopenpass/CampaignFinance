import React, { useState } from 'react'
import {
  Header as HeaderComponent,
  NavMenuButton,
  PrimaryNav,
  Title,
} from '@trussworks/react-uswds'

import { DEFAULT_ROUTE, DATA_DICTIONARY_ROUTE, ABOUT_ROUTE } from '../constants'

const Header = () => {
  const [expanded, setExpanded] = useState(false)
  const onClick = (): void => setExpanded((prvExpanded) => !prvExpanded)

  const menuItems = [
    <a key="search" className="usa-nav__link" href={DEFAULT_ROUTE}>
      <span>Search</span>
    </a>,
    <a key="about" className="usa-nav__link" href={ABOUT_ROUTE}>
      <span>About</span>
    </a>,
    <a key="about" className="usa-nav__link" href={DATA_DICTIONARY_ROUTE}>
      <span>Data Dictionary</span>
    </a>,
  ]

  return (
    <>
      <div className="usa-overlay " />
      <HeaderComponent basic>
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <a href={DEFAULT_ROUTE}>
              <img
                src={process.env.PUBLIC_URL + '/imgs/sun-logo.svg'}
                className="sun-logo"
                alt="Outline of the state of North Carolina with the mountains and sun."
              ></img>
              <h1 className="logo-text">NC Campaign Finance Tool</h1>
            </a>
            <NavMenuButton label="Menu" onClick={onClick} />
          </div>
          <PrimaryNav
            items={menuItems}
            mobileExpanded={expanded}
            onToggleMobileNav={onClick}
          />
        </div>
      </HeaderComponent>
    </>
  )
}

export default Header
