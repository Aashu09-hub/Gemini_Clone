
import React, { useContext } from 'react';
import './main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const MAIN = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);

    // Debugging logs
    console.log('recentPrompt:', recentPrompt);
    console.log('resultData:', resultData);

    return (
        <div className='main'>
            <div className='nav'>
                <p>Gemini</p>
                <img src={assets.user_icon} alt='User Icon' />
            </div>

            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello, Guys.</span></p>
                            <p>How can I help you?</p>
                        </div>
                        <div className='cards'>
                            <div className='card'>
                                <p>Suggest beautiful places to see on an upcoming road trip</p>
                                <img src={assets.compass_icon} alt='' />
                            </div>
                            <div className='card'>
                                <p>Briefly summarize this concept: urban planning</p>
                                <img src={assets.bulb_icon} alt='' />
                            </div>
                            <div className='card'>
                                <p>Brainstorm team bonding activities for our work retreat</p>
                                <img src={assets.message_icon} alt='' />
                            </div>
                            <div className='card'>
                                <p>Improve the readability of the following code</p>
                                <img src={assets.code_icon} alt='' />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='result'>
                        <div className="result-title">
                            <img src={assets.user_icon} alt='' />
                            <p>{recentPrompt ? String(recentPrompt) : "No prompt available"}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt='' />
                            {loading ? (
                                <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                typeof resultData === 'string' && resultData.trim() !== "" ? (
                                    <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                                ) : (
                                    <p>Error: No valid response from Gemini.</p>
                                )
                            )}
                        </div>
                    </div>
                )}

                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input || ''}
                            type='text'
                            placeholder='Enter a prompt here'
                        />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            {input.trim() ? (
                                <img onClick={() => onSent(input.trim())} src={assets.send_icon} alt="Send" />
                            ) : null}
                        </div>
                    </div>
                    <p className='bottom-info'>
                        Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MAIN;
