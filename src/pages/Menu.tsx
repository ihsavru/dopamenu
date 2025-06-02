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
  IonButton,
  IonCardTitle,
  IonBadge,
  IonProgressBar,
  IonList,
  IonIcon,
  IonItem,
} from "@ionic/react"
import { trashOutline } from "ionicons/icons"
import { useEffect, useState } from "react"
import {
  MENU_ITEM_TYPES,
  DisplayMenuItem,
  MenuItemTypeKey,
} from "../utils/constants/menu"
import { fetchMenuItems, deleteMenuItem } from "../api/menuItems"
import { useQuery } from "@tanstack/react-query"
import "./Menu.css"
import { MenuItem } from "../types/menu"
import { useUserContext } from "../hooks/useUserContext"
import { queryClient } from "../api/client"
import { useMutation } from "@tanstack/react-query"

import AddItemModal from "../components/AddItemModal"

type Props = {}

const Item = ({ item, isFetching }: { item: MenuItem, isFetching: boolean }) => {
  const [present] = useIonToast()

  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] })
    },
    onError: (error) => {
      present({
        message: error.message,
        duration: 3000,
      })
    },
  })

  return (
    <IonItem>
      <IonBadge color='light' slot='end' onClick={() => deleteItem(item.id)}>
        <IonButton fill='clear' size='small' disabled={isDeleting || isFetching}>
          <IonIcon aria-hidden='true' icon={trashOutline} />
        </IonButton>
      </IonBadge>
      <p>{item.name}</p>
    </IonItem>
  )
}

const Menu: React.FC<Props> = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const { user } = useUserContext()
  const [present] = useIonToast()

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["menu-items", user?.id],
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
              <IonList lines='inset'>
                {item.items.map((item) => (
                  <Item key={item.id} item={item} isFetching={isFetching} />
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
