import React from 'react'
import {
  Address,
  Button,
  Footer,
  FooterNav,
  Logo,
} from '@trussworks/react-uswds'

const links = [
  {
    href: '#',
    innerText: 'Terms of use',
  },
  {
    href: '#',
    innerText: 'Sitemap',
  },
  {
    href: '#',
    innerText: 'Privacy Policy',
  },
  {
    href: 'https://github.com/ncopenpass/CampaignFinance',
    innerText: 'GitHub',
  },
]

export default function footer() {
  return (
    <Footer
      primary={
        <div className="usa-footer__primary-container grid-row">
          <div className="mobile-lg:grid-col-8">
            <FooterNav
              links={links.map((link, i) => (
                <a
                  key={i}
                  className="usa-footer__primary-link"
                  href={link.href}
                >
                  {link.innerText}
                </a>
              ))}
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
