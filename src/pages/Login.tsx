import { useState } from "react"
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonText,
  useIonToast,
  useIonLoading,
} from "@ionic/react"
import { supabase } from "../supabaseClient"
import { useIonRouter } from "@ionic/react"

import "./Login.css"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const router = useIonRouter()
  const [showLoading, hideLoading] = useIonLoading()
  const [showToast] = useIonToast()
  const handleLogin = async (e) => {
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
      <IonContent
        color='dark'
        className='ion-display-flex ion-align-items-center ion-padding'
      >
        <IonText color='primary'>
          <h1 className='login-page__logo ion-text-center'>plateful</h1>
        </IonText>
        <IonText color='primary'>
          <p className='ion-text-center'>
            A plate full of what makes you feel good
          </p>
        </IonText>
        <IonInput
          fill='outline'
          className="login-page__input ion-margin-bottom ion-padding"
          placeholder="Email"
          value={email}
          name='email'
          onIonInput={(e) => setEmail(e.detail.value ?? "")}
          type='email'
        ></IonInput>
        <div className='ion-text-center'>
          <IonButton
            expand='block'
            shape='round'
            type='submit'
            onClick={handleLogin}
            className="ion-text-uppercase"
          >
            Next
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}
