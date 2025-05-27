import { useState } from "react"
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
} from "@ionic/react"
import { supabase } from "../supabaseClient"

export function LoginPage() {
  const [email, setEmail] = useState("")

  const [showLoading, hideLoading] = useIonLoading()
  const [showToast] = useIonToast()
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await showLoading()

    try {
      const { data, error } = await supabase.auth.signInWithOtp({ email })

      if (error) {
        await showToast({
          message: error.message,
          duration: 3000,
        })
        throw error
      }

      await showToast({
        message: "Check your email for the login link!",
        duration: 3000,
      })
    } catch (e: any) {
      await showToast({
        message: e.message || "An error occurred",
        duration: 5000,
        color: "danger",
      })
    } finally {
      await hideLoading()
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className='ion-padding'>
          <h1>Supabase + Ionic React</h1>
          <p>Sign in via magic link with your email below</p>
        </div>
        <IonList inset={true}>
          <form onSubmit={handleLogin}>
            <IonItem>
              <IonLabel position='stacked'>Email</IonLabel>
              <IonInput
                value={email}
                name='email'
                onIonChange={(e) => setEmail(e.detail.value ?? "")}
                type='email'
              ></IonInput>
            </IonItem>
            <div className='ion-text-center'>
              <IonButton type='submit' fill='clear'>
                Login
              </IonButton>
            </div>
          </form>
        </IonList>
      </IonContent>
    </IonPage>
  )
}
