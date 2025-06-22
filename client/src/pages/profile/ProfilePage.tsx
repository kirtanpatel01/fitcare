import api from "@/lib/api"
import { useEffect, useState } from "react"

function ProfilePage() {
  const [ user, setUser ] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get('/user/profile')
        console.log(res.data)
        setUser(res.data)
      } catch (error) {
        console.log(error)
      }
    } 
    getUser()
  }, [])

  console.log(user)

  return (
    <div>ProfilePage</div>
  )
}

export default ProfilePage