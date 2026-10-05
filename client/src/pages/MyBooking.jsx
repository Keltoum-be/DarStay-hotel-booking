import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import Title from "../Components/title";
import { assets } from "../assets/assets";

const MyBooking = () => {
    const { user } = useUser()
    const API = import.meta.env.VITE_API_URL
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const email = user?.primaryEmailAddress?.emailAddress

    useEffect(() => {
        if (!email) return
        setLoading(true)
        fetch(`${API}/bookings?email=${encodeURIComponent(email)}`)
          .then(res => {
                if (!res.ok) throw new Error("Failed to fetch bookings")
                return res.json()
            })
          .then(d => {
                const list = Array.isArray(d)? d : d.bookings || []
                setBookings(list)
            })
          .catch(err => console.error(err))
          .finally(() => setLoading(false))
    }, [email, API])

    return (
        <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
            <Title title="My Bookings" subTitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks" align='left'/>

            <div className="max-w-6xl mt-8 w-full text-gray-800">
                <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
                    <div>Hotels</div>
                    <div>Date and Timings</div>
                    <div>Payment</div>
                </div>

                {loading && <p className="mt-10 text-gray-500">Loading your bookings...</p>}
                {!loading && bookings.length===0 && <p className="mt-10 text-gray-500">No bookings yet.</p>}

                {bookings.map((booking)=>(
                    <div key={booking._id} className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t">
                         <div className="flex flex-col md:flex-row">
                            <img src={booking.room?.images?.[0] || "https://via.placeholder.com/200x150?text=No+Image"} alt="hotel-img" className="min-md:w-44 h-32 rounded shadow object-cover"/>
                            <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                                <p className="font-playfair text-2xl">{booking.room?.hotel?.name || booking.hotelName || "Hotel"}
                                <span className="font-inter text-sm"> {booking.room?.roomType}</span></p>
                               <div className="flex items-center gap-1 text-sm text-gray-500">
                                <img src={assets.locationIcon} alt="location-icon" />
                                <span>{booking.room?.hotel?.address || booking.room?.hotel?.city || "Address"}</span>
                               </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                <img src={assets.guestsIcon} alt="guests-icon" />
                                <span>Guests: {booking.guests}</span>
                               </div>
                               <p className="text-base font-bold">Total : ${booking.totalPrice}</p>
                            </div>
                         </div>
                         <div className="flex flex-row md:gap-12 mt-3 gap-8">
                            <div>
                                <p>Check-In:</p>
                                <p className="text-gray-500 text-sm">{new Date(booking.checkInDate).toDateString()}</p>
                            </div>
                             <div>
                                <p>Check-Out:</p>
                                <p className="text-gray-500 text-sm">{new Date(booking.checkOutDate).toDateString()}</p>
                            </div>
                         </div>
                         <div className="flex items-start mt-3 md:mt-0">
                            <span className={`text-xs px-3 py-1 rounded-full capitalize ${booking.status==="confirmed"?"bg-green-100 text-green-600":booking.status==="cancelled"?"bg-red-100 text-red-600":"bg-amber-100 text-amber-600"}`}>{booking.status || "pending"}</span>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default MyBooking;