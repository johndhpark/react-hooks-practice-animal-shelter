import React, { useState, useEffect } from "react";
import Filters from "./Filters";
import PetBrowser from "./PetBrowser";

function App() {
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState({ type: "all" });

  useEffect(() => {
    fetch("http://localhost:3001/pets")
      .then((response) => response.json())
      .then((pets) => setPets(pets));
  }, []);

  function onChangeType(e) {
    setFilters({ type: e.target.value });
  }

  function onAdoptPet(id) {
    setPets((pets) =>
      pets.map((pet) => {
        if (pet.id === id) pet.isAdopted = true;

        return pet;
      })
    );

    const url = new URL(`http://localhost:3001/pets/${id}`);

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isAdopted: true,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
      })
      .then((updatedPet) => {})
      .catch((error) => console.error("Error: ", error));
  }

  function onFindPetsClick() {
    const baseURL = "http://localhost:3001/pets";
    const url = new URL(baseURL);

    // Add a search param if the filter is set to something other than "all".
    if (filters.type !== "all") url.searchParams.append("type", filters.type);

    fetch(url)
      .then((response) => {
        // If we get a network error
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }

        return response.json();
      })
      .then((matchingPets) => {
        setPets(matchingPets);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }

  return (
    <div className="ui container">
      <header>
        <h1 className="ui dividing header">React Animal Shelter</h1>
      </header>
      <div className="ui container">
        <div className="ui grid">
          <div className="four wide column">
            <Filters
              currentPetFilters={filters}
              onChangeType={onChangeType}
              onFindPetsClick={onFindPetsClick}
            />
          </div>
          <div className="twelve wide column">
            <PetBrowser pets={pets} onAdoptPet={onAdoptPet} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
