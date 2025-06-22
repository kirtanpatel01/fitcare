// hooks/useLocation.ts
import { useEffect, useState } from "react"

export function useLocationAPI() {
  const [states, setStates] = useState<{ name: string }[]>([])
  const [cities, setCities] = useState<{ name: string }[]>([])
  const [loadingCities, setLoadingCities] = useState(false)

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states")
      .then((res) => res.json())
      .then((data) => {
        const india = data.data.find((c: any) => c.name === "India")
        setStates(india.states)
      })
  }, [])

  const fetchCities = async (stateName: string) => {
    setLoadingCities(true)
    const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: "India",
        state: stateName,
      }),
    })

    const json = await res.json()
    setCities(json.data.map((name: string) => ({ name })))
    setLoadingCities(false)
  }

  return { states, cities, fetchCities, loadingCities }
}
