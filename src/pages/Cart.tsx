import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonButton,
} from "@ionic/react"
import { useHistory } from "react-router-dom"

import "./Menu.css"

import { useCartContext } from "../hooks/useCartContext"
import { useUserContext } from "../hooks/useUserContext"
import { User } from "../types/user"

type Props = {}

const Cart: React.FC<Props> = () => {
  const { cart, setCart } = useCartContext()
  const { setUser } = useUserContext()

  const history = useHistory()

  const placeOrder = () => {
    setUser((prev: User) => ({
      ...prev,
      orders: [
        ...prev.orders,
        { items: cart, timestamp: Date.now(), status: "pending" },
      ],
    }))
    setCart([])
    history.push("/profile")
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
        <IonButton size='small' onClick={() => placeOrder()}>
          Checkout
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Cart
