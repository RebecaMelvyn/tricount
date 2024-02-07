import '../App.css'
import { Link } from 'react-router-dom';


function PageAccueil() {

  return (
    <>
      <div id='contain_home'>
        <h1>Tricount</h1>

        <Link to="/groups">
          <button>Voir mes groupes</button>
        </Link>

        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus id quasi nostrum, expedita ut, ea neque cum voluptas labore accusantium soluta tempore nihil, asperiores ab placeat alias numquam corporis doloribus? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit dolorum sapiente officia omnis rem quo aperiam aspernatur at ex a consequuntur consequatur odit, veritatis et, iure quod placeat repellat eos!</p>

        <Link to="/create-group">
          <button>Créer un groupe</button>
        </Link>
        <h4>OU</h4>
        <Link to="/join-group">
          <button>Rejoindre un groupe</button>
        </Link>
      </div>

    </>
  )
}

export default PageAccueil
