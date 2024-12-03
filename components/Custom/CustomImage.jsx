// components/CustomImage.js
"use client"
import { useState } from 'react';

const CustomImage = ({ src, alt, fallbackSrc,className,  ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={className + ' overflow-hidden'}>
      <img
        src={isLoaded ? src : fallbackSrc}
        alt={alt}
        className='block rounded w-18 h-32 scale-[1.2] -translate-y-2 -translate-x-2'
        onLoad={handleImageLoad}
        {...props}
      />
    </div>
  );
};

export default CustomImage;
