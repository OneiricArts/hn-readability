import React from 'react';
import { Link } from 'react-router-dom';
import { LinkHelper } from './LinkHelper';

export const Contact = () => {
  document.title = 'Contact & Appreciation | Dapper';

  return (
    <div className="p-4">
      <Link to="/">&laquo; home</Link>

      <h2>Contact</h2>
      <p>You can email me here:</p>

      <div className="pb-2">
        <img
          src="./email.png"
          alt="oneiric dot arts at gmail dot com"
          width="300px"
        />
      </div>

      <h2>Appreciation</h2>
      <p>
        If you would like to show appreciation, you can send me a{' '}
        <LinkHelper
          openInNewTab
          href="https://www.philzcoffee.com/online-gift-certificate"
          label="Philz Coffee gift card"
        />{' '}
        to the above email. If you cannot afford that, a thank you note is just
        as good.
      </p>

      <p>Alternatively, donate to any of the following charities:</p>
      <ul>
        <li>
          <LinkHelper
            openInNewTab
            href="https://www.unicefusa.org/?form=donate"
            label="UNICEF"
          />
        </li>
      </ul>
    </div>
  );
};
