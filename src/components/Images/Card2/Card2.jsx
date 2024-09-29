import React from 'react';
import Image from 'next/image';
import match from '/public/images/match.svg';
import styles from './Card2.module.css' // Update the path accordingly


const Card2 = () => {
    return (
        <div className={styles.image}>
            <Image src={match} alt="Match" width={273} height={135} />
            {/* <Image src={hug} alt="Hug" width={135} height={fixed} /> */}
        </div>
    );
}

export default Card2;
