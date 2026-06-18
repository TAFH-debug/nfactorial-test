import React from 'react';
import Image from 'next/image';

const Card3 = () => {
    return (
        <div>
            <Image src={'/images/image.png'} alt="Match2" width={191} height={235} />
            {/* <Image src={hug} alt="Hug" width={135} height={fixed} /> */}
        </div>
    );
}

export default Card3;
