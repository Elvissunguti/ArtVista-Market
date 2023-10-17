import React from "react";
import NavBar from "./NavBar";
import ArtCard from "../Shared/ArtCard";


const Home = () => {
    return(
        <section>
            <NavBar />
            <div>
                <h1>welcome to artVista Market</h1>
                <ArtCard />
            </div>
        </section>
    )
}
export default Home;