import React from "react";

const showcaseItems = [
  { brand: "nexus", image: "display_img_1.png" },
  { brand: "iphone", image: "display_img_2.png", active: true },
  { brand: "samsung", image: "display_img_3.png" },
  { brand: "htc", image: "display_img_4.png" },
  { brand: "alcatel", image: "display_img_5.png" },
  { brand: "pixel", image: "display_img_6.png" },
  { brand: "vivo", image: "display_img_7.png" },
];

const MobileShowcase = () => {
  return (
    <div className="space-medium">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showcaseItems.slice(0, 3).map((item, index) => (
            <div key={index} className={`showcase-block ${item.active ? "active" : ""}`}>
              <div className="display-logo flex justify-center">
                <img src={`./src/./img/${item.brand}.png`} alt={item.brand} className="h-12" />
              </div>
              <div className="showcase-img flex justify-center">
                <img src={`./src/./img/${item.image}`} alt={item.brand} className="h-40 object-cover" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {showcaseItems.slice(3).map((item, index) => (
            <div key={index} className="showcase-block">
              <div className="display-logo flex justify-center">
                <img src={`./src/./img/${item.brand}.png`} alt={item.brand} className="h-12" />
              </div>
              <div className="showcase-img flex justify-center">
                <img src={`./src/./img/${item.image}`} alt={item.brand} className="h-40 object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileShowcase;
