import '../App.css'
import { Link } from 'react-router-dom';


function PageAccueil() {

  return (
    <>
      <h1>Tricount</h1>

      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus id quasi nostrum, expedita ut, ea neque cum voluptas labore accusantium soluta tempore nihil, asperiores ab placeat alias numquam corporis doloribus? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit dolorum sapiente officia omnis rem quo aperiam aspernatur at ex a consequuntur consequatur odit, veritatis et, iure quod placeat repellat eos!</p>

      <Link to="/create-group">
        <button>Commencez à trier avec vos amis !</button>
      </Link>

    </>
  )
}

export default PageAccueil
