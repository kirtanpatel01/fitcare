import api from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface CalorieType {
  time: string;
  cal: number;
}

interface AllCalorieType {
  cal: number;
  createdAt: string;
  time: string;
  updatedAt: string 
  user: string;
}

interface CaloriesContextType {
  calories: CalorieType[];
  setCalories: React.Dispatch<React.SetStateAction<CalorieType[]>>;
  allCal: AllCalorieType[];
  isLoading: boolean;
  refreshCal: () => void;
  refreshAllCal: () => void;
}

const CaloriesContex = createContext<CaloriesContextType | undefined>(undefined)

export const CaloriesProvider = ({ children }: { children: React.ReactNode }) => {
  const [ calories, setCalories ] = useState<CalorieType[]>([]);
  const [ allCal, setAllCal ] = useState<AllCalorieType[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);

  const getCalData = async() => {
    try {
      const res = await api.get("/calories/get");
      if(res.status === 200) {
        if(res.data.calories) {
          setCalories(res.data.calories)
        }
      }
    } catch (error: any) {
      console.log("Error while fetching the calories data: ", error.response.data.error)
      toast.error("Error while fetching the calories data!")
    } finally {
      setIsLoading(false)
    }
  }

  const getAllData = async() => {
    try {
      const res = await api.get("/calories/get-all");
      if(res.status === 200) {
        if(res.data.calories) {
          setAllCal(res.data.calories)
        }
      }
    } catch (error: any) {
      console.log("Error while fetching the calories data: ", error.response.data.error)
      toast.error("Error while fetching the calories data!")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCalData()
    getAllData()
  }, [])

  return (
    <CaloriesContex.Provider 
    value={{ 
      calories, 
      allCal,
      setCalories, 
      isLoading, 
      refreshCal: getCalData, 
      refreshAllCal: getAllData 
    }}>
      { children }
    </CaloriesContex.Provider>
  )
}

export const useCalories = () => {
  const context = useContext(CaloriesContex)
  if(!context) throw new Error("useCalories must be used within CaloriesProvider!")
    return context
}