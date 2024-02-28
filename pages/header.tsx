import { NextPage } from 'next';
import Link from 'next/link';

const linkStyle = {
  marginRight: 15,
  backgroundColor: 'blue',
  color: 'green',
};

const Header: NextPage<{ t?: string }> = ({ t }) => (
  <header>
    {t}
    <Link href="/" legacyBehavior>
      <a style={linkStyle}>Home</a>
    </Link>
    <Link href="/about" legacyBehavior>
      <a style={linkStyle}>About</a>
    </Link>
  </header>
);

export default Header;
