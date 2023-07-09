import React, { useState, useRef, useEffect} from 'react';
import './index.css';
import './Service.css';
import Ide from './images/ideX.png';

function Service()
{

    const headingRef=useRef(null);
    const ideRef=useRef(null);

    
    useEffect(() => 
    {
        const observer = new IntersectionObserver((entries, observer) => 
        {
            entries.forEach(entry => 
                {
                  if (entry.isIntersecting) 
                    {
                        console.log(entry);
                      entry.target.classList.add('showService');
                    }
                });
        }, {threshold: 0.6});

        if (headingRef.current) observer.observe(headingRef.current);
        if (ideRef.current) observer.observe(ideRef.current);

        return () => 
        {
            if (headingRef.current) observer.unobserve(headingRef.current);
            if (ideRef.current) observer.unobserve(ideRef.current);
        };
    }, []);

    useEffect(() => 
    {
        const observer = new IntersectionObserver((entries, observer) => 
        {
            entries.forEach(entry => 
                {
                  if (entry.isIntersecting) 
                    {
                        console.log(entry);
                      entry.target.classList.add('showService');
                    }
                });
        }, {threshold: 0.6});


        if (ideRef.current) observer.observe(ideRef.current);

        return () => 
        {
            if (ideRef.current) observer.unobserve(ideRef.current);
        };
    }, []);

    const [isMouse, setIsMouse]=useState(false);
    function handleMouseOver()
    {
        setIsMouse(true);
    }

    function handleMouseLeave()
    {
        setIsMouse(false);
    }

    return(
        <div>
            <div className='service_parent'>
                <div className='service_heading' ref={headingRef}>
                    <h1>What We Have</h1>
                    <div className='service_line'></div>
                </div>

                <div className='ide_container' onMouseEnter={handleMouseOver} onMouseLeave={handleMouseLeave}>
                    <div className='ide' ref={ideRef}>
                        <img src={Ide} alt="IDE background" className={isMouse? 'ide_image ideImageAnimate':'ide_image ideRemoveImageAnimate'}/>
                        <h2 className={isMouse? 'ide_heading ideHeadingAnimate':'ide_heading ideHeadingRemoveAnimate'}>
                            An online IDE which is is linked with ChatGPT. How cool is that?
                        </h2>
                        <div className={isMouse? 'ide_description ideDescriptionAnimate':'ide_description ideDescriptionRemoveAnimate'}>
                            <p>
                            Introducing CodeExplainer, an online IDE connected with ChatGPT. This unique IDE offers code analysis and explanations in real-time. Write and execute code in multiple programming languages while CodeExplainer identifies errors and suggests improvements. Click on "Explain" to get a detailed breakdown of complex sections. Collaborate with others using the chat interface. Access integrated documentation for language references and examples. The user-friendly interface includes a code editor, chat panel, and results.
                            </p>
                            <form>
                                <button>Try Now</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );

}

export default Service;
