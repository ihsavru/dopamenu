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
  IonCardTitle,
} from "@ionic/react"
import {
  MENU_ITEM_TYPES,
  DisplayMenuItem,
  MenuItemTypeKey,
} from "../utils/constants/menu"

import "./Menu.css"

import AddItemModal from "../components/AddItemModal"
import { useMenuContext } from "../hooks/useMenuContext"

type Props = {
}

const Menu: React.FC<Props> = () => {
  const { menuItems } = useMenuContext()

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
              <div>{item.items.map((item) => item.name)}</div>

              <AddItemModal item={item} />
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  )
}

export default Menu
