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
import { useQuery, useMutation } from "@tanstack/react-query"
import { fetchOrders, markOrderCompleted } from "../api/orders"
import { queryClient } from "../api/client"

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

  const { mutate: completeOrder, isPending: isCompleting } = useMutation({
    mutationFn: (orderId: number) => markOrderCompleted(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
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

  const badgeColors = {
    pending: "warning",
    completed: "success",
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
                <IonBadge color={badgeColors[order.status]} slot='end'>{order.status}</IonBadge>
                <IonLabel>
                  {order.created_at}{" "}
                  {order.status === "pending" && (
                    <IonButton
                      onClick={() => completeOrder(order.id)}
                      size='small'
                      disabled={isCompleting}
                      color='light'
                    >
                      Mark as completed
                    </IonButton>
                  )}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>

          <IonButton size='small' onClick={signOut}>
            Sign Out
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Profile
