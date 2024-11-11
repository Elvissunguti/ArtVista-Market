import React from "react";
import NavBar from "../Home/NavBar";

const Search = () => {
    return (
        <section>
            <NavBar />
            <div>
                <div>
                    <p>Search results</p>
                </div>
                <div>
                    <input 
                      type="text"
                      name="searchText"
                      id='searchText'
                      placeholder="search for artwork"
                    />
                </div>
            </div>
        </section>
    )
}
export default Search;