import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
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
import {
  trashOutline,
  chevronDownOutline,
  chevronUpOutline,
} from "ionicons/icons"
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

const Item = ({
  item,
  isFetching,
}: {
  item: MenuItem
  isFetching: boolean
}) => {
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
        <IonButton
          fill='clear'
          size='small'
          disabled={isDeleting || isFetching}
        >
          <IonIcon aria-hidden='true' icon={trashOutline} />
        </IonButton>
      </IonBadge>
      <p>{item.name}</p>
    </IonItem>
  )
}

const MenuCard = ({ item, isFetching }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{item.title}</IonCardTitle>
        <IonCardSubtitle>{item.subtitle}</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        <div className='menu__type-image'></div>
        <p className='ion-padding-top ion-padding-bottom'>{item.description}</p>
        {expanded ? (
          <>
            <IonList lines='inset'>
              {item.items.map((item) => (
                <Item key={item.id} item={item} isFetching={isFetching} />
              ))}
            </IonList>

            <AddItemModal item={item} />
            <IonButton
              fill='clear'
              expand='full'
              onClick={() => setExpanded(false)}
            >
              <IonIcon aria-hidden='true' icon={chevronUpOutline} />
            </IonButton>
          </>
        ) : (
          <IonButton
            fill='clear'
            expand='full'
            onClick={() => setExpanded(true)}
          >
            <IonIcon aria-hidden='true' icon={chevronDownOutline} />
          </IonButton>
        )}
      </IonCardContent>
    </IonCard>
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
        <IonToolbar color='dark'>
          <IonTitle>
            <IonImg
              src='/assets/logo-text.png'
              alt='logo'
              className='ion-margin ion-padding'
            ></IonImg>
          </IonTitle>
          {isLoading && <IonProgressBar type='indeterminate'></IonProgressBar>}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='menu__header'></div>
        {displayItems.map((item) => (
          <MenuCard key={item.type} item={item} isFetching={isFetching} />
        ))}
      </IonContent>
    </IonPage>
  )
}

export default Menu
