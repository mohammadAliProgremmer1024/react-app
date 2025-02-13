import { useState } from "react";
import PropTypes from 'prop-types';
import './star.css';


function Star({full, onRate, onEnter, onLeave, starSize}) {

    const style = {
        width: `${starSize}px`, 
        height: `${starSize}px`, 
    }
    return ( 
    <div className="containStyle-a0wws0ffds" role="button" onClick={onRate} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        { full ? (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            style={style}
            className="star-a0wws0ffds"
        >
            <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
        </svg>) : (<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        style={style}
        className="star-a0wws0ffds starNot-a0wws0ffds"
        >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
        </svg>)
        }
    </div>
    )
};


StarRaiting.propTypes = {
    maxRaiting: PropTypes.number.isRequired, 
    classBox: PropTypes.string, 
    classSectionTop: PropTypes.string,
    classStars: PropTypes.string,
    classContainStar: PropTypes.string, 
    classStar: PropTypes.string, 
    classStarNot: PropTypes.string, 
    classBtn: PropTypes.string,
    onClick: PropTypes.func, 
    textBtn: PropTypes.string
}

function StarRaiting({
    maxRaiting=5, 
    starSize=25,
    className='', 
    onClick=()=>{}, 
    }) {
    
    const [raiting, setRaiting] = useState(0);
    const [ tempRaiting, setTampRaiting ] = useState(0);
    
    function rateHandler(i) {
        setRaiting(_ => i+1);
        onClick(i+1);
    }

    const textStyle = {
        fontSize: `${starSize*.9}px`
    }
    return (
    <div className={"starRaitingStyle-a0wws0ffds".concat(` ${className}`)}>
        <dir className="stars-a0wws0ffds">
            { Array.from({length: maxRaiting}).map( (_, i) => (
                <Star
                starSize={starSize}
                key={i} 
                full={tempRaiting ? tempRaiting>=i+1: raiting >= i+1} 
                onRate={() => rateHandler(i)} 
                onEnter={() => setTampRaiting(i+1)} 
                onLeave={() => setTampRaiting(0)}
                />
            ) ) }
        </dir>
        <p className="star-title-a0wws0ffds" style={textStyle}>{tempRaiting || raiting || ''}</p>
    </div>
    );
}

export default StarRaiting;
