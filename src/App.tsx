import { Redirect, Route } from "react-router-dom"
import React, { useEffect, useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./api/client"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import { homeOutline, listOutline, personCircleOutline } from "ionicons/icons"
import Home from "./pages/Home"
import Menu from "./pages/Menu"
import Cart from "./pages/Cart"
import { LoginPage } from "./pages/Login"
import { AccountPage } from "./pages/Account"
import VerifyOtp from "./pages/VerifyOtp"
import Profile from "./pages/Profile"
import { CartContextProvider } from "./context/CartContext"
import { UserContextProvider } from "./context/UserContext"
import { supabase } from "./supabaseClient"
import { PrivateRoute } from "./components/PrivateRoute"

import "@ionic/react/css/core.css"
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"
import "@ionic/react/css/padding.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/display.css"
import "@ionic/react/css/palettes/dark.system.css"
import "./theme/variables.css"

setupIonicReact()

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    })
  )
)

const App: React.FC = () => {
  const [showDevtools, setShowDevtools] = React.useState(false)

  React.useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => {
      listener.subscription?.unsubscribe()
    }
  }, [])

  const tabs = (
    <IonTabBar slot='bottom'>
      <IonTabButton tab='home' href='/home'>
        <IonIcon aria-hidden='true' icon={homeOutline} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab='menu' href='/menu'>
        <IonIcon aria-hidden='true' icon={listOutline} />
        <IonLabel>Menu</IonLabel>
      </IonTabButton>
      <IonTabButton tab='profile' href='/profile'>
        <IonIcon aria-hidden='true' icon={personCircleOutline} />
        <IonLabel>You</IonLabel>
      </IonTabButton>
    </IonTabBar>
  )

  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <CartContextProvider>
          <IonApp>
            <IonReactRouter>
              <IonTabs>
                <IonRouterOutlet>
                  <Route
                    exact
                    path='/'
                    render={() =>
                      session ? <Redirect to='/home' /> : <LoginPage />
                    }
                  />
                  <Route exact path='/verify-otp' component={VerifyOtp} />
                  <PrivateRoute
                    exact
                    path='/account'
                    component={AccountPage}
                    session={session}
                  />
                  <PrivateRoute
                    session={session}
                    exact
                    path='/home'
                    component={Home}
                  />
                  <PrivateRoute
                    session={session}
                    exact
                    path='/menu'
                    component={Menu}
                  />
                  <PrivateRoute
                    session={session}
                    exact
                    path='/cart'
                    component={Cart}
                  />
                  <PrivateRoute
                    session={session}
                    exact
                    path='/profile'
                    component={Profile}
                  />
                </IonRouterOutlet>
                {session && tabs}
              </IonTabs>
            </IonReactRouter>
          </IonApp>
        </CartContextProvider>
      </UserContextProvider>
      <ReactQueryDevtools initialIsOpen />
      {showDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </React.Suspense>
      )}
    </QueryClientProvider>
  )
}

export default App
