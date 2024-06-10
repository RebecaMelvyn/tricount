import '../App.css'
import { Link } from 'react-router-dom';
import Header from './Header';
import * as PusherPushNotifications from '@pusher/push-notifications-web';
import { useEffect } from 'react';


function PageAccueil() {
  useEffect(() => {
    const beamsClient = new PusherPushNotifications.Client({
      instanceId: '6a245bed-351e-4dce-aef2-8d49b0df3ec3',
    });

    beamsClient.start()
      .then(() => beamsClient.addDeviceInterest('hello'))
      .then(() => console.log('Successfully registered and subscribed!'))
      .catch(console.error);
  }, []); 

  return (
    <>
      <div>
        <Header/>
        <div id='contain_home'>

          <h2>Offrez-vous ce qu'il y a de mieux en matière de partage entre amies ou collègues</h2>

          <p>L'application Trimelcas offre une solution pratique et conviviale pour gérer les dépenses partagées au sein de groupes, facilitant ainsi la coordination et l'organisation des activités collectives.</p>

          <Link to="/create-group">
            <button className='btn create'>Créer un groupe</button>
          </Link>
          <h4>OU</h4>
          <Link to="/join-group">
            <button className='btn join'>Rejoindre un groupe</button>
          </Link>
        </div>
      </div>

    </>
  )
}
<script src="https://js.pusher.com/beams/1.0/push-notifications-cdn.js"></script>

export default PageAccueil
