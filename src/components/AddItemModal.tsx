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
  useIonActionSheet,
} from "@ionic/react"
import { MenuItem } from "../types/menu"
import { addCircleOutline } from "ionicons/icons"
import { useMenuContext } from "../hooks/useMenuContext"

function AddItemModal({ item }) {
  const { setMenuItems } = useMenuContext()
  const [newItem, setNewItem] = useState<MenuItem>({
    name: "",
    description: "",
    type: item.type,
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
    setMenuItems((prev) => [...prev, newItem])
    modal.current?.dismiss()
  }

  function canDismiss() {
    return new Promise<boolean>((resolve, reject) => {
      present({
        header: "Are you sure?",
        buttons: [
          {
            text: "Yes",
            role: "confirm",
          },
          {
            text: "No",
            role: "cancel",
          },
        ],
        onWillDismiss: (event) => {
          if (event.detail.role === "confirm") {
            resolve(true)
          } else {
            reject()
          }
        },
      })
    })
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
        canDismiss={canDismiss}
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
                onIonChange={(e) => setNewItem({ ...newItem, name: e.detail.value! })}
              ></IonInput>
            </IonItem>

            <IonItem>
              <IonInput
                label='Description (Optional)'
                labelPlacement='stacked'
                placeholder='A walk in the park or around the block'
                value={newItem.description}
                onIonChange={(e) => setNewItem({ ...newItem, description: e.detail.value! })}
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
