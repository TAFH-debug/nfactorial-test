import React from 'react';
import Image from 'next/image';
import match from '/public/images/image.png'; // Update the path accordingly


const Card3 = () => {
    return (
        <div>
            <Image src={match} alt="Match" width={191} height={235} />
            {/* <Image src={hug} alt="Hug" width={135} height={fixed} /> */}
        </div>
    );
}

export default Card3;
