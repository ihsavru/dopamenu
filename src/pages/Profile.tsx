import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonButton,
  IonText,
} from "@ionic/react"
import { useUserContext } from "../hooks/useUserContext"

import "./Menu.css"
import { Order } from "../types/cart"

type Props = {}

const Profile: React.FC<Props> = () => {
  const { user } = useUserContext()
  const { orders } = user

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>Profile</IonTitle>
          </IonToolbar>
          <div className='ion-padding'>
            <IonText>
              <h4>Order History</h4>
            </IonText>
            <IonList>
              {orders.map((order: Order) => (
                <IonItem>
                  <p>{order.timestamp}</p>
                </IonItem>
              ))}
            </IonList>
          </div>
        </IonHeader>
      </IonContent>
    </IonPage>
  )
}

export default Profile
