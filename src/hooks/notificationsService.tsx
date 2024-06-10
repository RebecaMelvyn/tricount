import * as PusherPushNotifications from '@pusher/push-notifications-web';

export interface PusherClient {
  start(): Promise<void>;
  addDeviceInterest(interest: string): Promise<void>;
}

const initializePusher = (): PusherClient => {
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: '6a245bed-351e-4dce-aef2-8d49b0df3ec3',
  });

  return beamsClient;
};

const addDeviceInterest = async (client: PusherClient, interest: string): Promise<void> => {
  await client.addDeviceInterest(interest);
  console.log(`Subscribed to interest: ${interest}`);
};

export const notificationsService = async (): Promise<PusherClient | null> => {
  try {
    const beamsClient = initializePusher();
    await beamsClient.start();
    await addDeviceInterest(beamsClient, 'hello');
    console.log('Successfully registered and subscribed!');
    return beamsClient;
  } catch (error) {
    console.error('Error setting up notifications service:', error);
    return null;
  }
};
