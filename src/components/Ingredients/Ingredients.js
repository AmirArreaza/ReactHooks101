import React, { useState, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngridients] = useState([]);

  //Used to manage side effects
  //After and for every render cycle

  //with [] useEffect acts like ComponentDidMount (it only run once)
  //without [] acts like ComponentWillMount (every render)
  useEffect(() => {
    fetch("https://react-hooks-update-66a24.firebaseio.com/ingredients.json")
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        const loadedIngredients = [];
        for (const key in body) {
          loadedIngredients.push({
            id: key,
            title: body[key].ingredient.title,
            amount: body[key].ingredient.amount,
          });
        }
        setUserIngridients(loadedIngredients);
      });
  }, []);

  const addIngridientHandler = (ingredient) => {
    fetch("https://react-hooks-update-66a24.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify({ ingredient }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((body) => {
        setUserIngridients((prevIngredients) => [
          ...prevIngredients,
          { id: body.name, ...ingredient },
        ]);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setUserIngridients((prevIngredients) =>
      prevIngredients.filter((ing) => ing.id !== ingredientId)
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngridientHandler} />
      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
