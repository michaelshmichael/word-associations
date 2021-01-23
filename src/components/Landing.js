import React from 'react';
import '../styles/Landing.scss';

export default function Landing() {
    
    return (
        <div className='landing-container'>
            <div className='landing-blurb'>
                <h2>Work with Synonyms!</h2>
            </div>
            <button className='registration-button' href='registration'>Register</button>
        </div>
    );
}