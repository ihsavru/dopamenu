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
} from "@ionic/react"
import { MenuItem } from "../types/menu"
import { addCircleOutline } from "ionicons/icons"
import { createMenuItem, updateMenuItem } from "../api/menuItems"
import { useMutation } from "@tanstack/react-query"
import { useUserContext } from "../hooks/useUserContext"
import { queryClient } from "../api/client"

function AddItemModal({ item }) {
  const { user } = useUserContext()
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
    onError: (error) => {
      presentToast({
        message: error.message,
        duration: 2000,
      })
    },
  })

  const modal = useRef<HTMLIonModalElement>(null)
  const page = useRef(null)

  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null)

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
    addMenuItem({ ...newItem, user_id: user?.id })
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
                onIonInput={(e) =>
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
                onIonInput={(e) =>
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

export function EditItemModal({ item }) {
  const { user } = useUserContext()
  const [updatedItem, setUpdatedItem] = useState<MenuItem>({
    ...item,
  })

  const [presentToast] = useIonToast()

  const { mutate: editItem } = useMutation({
    mutationFn: updateMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] })
      modal.current?.dismiss()
    },
    onError: (error) => {
      presentToast({
        message: error.message,
        duration: 2000,
      })
    },
  })

  const modal = useRef<HTMLIonModalElement>(null)
  const page = useRef(null)

  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null)

  useEffect(() => {
    setPresentingElement(page.current)
  }, [])

  function dismiss() {
    modal.current?.dismiss()
  }

  function saveItem() {
    if (!updatedItem.name) {
      presentToast({
        message: "Please enter a name",
        duration: 2000,
      })
      return
    }
    editItem({ ...updatedItem, user_id: user?.id })
  }

  return (
    <>
      <IonModal
        ref={modal}
        trigger={`edit-${item.id}-modal`}
        presentingElement={presentingElement!}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Item</IonTitle>
            <IonButtons slot='end'>
              <IonButton color={"dark"} onClick={() => dismiss()}>Cancel</IonButton>
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
                value={updatedItem.name}
                onIonInput={(e) =>
                  setUpdatedItem({ ...updatedItem, name: e.detail.value! })
                }
              ></IonInput>
            </IonItem>

            <IonItem>
              <IonInput
                label='Description (Optional)'
                labelPlacement='stacked'
                placeholder='A walk in the park or around the block'
                value={updatedItem.description}
                onIonInput={(e) =>
                  setUpdatedItem({
                    ...updatedItem,
                    description: e.detail.value!,
                  })
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
