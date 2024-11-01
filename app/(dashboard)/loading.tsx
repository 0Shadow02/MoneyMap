import React from 'react';
import animeConfusedGif from "./anime-confused.gif";

const Loading: React.FC = () => {
    return (
        <div className=' flex justify-center items-center mt-20' style={{ textAlign: 'center', padding: '20px' }}>
            <div>
                <img src={animeConfusedGif.src} alt="Loading" />
            </div>
        </div>
    );
};

export default Loading;