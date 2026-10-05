import { useEffect, useState } from "react"
import Title from "./title"
import { useNavigate } from "react-router-dom"

const FeaturedDestination = () => {
  const [rooms, setRooms] = useState([])
  // فـ Vercel غادي نحطو VITE_API_URL = https://darStay-api.vercel.app/api
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API}/rooms`)
        const data = await res.json()
        const list = data.rooms || data
        setRooms(list)
      } catch (err) {
        console.log("API Error:", err)
      }
    }
    fetchRooms()
  }, [API])

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
      <Title title="Featured Destination" subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences." />

      <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
        {rooms.slice(0,4).map((room) => (
          <div key={room._id} onClick={() => navigate(`/rooms/${room._id}`)} className="relative max-w-72 w-full rounded-xl overflow-hidden bg-white shadow hover:shadow-lg cursor-pointer">
            <img src={room.images?.[0]} alt={room.roomType} className="h-56 w-full object-cover" />
            <div className="p-4">
              <p className="font-medium">{room.hotel?.name} - {room.roomType}</p>
              <p className="text-gray-500 text-sm">${room.pricePerNight} / night</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedDestination