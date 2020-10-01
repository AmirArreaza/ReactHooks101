import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngridients] = useState([]);

  //Used to manage side effects
  //with [] useEffect acts like ComponentDidMount (it only run once)
  useEffect(() => {
    fetch("https://react-hooks-update-66a24.firebaseio.com/ingredients.json")
      .then((response) => response.json())
      .then((body) => {
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

  //without [] acts like ComponentDidUpdate (every render) runs
  //after evetry component update re-render
  useEffect(() => {
    console.log("Rendering ingredients", userIngredients);
  });

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

  const filteredIngredientsHanlder = useCallback((filteredIngridients) => {
    setUserIngridients(filteredIngridients);
  }, []);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngridientHandler} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHanlder} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
