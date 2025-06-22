import api from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface Profile {
  _id: string;
  user: string;
  age: number;
  gender: string;
  state: string;
  city: string;
  height: number;
  hUnit: "cm" | "m" | "ft" | "in";
  weight: number;
  wUnit: "kg" | "g" | "lbs";
  goal: "gain" | "loss";
  target: number;
  tUnit: "kg" | "g" | "lbs";
  activity: string;
  food: string;
  taste: string[];
  bmr: Number,
  tdee: Number,
  targetCalories: Number
  createdAt: string;
  updatedAt: string;
}

interface ProfileContextType {
  profileData: Profile | null;
  isLoading: boolean;
}

const ProfileContex = createContext<ProfileContextType>({
  profileData: null,
  isLoading: true,
})

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await api.get('/profile')
        if (res.status === 200) {
          setProfileData(res.data.profile)
        }
      } catch (error: any) {
        console.log("Error while fetching profile data: ", error)
        toast.error(error.response.data.error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  if (isLoading) return <div>Loading...</div>

  return (
    <ProfileContex.Provider value={{ profileData, isLoading }}>
      {children}
    </ProfileContex.Provider>
  )
}

export const useProfile = () => {
  const context = useContext(ProfileContex)
  if(!context) throw new Error("useProfile must be used within ProfileProvider")
  return context
}