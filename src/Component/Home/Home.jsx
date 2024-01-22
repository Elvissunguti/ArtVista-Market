import React from "react";
import NavBar from "./NavBar";
import ArtCard from "../Shared/ArtCard";
import QuickViewCard from "../Shared/QuickViewCard";
import ArtPage from "../Shared/ArtPage";
import Search from "../Search/Search";
import Product from "../Product/Product";
import AllArtWork from "../AllArtWork/AllArtWork";


const Home = () => {
    return(
        <section>
            <NavBar />
            <div>
                <h1>welcome to artVista Market</h1>
                <AllArtWork />
            </div>
            
        </section>
    )
}
export default Home;