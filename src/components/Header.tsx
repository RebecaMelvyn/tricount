// Header.tsx
import { Link } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import de l'icône de plus
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Header = () => {
  return (
    <header>
      <nav>
        <ul className='container_back'>      
            <Link to="/" id='back'>
        <button>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </Link></ul>
        <ul>
            <h1><Link to="/">Trimelcas</Link></h1>
        </ul>
        <ul className='nav_link'>
          <li className='second_link'><Link to="/groups">Tous mes groupes</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
