import React from 'react';
import Banner from '../Banner/Banner';
import LatestFind from '../LatestFind/LatestFind';
import Section1 from '../Section1/Section1';
import Section2 from '../Section2/Section2';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <LatestFind></LatestFind>
            <Section1></Section1>
            <Section2></Section2>
        </div>
    );
};

export default Home;