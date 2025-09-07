import './App.css'
import LeaderboardPage from './components/leaderboard/LeaderboardPage'
import { ThemeProvider } from './components/theme/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <LeaderboardPage />
    </ThemeProvider>
  )
}

export default App
