import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonButton,
  useIonToast,
} from "@ionic/react"
import { useIonRouter } from "@ionic/react"

import "./Menu.css"

import { useCartContext } from "../hooks/useCartContext"
import { useUserContext } from "../hooks/useUserContext"
import { createOrder } from "../api/orders"
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "../api/client"

type Props = {}

const Cart: React.FC<Props> = () => {
  const { cart, setCart } = useCartContext()
  const { user } = useUserContext()
  const [present] = useIonToast()

  const {
    mutate: placeOrder,
    isPending,
    error,
  } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      setCart([])
      present({
        message: "Order placed successfully!",
        duration: 5000,
        position: "bottom",
      })
      router.push("/profile")
    },
  })

  if (error) {
    present({
      message: error.message,
      duration: 5000,
      position: "bottom",
    })
  }

  const router = useIonRouter()

  const checkout = async () => {
    try {
      await placeOrder({ items: cart, userId: user?.id })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Your Cart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>Your Cart</IonTitle>
          </IonToolbar>
        </IonHeader>
        {cart.map(({ menuItem }) => (
          <IonList>
            <IonItem>
              <p>{menuItem.name}</p>
            </IonItem>
          </IonList>
        ))}
        <IonButton disabled={isPending} size='small' onClick={() => checkout()}>
          Checkout
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Cart
