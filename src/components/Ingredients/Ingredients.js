import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngridients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Used to manage side effects
  //with [] useEffect acts like ComponentDidMount (it only run once)

  //without [] acts like ComponentDidUpdate (every render) runs
  //after evetry component update re-render
  useEffect(() => {
    console.log("Rendering ingredients", userIngredients);
  });

  const addIngridientHandler = (ingredient) => {
    setIsLoading(true);
    fetch("https://react-hooks-update-66a24.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify({ ingredient }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setIsLoading(false);
        return response.json();
      })
      .then((body) => {
        setUserIngridients((prevIngredients) => [
          ...prevIngredients,
          { id: body.name, ...ingredient },
        ]);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-update-66a24.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        setIsLoading(false);
        setUserIngridients((prevIngredients) =>
          prevIngredients.filter((ing) => ing.id !== ingredientId)
        );
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const filteredIngredientsHanlder = useCallback((filteredIngridients) => {
    setUserIngridients(filteredIngridients);
  }, []);

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="App">
      {error ? <ErrorModal onClose={clearError}>{error}</ErrorModal> : null}
      <IngredientForm
        onAddIngredient={addIngridientHandler}
        loading={isLoading}
      />
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
