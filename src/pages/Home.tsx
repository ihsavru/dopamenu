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
  IonProgressBar,
  useIonToast
} from "@ionic/react"
import { Link } from "react-router-dom"
import "./Home.css"
import { MenuItem } from "../types/menu"
import { useCartContext } from "../hooks/useCartContext"
import { useHistory } from "react-router-dom"
import {
  MENU_ITEM_TYPES,
  DisplayMenuItem,
  MenuItemTypeKey,
} from "../utils/constants/menu"
import { fetchMenuItems } from "../api/menuItems"
import { useQuery } from "@tanstack/react-query"
import { useUserContext } from "../hooks/useUserContext"
import { useEffect, useState } from "react"

type Props = {}

const Home: React.FC<Props> = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const { user } = useUserContext()
  const [present] = useIonToast();


  const { data, isLoading, error } = useQuery({
    queryKey: ["menu-items", user.id],
    queryFn: fetchMenuItems,
  })

  useEffect(() => {
    setMenuItems(data || [])
  }, [data])

  const { cart, setCart } = useCartContext()

  const history = useHistory()

  const addToCart = (item: MenuItem) => {
    setCart((prev) => [...prev, { menuItem: item }])
  }

  const checkout = () => {
    history.push("/cart")
  }

  let content = null

  if (error) {
    present({
      message: error.message,
      duration: 5000,
      position: 'bottom',
    });
  }

  if (!isLoading && !error && menuItems.length === 0) {
    content = (
      <div className='ion-padding'>
        <h1>Uh Oh!</h1>
        <p>There are no menu items to display.</p>
        <p>
          Go to the&nbsp;<Link to='/menu'>"Menu"</Link>&nbsp; tab to start
          adding items.
        </p>
      </div>
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

  if (menuItems.length > 0) {
    content = (
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
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
          {isLoading && <IonProgressBar type='indeterminate'></IonProgressBar>}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {!isLoading && (
          <IonHeader collapse='condense'>
            <IonToolbar>
              <IonTitle size='large'>Home</IonTitle>
            </IonToolbar>
          </IonHeader>
        )}
        {content}
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
