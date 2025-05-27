// src/components/PrivateRoute.tsx
import { Route, Redirect } from "react-router-dom"

type PrivateRouteProps = {
  component: React.ComponentType<any>
  session: any
  path: string
  exact?: boolean
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  session,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        session ? <Component {...props} /> : <Redirect to='/' />
      }
    />
  )
}
