import React from 'react'
import {
  Address,
  Button,
  Footer as FooterComponent,
  FooterNav,
  Logo,
} from '@trussworks/react-uswds'

// import { PRIVACY_POLICY_ROUTE } from '../constants'

const Footer = () => {
  return (
    <FooterComponent
      primary={
        <div className="usa-footer__primary-container grid-row">
          <div className="grid-col-12 mobile-lg:grid-col-12">
            <div className="footer-nav">
              <FooterNav
                links={[
                  // HIDING TERMS OF USE AND PRIVACY POLICY UNTIL WE CONFIRM WE DON'T NEED THEM

                  // <a className="usa-footer__primary-link" href="/">
                  //   Terms of Use
                  // </a>,
                  // <a
                  //   className="usa-footer__primary-link"
                  //   href={PRIVACY_POLICY_ROUTE}
                  // >
                  //   Privacy Policy
                  // </a>,
                  <a
                    className="usa-footer__primary-link"
                    href="https://forms.gle/5c4dmuTPVCznSB1s8"
                  >
                    Share Feedback
                  </a>,
                  <a
                    className="usa-footer__primary-link"
                    href="https://github.com/ncopenpass/CampaignFinance"
                  >
                    GitHub
                  </a>,
                ]}
                size="slim"
              />
            </div>
          </div>
          {/*
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
            */}
        </div>
      }
      // returnToTop={
      //   <div className="grid-container usa-footer__return-to-top">
      //     <Button type="button" unstyled>
      //       Return to top
      //     </Button>
      //   </div>
      // }
      //secondary={
      // <Logo
      //heading={<h3 className="usa-footer__logo-heading"><a href="">OpenNC</a></h3>}
      // image={
      //   <img
      //     alt="img alt text"
      //     className="usa-footer__logo-img"
      //     src="static/media/logo-img.c73294fe.png"
      //   />
      // }
      //slim
    />
    //}
    //size="slim"
    ///>
  )
}

export default Footer
