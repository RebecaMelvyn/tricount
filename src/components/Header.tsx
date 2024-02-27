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
            <h1>Trimelcas</h1>
        </ul>
        <ul className='nav_link'>
          <li><Link to="/">Accueil</Link></li>
          <li className='second_link'><Link to="/groups">Tout mes groupes</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
