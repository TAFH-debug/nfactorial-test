import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ImageLoader.module.css';

const ImageWithLoader = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`${styles.imageWrapper} ${className}`}>
      {isLoading && (
        <div className={styles.loaderWrapper}>
          <div className={styles.spinner} />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoadingComplete={() => setIsLoading(false)}
        style={{ 
          visibility: isLoading ? 'hidden' : 'visible',
          width: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
};

export default ImageWithLoader;