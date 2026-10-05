import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../Components/StarRating";

const RoomDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { openSignIn } = useClerk()
    const { user } = useUser()
    const API = import.meta.env.VITE_API_URL

    const [checkInDate, setCheckInDate] = useState("")
    const [checkOutDate, setCheckOutDate] = useState("")
    const [guests, setGuests] = useState(1)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState(null)
    const [room, setRoom] = useState(null)
    const [mainImage, setMainImage] = useState(null)

    useEffect(() => {
        // حيدنا ngrok - خدام مباشر
        fetch(`${API}/rooms/${id}`)
          .then(res => { if(!res.ok) throw new Error("Room not found"); return res.json() })
          .then(data => {
                const roomData = data.room || data
                setRoom(roomData);
                setMainImage(roomData.images?.[0] || "https://via.placeholder.com/800x600?text=No+Image")
            })
          .catch(err => {
                console.error(err)
                setMessage("Room not found")
            })
    }, [id, API])

    const handleBooking = async (e) => {
        e.preventDefault()
        if (!user) return openSignIn()
        setSubmitting(true); setMessage(null)
        try {
            const res = await fetch(`${API}/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomId: id,
                    checkInDate,
                    checkOutDate,
                    guests: Number(guests),
                    user: {
                      name: user.fullName,
                      email: user.primaryEmailAddress?.emailAddress
                    }
                })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.msg || "Booking failed")
            navigate("/my-bookings"); window.scrollTo(0,0)
        } catch (err) {
            setMessage(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (!room) return <div className="py-40 text-center">Loading room... {message}</div>

    return (
        <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <h1 className="text-3xl md:text-4xl font-playfair">{room.hotel?.name} <span className="font-inter text-sm">{room.roomType}</span></h1>
                <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">20% OFF</p>
            </div>
             <div className="flex items-center gap-1 mt-2">
                <StarRating/><p className="ml-2">200+ reviews</p>
             </div>
             <div className="flex items-center gap-1 text-gray-500 mt-2">
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.hotel?.address || room.hotel?.city}</span>
             </div>

             <div className="flex flex-col lg:flex-row mt-6 gap-6">
                <div className="lg:w-1/2 w-full">
                    <img src={mainImage} alt="room" className="w-full rounded-xl shadow-lg object-cover h-[400px]" onError={(e) => e.target.src = "https://via.placeholder.com/800x600?text=No+Image"} />
                </div>
                <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
                    {room?.images?.length > 1 && room.images.map((image,index)=>(
                        <img onClick={()=>setMainImage(image)} key={index} src={image} alt="room" className={`w-full h-48 rounded-xl shadow-md object-cover cursor-pointer ${mainImage==image && ' outline-3 outline-orange-500'}`} />
                    ))}
                </div>
             </div>

             <div className="flex flex-col md:flex-row md:justify-between mt-10">
                <div className="flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-playfair">Experience Luxury Like Never Before</h1>
                    <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                        {room.amenities?.map((item,index)=>(
                            <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
                                <img src={facilityIcons[item]} alt={item} className="w-5 h-5"/>
                                <p className="text-xs">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                 <p className="text-2xl font-medium">${room.pricePerNight}/night</p>
              </div>

               <form onSubmit={handleBooking} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl">
                <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500 ">
                    <div className="flex flex-col">
                        <label className="font-medium">Check-In</label>
                        <input type="date" value={checkInDate} onChange={e=>setCheckInDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none" required/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium">Check-Out</label>
                        <input type="date" value={checkOutDate} onChange={e=>setCheckOutDate(e.target.value)} min={checkInDate} disabled={!checkInDate} className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none" required/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium">Guests</label>
                        <input type="number" min={1} max={4} value={guests} onChange={e=>setGuests(e.target.value)} className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none" required/>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-2 max-md:mt-6 md:ml-10">
                    <button type="submit" disabled={submitting} className="bg-black hover:bg-gray-800 text-white rounded-md md:px-10 py-3 text-base cursor-pointer disabled:opacity-50 w-full">
                        {submitting? "Booking..." : "Book Now"}
                    </button>
                    {message && <p className="text-sm text-red-500">{message}</p>}
                </div>
               </form>
        </div>
    )
}
export default RoomDetails;