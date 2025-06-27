import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

function Home() {
  return (
    <div>
      <Link to={'/login'}>
        <Button variant={"link"} className="cursor-pointer" >Login</Button>
      </Link>
    </div>
  )
}

export default Home