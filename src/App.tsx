// App.tsx
import { useEffect, useRef } from "react";
import "./App.css";
import { imageInfo } from "./utils"; // Assuming imageInfo is an array of objects with a transform property
import bg from "./assets/shahjahan_lede-1050_x2.jpg";
function App() {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // IntersectionObserver callback function
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imageRef.current) {
            // Get index from data attribute and ensure it's a valid number
            const index = Number(entry.target.getAttribute("data-index"));

            // Check if index is valid within the bounds of the imageInfo array
            if (!isNaN(index) && index >= 0 && index < imageInfo.length) {
              const transform = imageInfo[index].transform;

              // Update the transform style of imageRef safely
              imageRef.current.style.transform = transform || "none";
            }
          }
        });
      },
      {
        root: null, // Use the viewport as the root
        threshold: 0.5, // Trigger when 50% of the element is in view
      },
    );

    // Observe each image container
    containerRefs.current.forEach((container) => {
      if (container) {
        observer.observe(container);
      }
    });

    // Cleanup observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, []); // No need to add dependencies since refs are managed and imageInfo is static

  return (
    <div className="main-container">
      <div className="image-main-container">
        <div className="img-container" ref={imageRef}>
          <img src={bg} alt="bg" className="bg-image" />
        </div>
      </div>
      <div className="content-container">
        {imageInfo.map((image, index) => (
          <div
            key={index}
            className={`info-container ${image.className}`}
            data-index={index.toString()} // Set index as a string for the data attribute
            ref={(el) => (containerRefs.current[index] = el)} // Save references to each container
          >
            <div className="image-info ">{image.info}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
