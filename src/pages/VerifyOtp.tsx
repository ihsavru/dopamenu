import React, { useState } from "react"
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonToast,
  IonText,
} from "@ionic/react"
import { supabase } from "../supabaseClient"
import { useUserContext } from "../hooks/useUserContext"
import { useIonRouter } from "@ionic/react"
import { useLocation } from "react-router-dom"

import "./Login.css"

const VerifyOtp: React.FC = () => {
  const { setUser } = useUserContext()
  const location = useLocation<{ email: string }>()
  const params = new URLSearchParams(location.search)

  const email = params.get("email")
  const router = useIonRouter()

  const [otp, setOtp] = useState("")
  const [toastMsg, setToastMsg] = useState("")

  const verifyOtp = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    })

    if (error) {
      setToastMsg(error.message)
    } else if (session) {
      setUser(session.user)
      router.push("/home")
    }
  }

  return (
    <IonPage>
      <IonContent
        color='dark'
        className='ion-display-flex ion-align-items-center ion-padding'
      >
        <IonText color='secondary'>
          <h1 className='ion-text-center'>you're almost there</h1>
        </IonText>
        <IonText color='primary'>
          <p className='ion-text-center'>
            Enter the 6 digit code you’ve received in your email
          </p>
        </IonText>
        <IonInput
          className='login-page__input ion-margin-bottom ion-padding'
          placeholder='6-digit code'
          type='number'
          value={otp}
          onIonInput={(e) => setOtp(e.detail.value!)}
        />
        <IonButton
          expand='block'
          shape='round'
          type='submit'
          className='ion-text-uppercase'
          onClick={verifyOtp}
        >
          Verify
        </IonButton>
        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={3000}
          onDidDismiss={() => setToastMsg("")}
        />
      </IonContent>
    </IonPage>
  )
}

export default VerifyOtp
