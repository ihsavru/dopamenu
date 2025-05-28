import React, { useState, useRef, useEffect } from "react"
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  useIonToast,
  useIonActionSheet,
} from "@ionic/react"
import { MenuItem } from "../types/menu"
import { addCircleOutline } from "ionicons/icons"
import { createMenuItem } from "../api/menuItems"
import { useMutation } from "@tanstack/react-query"
import { useUserContext } from "../hooks/useUserContext"
import { queryClient } from "../api/client"

function AddItemModal({ item }) {
  const [newItem, setNewItem] = useState<MenuItem>({
    name: "",
    description: "",
    type: item.type,
  })

  const [presentToast] = useIonToast()

  const { mutate: addMenuItem } = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] })
      setNewItem({
        name: "",
        description: "",
        type: item.type,
      })
      modal.current?.dismiss()
    },
  })

  const modal = useRef<HTMLIonModalElement>(null)
  const page = useRef(null)

  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null)
  const [present] = useIonActionSheet()

  useEffect(() => {
    setPresentingElement(page.current)
  }, [])

  function dismiss() {
    modal.current?.dismiss()
  }

  function saveItem() {
    if (!newItem.name) {
      presentToast({
        message: "Please enter a name",
        duration: 2000,
      })
      return
    }
    addMenuItem(newItem)
  }

  return (
    <>
      <IonButton id={`${item.type}-modal`} size='small' color={"light"}>
        <IonIcon slot='start' icon={addCircleOutline}></IonIcon>
        Add Items
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`${item.type}-modal`}
        presentingElement={presentingElement!}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add {item.title}</IonTitle>
            <IonButtons slot='end'>
              <IonButton onClick={() => dismiss()}>Cancel</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
          <IonList>
            <IonItem>
              <IonInput
                label='Title'
                labelPlacement='stacked'
                placeholder='Walk'
                value={newItem.name}
                onIonChange={(e) =>
                  setNewItem({ ...newItem, name: e.detail.value! })
                }
              ></IonInput>
            </IonItem>

            <IonItem>
              <IonInput
                label='Description (Optional)'
                labelPlacement='stacked'
                placeholder='A walk in the park or around the block'
                value={newItem.description}
                onIonChange={(e) =>
                  setNewItem({ ...newItem, description: e.detail.value! })
                }
              ></IonInput>
            </IonItem>
          </IonList>
          <IonButton size='small' onClick={() => saveItem()}>
            Save
          </IonButton>
        </IonContent>
      </IonModal>
    </>
  )
}

export default AddItemModal
