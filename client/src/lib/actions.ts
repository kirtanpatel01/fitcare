import api from "@/lib/api"
import { format } from "date-fns"

export const markActiveDay = async () => {
  const today = format(new Date(), "yyyy-MM-dd")
  try {
    await api.post("/profile/active", { date: today })
  } catch (err) {
    console.error("Failed to mark active day", err)
  }
}
