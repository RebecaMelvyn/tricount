import '../App.css'
import { Link } from 'react-router-dom';
import Header from './Header';


function PageAccueil() {

  return (
    <>
      <div>
        <Header/>
        <div id='contain_home'>

          <h2>Offrez-vous ce qu'il y a de mieux en matière de partage entre amies ou collègues</h2>

          <p>L'application Trimelcas offre une solution pratique et conviviale pour gérer les dépenses partagées au sein de groupes, facilitant ainsi la coordination et l'organisation des activités collectives.</p>

          <Link to="/create-group">
            <button>Créer un groupe</button>
          </Link>
          <h4>OU</h4>
          <Link to="/join-group">
            <button>Rejoindre un groupe</button>
          </Link>
        </div>
      </div>

    </>
  )
}

export default PageAccueil
