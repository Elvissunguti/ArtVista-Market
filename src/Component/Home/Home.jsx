import React from "react";
import NavBar from "./NavBar";
import ArtCard from "../Shared/ArtCard";
import QuickViewCard from "../Shared/QuickViewCard";


const Home = () => {
    return(
        <section>
            <NavBar />
            <div>
                <h1>welcome to artVista Market</h1>
                <ArtCard />
                <QuickViewCard />
            </div>
            
        </section>
    )
}
export default Home;