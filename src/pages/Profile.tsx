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
  IonProgressBar,
  IonBadge,
  IonLabel,
} from "@ionic/react"
import { useUserContext } from "../hooks/useUserContext"

import { useHistory } from "react-router-dom"
import "./Menu.css"
import { Order } from "../types/cart"
import { supabase } from "../supabaseClient"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchOrders } from "../api/orders"

type Props = {}

const Profile: React.FC<Props> = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [present] = useIonToast()
  const history = useHistory()
  const { user } = useUserContext()

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => fetchOrders(user?.id),
  })

  if (error) {
    present({
      message: error.message,
      duration: 5000,
      position: "bottom",
    })
  }

  useEffect(() => {
    setOrders(data || [])
  }, [data])

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
            {isLoading && (
              <IonProgressBar type='indeterminate'></IonProgressBar>
            )}
          </IonToolbar>
        </IonHeader>
        <div className='ion-padding'>
          <IonText>
            <h4>Order History</h4>
          </IonText>
          <IonList>
            {orders.map((order: Order) => (
              <IonItem>
                <IonBadge slot='end'>{order.status}</IonBadge>
                <IonLabel>{order.created_at}</IonLabel>
              </IonItem>
            ))}
          </IonList>

          <IonButton onClick={signOut}>Sign Out</IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Profile
