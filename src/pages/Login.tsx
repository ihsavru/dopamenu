import { useState } from "react"
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
} from "@ionic/react"
import { supabase } from "../supabaseClient"
import { useIonRouter } from "@ionic/react"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const router = useIonRouter()
  const [showLoading, hideLoading] = useIonLoading()
  const [showToast] = useIonToast()
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await showLoading()

    try {
      const { error } = await supabase.auth.signInWithOtp({ email })

      if (error) {
        await showToast({
          message: error.message,
          duration: 3000,
        })
        throw error
      }

      await showToast({
        message: "Check your email for the login code!",
        duration: 3000,
      })
      router.push(`/verify-otp?email=${email}`)
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
          <p>Sign in via OTP with your email below</p>
        </div>
        <IonList inset={true}>
          <form onSubmit={handleLogin}>
            <IonItem>
              <IonInput
                fill='solid'
                label='Email'
                labelPlacement='stacked'
                value={email}
                name='email'
                onIonInput={(e) => setEmail(e.detail.value ?? "")}
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
