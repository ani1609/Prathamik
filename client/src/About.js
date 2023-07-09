import React, { useEffect, useState, useRef} from 'react';
import './About.css';
import './index.css';
import Community from './images/community-nobg.png';
import Experience from './images/experience-nobg.png';
import Expert from './images/expert-nobg.png';
import Technology from './images/technology-nobg.png';

function About() 
{
    const headingRef = useRef(null);
    const communityImageRef = useRef(null);
    const technologyImageRef = useRef(null);
    const expertImageRef = useRef(null);
    const experienceImageRef = useRef(null);
    const communityDescriptionRef = useRef(null);
    const technologyDescriptionRef = useRef(null);
    const expertDescriptionRef = useRef(null);
    const experienceDescriptionRef = useRef(null);

    

    useEffect(() => 
    {
        const observer = new IntersectionObserver((entries, observer) => 
        {
            entries.forEach(entry => 
                {
                  if (entry.isIntersecting) 
                    {
                      entry.target.classList.add('showAboutHeading');
                    }
                });
        }, {threshold: 0.6});

        if (headingRef.current) observer.observe(headingRef.current);

        return () => 
        {
            if (headingRef.current) observer.unobserve(headingRef.current);
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
                      entry.target.classList.add('animateLeft');
                    }
                });
        }, {threshold: 0.8});

        if (communityDescriptionRef.current) observer.observe(communityDescriptionRef.current);
        if (expertDescriptionRef.current) observer.observe(expertDescriptionRef.current);
        if (technologyImageRef.current) observer.observe(technologyImageRef.current);
        if (experienceImageRef.current) observer.observe(experienceImageRef.current);

        return () => 
        {
            if (communityDescriptionRef.current) observer.unobserve(communityDescriptionRef.current);
            if (expertDescriptionRef.current) observer.unobserve(expertDescriptionRef.current);
            if (technologyImageRef.current) observer.unobserve(technologyImageRef.current);
            if (experienceImageRef.current) observer.unobserve(experienceImageRef.current);
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
                      entry.target.classList.add('animateRight');
                    }
                });
        }, {threshold: 0.8});

        if (communityImageRef.current) observer.observe(communityImageRef.current);
        if (expertImageRef.current) observer.observe(expertImageRef.current);
        if (technologyDescriptionRef.current) observer.observe(technologyDescriptionRef.current);
        if (experienceDescriptionRef.current) observer.observe(experienceDescriptionRef.current);

        return () => 
        {
            if (communityImageRef.current) observer.unobserve(communityImageRef.current);
            if (expertImageRef.current) observer.unobserve(expertImageRef.current);
            if (technologyDescriptionRef.current) observer.unobserve(technologyDescriptionRef.current);
            if (experienceDescriptionRef.current) observer.unobserve(experienceDescriptionRef.current);
        };
    }, []);


  return (
    <div>
      <div className='about_container'>
        <div ref={headingRef} className='about_heading'>
            <h1>About Us</h1>
            <div className='about_line'></div>
        </div>
        
        <div className='about_blocks'>
            <div className='community'>
                <img src={Community} ref={communityImageRef}/>
                <div className='community_description' ref={communityDescriptionRef}>
                    <h2>Who We Serve</h2>
                    <p>We take pride in our team of experts who are passionate about education and dedicated to providing the highest quality learning experience. Our instructors are industry professionals, subject matter experts, and experienced educators who bring their wealth of knowledge and practical insights into the.</p>
                </div>
            </div>

            <div className='technology'>
                <div className='technology_description' ref={technologyDescriptionRef}>
                    <h2>Cutting-Edge Technology</h2>
                    <p>At the heart of our e-learning platform lies cutting-edge technology that drives an innovative and immersive learning experience. We leverage the latest advancements in educational technology to deliver dynamic and interactive course content. From virtual simulations and augmented reality to adaptive learning algorithms, we harness.</p>
                </div>
                <img src={Technology} ref={technologyImageRef}/>
            </div>

            <div className='expert'>
                <img src={Expert} ref={expertImageRef}/>
                <div className='expert_description' ref={expertDescriptionRef}>
                    <h2>Our Team of Experts</h2>
                    <p>We take pride in our team of experts who are passionate about education and dedicated to providing the highest quality learning experience. Our instructors are industry professionals, subject matter experts, and experienced educators who bring their wealth of knowledge and practical insights into the courses they teach.</p>
                </div>
            </div>

            <div className='experience'>
                <div className='experience_description' ref={experienceDescriptionRef}>
                    <h2>Seamless User Experience</h2>
                    <p>At Prathamik, we are committed to providing a seamless learning experience from start to finish. Our user-friendly platform is designed with intuitive navigation and clear instructions, making it easy for you to navigate through courses, access resources, and track your progress. We understand that your time is valuable, so we strive to.</p>
                </div>
                <img src={Experience} ref={experienceImageRef}/>
            </div>
        </div>

      </div>

    </div>
  );
}

export default About;