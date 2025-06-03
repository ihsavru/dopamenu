import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonThumbnail,
  IonItem,
  IonCardHeader,
  IonCard,
  IonChip,
  IonButton,
  IonText,
  useIonToast,
  IonProgressBar,
  IonBadge,
  IonLabel,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react"
import { useUserContext } from "../hooks/useUserContext"

import { useIonRouter } from "@ionic/react"

import "./Profile.css"
import { Order } from "../types/cart"
import { supabase } from "../supabaseClient"
import { useEffect, useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { fetchOrders, markOrderCompleted } from "../api/orders"
import { queryClient } from "../api/client"

type Props = {}

const CurrentOrder = ({ order, completeOrder }: { order: Order }) => {
  return (
    <IonCard className='ion-padding'>
      <IonCardHeader>
        <IonCardSubtitle>
          <IonChip color='danger'>{order.status}</IonChip>
        </IonCardSubtitle>
        <IonCardTitle>{order.id}</IonCardTitle>
      </IonCardHeader>

      <div className='ion-padding'>
        <IonList>
          {order.order_items.map((item) => (
            <IonItem>
              <IonThumbnail slot='start'>
                <img
                  alt='Silhouette of mountains'
                  src='https://ionicframework.com/docs/img/demos/thumbnail.svg'
                />
              </IonThumbnail>
              <IonLabel>{item.menu_items?.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </div>
      <IonButton
        onClick={() => completeOrder(order.id)}
        className='ion-text-uppercase'
        expand='block'
        shape='round'
      >
        Mark as completed
      </IonButton>
    </IonCard>
  )
}

const PastOrder = ({ order }: { order: Order }) => {
  return (
    <IonItem>
      <IonLabel>{order.id}</IonLabel>
      <IonBadge color='success' slot='end'>
        {order.status}
      </IonBadge>
    </IonItem>
  )
}

const Profile: React.FC<Props> = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [present] = useIonToast()
  const router = useIonRouter()

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
      router.push("/")
    }
  }

  const currentOrders = orders.filter(
    (order: Order) => order.status === "pending"
  )
  const pastOrders = orders.filter((order: Order) => order.status !== "pending")

  return (
    <IonPage>
      <IonHeader collapse='condense'>
        <IonToolbar color='dark'>
          <IonTitle>Profile</IonTitle>
          {isLoading && <IonProgressBar type='indeterminate'></IonProgressBar>}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='profile__header ion-padding'>
          <IonText color='primary ion-padding'>
            <h4>{user?.email}</h4>
            <p>{orders.length} orders placed</p>
            <IonButton size='small' onClick={signOut}>
              Sign Out
            </IonButton>
          </IonText>
        </div>
        <div className='ion-padding'>
          <IonText>
            <h3>Current Orders</h3>
          </IonText>
          {currentOrders.map((order: Order) => (
            <CurrentOrder order={order} completeOrder={completeOrder} />
          ))}
          <IonText>
            <h3>Past Orders</h3>
          </IonText>
          <IonList inset>
            {pastOrders.map((order: Order) => (
              <PastOrder order={order} />
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Profile
