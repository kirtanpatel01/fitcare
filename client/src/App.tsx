import { Routes, Route } from 'react-router-dom'
import Home from "./pages/landing/Home"
import LoginPage from "./pages/login/LoginPage"
import SignUpPage from "./pages/signup/SignUpPage"
import ProtectedRoute from './components/protected-route'
import DashboardPage from './pages/dashboard/DashboardPage'
import ExercisePage from './pages/exercise/ExercisePage'
import DietPlanPage from './pages/diet-plan/DietPlanPage'
import ProfilePage from './pages/profile/ProfilePage'
import ProtectedLayout from './components/protected-layout.tsx'
import OnboardingPage from './pages/onboarding/OnboardingPage.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/exercise" element={<ExercisePage />} />
          <Route path="/diet-plan" element={<DietPlanPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
