import React from "react";
import Hero from "../Components/hero";
import FeaturedDestination from "../Components/FeaturedDestination";
import ExclusiveOffres from "../Components/ExclusiveOffre";
import Testmonial from "../Components/Testmonial";
import NewLetter from "../Components/NewsLetter";
const Home=()=>{
    return(
        <>
            <Hero/>
            <FeaturedDestination/>
            <ExclusiveOffres/>
            <Testmonial/>
            <NewLetter/>
        </>
    )
}
export default Home;