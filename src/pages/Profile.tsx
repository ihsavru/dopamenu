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
  useIonToast,
} from "@ionic/react"
import { useUserContext } from "../hooks/useUserContext"

import { useHistory } from "react-router-dom"
import "./Menu.css"
import { Order } from "../types/cart"
import { supabase } from "../supabaseClient"

type Props = {}

const Profile: React.FC<Props> = () => {
  const [present] = useIonToast()
  const history = useHistory()
  const { user } = useUserContext()
  const { orders } = user

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      present({ message: error.message, color: "danger", duration: 3000 })
    } else {
      present({ message: "Signed out successfully", duration: 2000 })
      history.push("/")
    }
  }

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
        <IonButton onClick={signOut}>Sign Out</IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Profile
