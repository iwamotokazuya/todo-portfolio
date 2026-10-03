import { Provider } from './components/ui/provider'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './router/Router'
import { Toaster } from './components/ui/toaster'

export const App = () => {
  return(
    <Provider>
      <Toaster />
      <BrowserRouter>
      <Router />
      </BrowserRouter>
    </Provider>
  )
}