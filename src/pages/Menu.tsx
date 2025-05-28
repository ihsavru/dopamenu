import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  useIonToast,
  IonCardTitle,
  IonProgressBar,
  IonList,
  IonItem,
} from "@ionic/react"
import { useEffect, useState } from "react"
import {
  MENU_ITEM_TYPES,
  DisplayMenuItem,
  MenuItemTypeKey,
} from "../utils/constants/menu"
import { fetchMenuItems } from "../api/menuItems"
import { useQuery } from "@tanstack/react-query"
import "./Menu.css"
import { MenuItem } from "../types/menu"
import { useUserContext } from "../hooks/useUserContext"

import AddItemModal from "../components/AddItemModal"

type Props = {}

const Menu: React.FC<Props> = () => {
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

  if (error) {
    present({
      message: error.message,
      duration: 5000,
      position: "bottom",
    })
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
          <IonTitle>Your Dopamine Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>Your Dopamine Menu</IonTitle>
            {isLoading && (
              <IonProgressBar type='indeterminate'></IonProgressBar>
            )}
          </IonToolbar>
        </IonHeader>
        {displayItems.map((item) => (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{item.title}</IonCardTitle>
              <IonCardSubtitle>{item.subtitle}</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
              <p>{item.description}</p>
              <IonList lines="inset">
                {item.items.map((item) => (
                  <IonItem>
                    <p>{item.name}</p>
                  </IonItem>
                ))}
              </IonList>

              <AddItemModal item={item} />
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  )
}

export default Menu
