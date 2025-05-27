import { Redirect, Route } from "react-router-dom"
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
import { MenuContextProvider } from "./context/MenuContext"

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/display.css"

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css"

/* Theme variables */
import "./theme/variables.css"
import { CartContextProvider } from "./context/CartContext"
import Profile from "./pages/Profile"
import { UserContextProvider } from "./context/UserContext"

setupIonicReact()

const App: React.FC = () => {
  return (
    <UserContextProvider>
      <MenuContextProvider>
        <CartContextProvider>
          <IonApp>
            <IonReactRouter>
              <IonTabs>
                <IonRouterOutlet>
                  <Route exact path='/home'>
                    <Home />
                  </Route>
                  <Route exact path='/menu'>
                    <Menu />
                  </Route>
                  <Route exact path='/cart'>
                    <Cart />
                  </Route>
                  <Route exact path='/profile'>
                    <Profile />
                  </Route>
                  <Route exact path='/'>
                    <Redirect to='/home' />
                  </Route>
                </IonRouterOutlet>
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
              </IonTabs>
            </IonReactRouter>
          </IonApp>
        </CartContextProvider>
      </MenuContextProvider>
    </UserContextProvider>
  )
}

export default App
