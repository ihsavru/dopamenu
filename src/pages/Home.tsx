import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonFooter,
  IonList,
  IonBadge,
} from "@ionic/react"
import { Link } from "react-router-dom"
import "./Home.css"
import { useMenuContext } from "../hooks/useMenuContext"
import { MenuItem } from "../types/menu"
import { useCartContext } from "../hooks/useCartContext"
import { useHistory } from "react-router-dom"
import {
  MENU_ITEM_TYPES,
  DisplayMenuItem,
  MenuItemTypeKey,
} from "../utils/constants/menu"

type Props = {}

const Home: React.FC<Props> = () => {
  const { menuItems } = useMenuContext()
  const { cart, setCart } = useCartContext()

  const history = useHistory()

  const addToCart = (item: MenuItem) => {
    setCart((prev) => [...prev, { menuItem: item }])
  }

  const checkout = () => {
    history.push("/cart")
  }

  if (menuItems.length === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse='condense'>
            <IonToolbar>
              <IonTitle size='large'>Home</IonTitle>
            </IonToolbar>
          </IonHeader>
          <div className='ion-padding'>
            <h1>Uh Oh!</h1>
            <p>There are no menu items to display.</p>
            <p>
              Go to the&nbsp;<Link to='/menu'>"Menu"</Link>&nbsp; tab to start
              adding items.
            </p>
          </div>
        </IonContent>
      </IonPage>
    )
  }

  const displayItems = Object.keys(MENU_ITEM_TYPES).map((key) => {
    const displayItem = MENU_ITEM_TYPES[
      key as MenuItemTypeKey
    ] as DisplayMenuItem
    const items = menuItems.filter((item) => item.type === displayItem.type)

    return {
      ...displayItem,
      items,
    }
  })

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className='ion-padding'>
          <h3>Feeling Hungry?</h3>
          <IonList>
            {displayItems.map((item, index) => (
              <IonCard key={index}>
                <IonCardHeader>
                  <IonCardTitle>{item.title}</IonCardTitle>
                  <IonCardSubtitle>{item.subtitle}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  {item.items.map((menuItem, index) => (
                    <div>
                      <h4>{menuItem.name}</h4>
                      <p>{menuItem.description}</p>
                      <IonButton
                        size='small'
                        id='cart-toast'
                        color='dark'
                        onClick={() => addToCart(menuItem)}
                      >
                        Add
                      </IonButton>
                    </div>
                  ))}
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        </div>
      </IonContent>

      {cart.length > 0 && (
        <IonFooter>
          <IonToolbar>
            <IonButton expand='block' color='dark' onClick={checkout}>
              View Cart&nbsp;
              <IonBadge slot='end' color={"warning"}>
                {cart.length}
              </IonBadge>
            </IonButton>
          </IonToolbar>
        </IonFooter>
      )}
    </IonPage>
  )
}

export default Home
