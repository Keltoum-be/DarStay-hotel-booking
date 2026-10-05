import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const HotelCard = ({ room }) => {
  // إلا ما كايناش تصويرة نحطو placeholder
  const image = room.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"
  const hotelName = room.hotel?.name || room.hotelName || "Hotel"
  const location = room.hotel?.city || room.hotel?.address || "Marrakech"

  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="block relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all"
    >
      <img
        src={image}
        alt={room.roomType}
        className="w-full h-56 object-cover"
        onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=No+Image"}
      />
      <div className="p-4 pt-5">
        <div className="flex items-center justify-between">
          <p className="font-playfair text-xl font-medium text-gray-800 truncate">{hotelName}</p>
          <div className="flex items-center gap-1 text-sm">
            <img src={assets.starIconFilled} alt="star" className="w-4 h-4" />4.5
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm mt-1">
          <img src={assets.locationIcon} alt="location" className="w-4 h-4" />
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p><span className="text-xl font-bold text-gray-800">${room.pricePerNight}</span><span className="text-sm">/night</span></p>
          <span className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-full hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all">Book Now</span>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;