import { DataProvider } from './context/DataContext'
import { SeasonProvider } from './context/SeasonContext'
import { LanguageProvider } from './context/LanguageContext'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes'

export default function App() {
  return (
    <DataProvider>
      <SeasonProvider>
        <LanguageProvider>
          <ToastProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ToastProvider>
        </LanguageProvider>
      </SeasonProvider>
    </DataProvider>
  )
}
