import {
  IonContent,
  IonHeader,
  IonPage,
  IonImg,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonFooter,
  IonCol,
  IonText,
  IonGrid,
  IonRow,
  IonBadge,
  IonProgressBar,
  useIonToast,
  IonList,
  IonItem,
  IonIcon,
} from "@ionic/react"
import logoText from "../assets/images/logo-text.png"
import { addOutline, checkmarkOutline } from "ionicons/icons"
import { Link } from "react-router-dom"
import "./Home.css"
import { MenuItem } from "../types/menu"
import { useCartContext } from "../hooks/useCartContext"
import { useIonRouter } from "@ionic/react"

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

const MenuListItem = ({
  item,
  cart,
  addToCart,
  removeFromCart,
}: {
  item: MenuItem
}) => {
  const [expanded, setExpanded] = useState(false)
  const added = cart.some((cartItem) => cartItem.menuItem.id === item.id)

  const handleAdd = () => {
    addToCart(item)
  }

  const handleRemove = () => {
    removeFromCart(item)
  }

  const description = item.description?.slice(0, 80)

  return (
    <IonItem className=''>
      <IonGrid className='ion-padding-bottom ion-padding-top'>
        <IonRow>
          <IonCol size='8'>
            <IonText color='dark'>
              <h2>
                <b>{item.name}</b>
              </h2>
            </IonText>
            <IonText color='medium'>
              {item.description?.length > 80 && !expanded ? (
                <p>{description}... <b onClick={() => setExpanded(true)}>read more</b></p>
              ) : (
                <p>{item.description}</p>
              )
              }
            </IonText>
          </IonCol>
          <IonCol size='4' className='home__menu-item-right'>
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className='home__menu-item-image--default'
              />
            ) : (
              <div className='home__menu-item-image--default'></div>
            )}
            {added ? (
              <IonButton
                size='small'
                id='cart-toast'
                color='dark'
                className='home__menu-item-button'
                onClick={handleRemove}
              >
                <IonIcon aria-hidden='true' icon={checkmarkOutline} />
              </IonButton>
            ) : (
              <IonButton
                size='small'
                id='cart-toast'
                color='light'
                className='home__menu-item-button'
                onClick={handleAdd}
              >
                <IonIcon aria-hidden='true' icon={addOutline} />
              </IonButton>
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  )
}

const Home: React.FC<Props> = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const { user } = useUserContext()
  const [present] = useIonToast()

  const { data, isLoading, error } = useQuery({
    queryKey: ["menu-items", user.id],
    queryFn: fetchMenuItems,
  })

  useEffect(() => {
    setMenuItems(data || [])
  }, [data])

  const { cart, setCart } = useCartContext()

  const router = useIonRouter()

  const addToCart = (item: MenuItem) => {
    setCart((prev) => [...prev, { menuItem: item }])
  }

  const removeFromCart = (item: MenuItem) => {
    setCart((prev) =>
      prev.filter((cartItem) => cartItem.menuItem.id !== item.id)
    )
  }

  const checkout = () => {
    router.push("/cart")
  }

  let content = null

  if (error) {
    present({
      message: error.message,
      duration: 5000,
      position: "bottom",
    })
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
      <div>
        {displayItems.map((item, index) => {
          if (item.items.length === 0) return null
          return (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardTitle>{item.title}</IonCardTitle>
                <IonCardSubtitle>{item.subtitle}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {item.items.map((menuItem, index) => (
                    <MenuListItem
                      key={menuItem.id}
                      item={menuItem}
                      cart={cart}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                    />
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          )
        })}
      </div>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color='dark'>
          <IonTitle>
            <IonImg
              src={logoText}
              alt='logo'
              className='ion-margin ion-padding'
            ></IonImg>
          </IonTitle>
          {isLoading && (
            <IonProgressBar color='dark' type='indeterminate'></IonProgressBar>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='home__header'></div>
        {content}
      </IonContent>

      {cart.length > 0 && (
        <IonFooter>
          <IonToolbar>
            <IonButton expand='block' color='clear' onClick={checkout}>
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
