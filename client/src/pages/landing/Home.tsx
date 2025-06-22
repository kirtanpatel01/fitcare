import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
// import DashboardPage from "../dashboard/DashboardPage"

function Home() {
  return (
    <div>
      <Link to={'/login'}>
        <Button variant={"link"} className="cursor-pointer" >Login</Button>
      </Link>

      <Link to={'/dashboard'}>
        <Button variant={"link"} className="cursor-pointer" >Dashboard</Button>
      </Link>

      {/* <DashboardPage /> */}
    </div>
  )
}

export default Home