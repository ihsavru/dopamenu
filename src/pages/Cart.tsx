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

type Props = {}

const Cart: React.FC<Props> = () => {
  const { cart, placeOrder } = useCartContext()
  const { setUser } = useUserContext()

  const history = useHistory()

  const checkout = async() => {
    try {
      await placeOrder()
      history.push("/profile")
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
        <IonButton size='small' onClick={() => checkout()}>
          Checkout
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Cart
