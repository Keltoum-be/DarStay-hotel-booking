import { useEffect, useState } from "react"
 
/**
 * Smooth slideshow: crossfade + slow Ken Burns zoom.
 * images: [{ src, focusY }]  (focusY 0-100 = vertical crop position)
 */
const SmoothSlideshow = ({
  images,
  interval = 5500,   // time each image stays (ms)
  fade = 1600,       // crossfade duration (ms)
  zoom = 1.08,       // end scale of the slow zoom
  freeze = false,
  className,
}) => {
  const [index, setIndex] = useState(0)
 
  useEffect(() => {
    if (freeze || images.length < 2) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [images.length, interval, freeze])
 
  const zoomTime = interval + fade * 2
 
  return (
    <div className={className} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <style>{`
        @keyframes kenburns {
          from { transform: scale(1); }
          to   { transform: scale(${zoom}); }
        }
      `}</style>
      {images.map((img, i) => {
        const active = i === index
        return (
          <img
            key={i}
            src={img.src}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: `50% ${img.focusY ?? 50}%`,
              opacity: active ? 1 : 0,
              zIndex: active ? 1 : 0,
              transition: `opacity ${fade}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              // zoom restarts each time the image becomes active
              animation: active && !freeze ? `kenburns ${zoomTime}ms ease-out forwards` : "none",
              willChange: "opacity, transform",
            }}
          />
        )
      })}
    </div>
  )
}
 
export default SmoothSlideshow
 