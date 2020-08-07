import React from 'react'
import {
  Address,
  Button,
  Footer as FooterComponent,
  FooterNav,
  Logo,
} from '@trussworks/react-uswds'

const Footer = () => {
  return (
    <FooterComponent
      primary={
        <div className="usa-footer__primary-container grid-row">
          <div className="mobile-lg:grid-col-8">
            <FooterNav
              links={[
                <a className="usa-footer__primary-link" href="#">
                  Terms of Use
                </a>,
                <a className="usa-footer__primary-link" href="#">
                  Sitemap
                </a>,
                <a className="usa-footer__primary-link" href="#">
                  Privacy Policy
                </a>,
                <a
                  className="usa-footer__primary-link"
                  href="https://github.com/ncopenpass/CampaignFinance"
                >
                  Github
                </a>,
              ]}
              size="slim"
            />
          </div>
          <div className="tablet:grid-col-4">
            <Address
              items={[
                <a key="telephone" href="tel:1-800-555-5555">
                  (800) NUM-CALL
                </a>,
                <a key="email" href="mailto:email@email.com">
                  email@email.com
                </a>,
              ]}
              slim
            />
          </div>
        </div>
      }
      returnToTop={
        <div className="grid-container usa-footer__return-to-top">
          <Button type="button" unstyled>
            Return to top
          </Button>
        </div>
      }
      secondary={
        <Logo
          heading={<h3 className="usa-footer__logo-heading">Name of Agency</h3>}
          image={
            <img
              alt="img alt text"
              className="usa-footer__logo-img"
              src="static/media/logo-img.c73294fe.png"
            />
          }
          slim
        />
      }
      size="slim"
    />
  )
}

export default FooterComponent
