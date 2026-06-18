import React from 'react';
import Image from 'next/image';
import styles from './Card2.module.css' // Update the path accordingly


const Card2 = () => {
    return (
        <div className={styles.image}>
            <Image src={'/images/match.svg'} alt="Match" width={273} height={135} />
            {/* <Image src={hug} alt="Hug" width={135} height={fixed} /> */}
        </div>
    );
}

export default Card2;
