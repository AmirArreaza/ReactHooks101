import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Shouldn't happen");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest } = useHttp();

  //Used to manage side effects
  //with [] useEffect acts like ComponentDidMount (it only run once)

  //without [] acts like ComponentDidUpdate (every render) runs
  //after evetry component update re-render
  useEffect(() => {
    console.log("Rendering ingredients", userIngredients);
  });

  const addIngridientHandler = useCallback((ingredient) => {
    //dispatchHttp({ type: "SEND" });
    fetch("https://react-hooks-update-66a24.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify({ ingredient }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        //dispatchHttp({ type: "RESPONSE" });
        return response.json();
      })
      .then((body) => {
        dispatch({ type: "ADD", ingredient: { id: body.name, ...ingredient } });
      })
      .catch((error) => {
        //dispatchHttp({ type: "ERROR", errorData: error.message });
      });
  }, []);

  const removeIngredientHandler = useCallback((ingredientId) => {
    sendRequest(
      `https://react-hooks-update-66a24.firebaseio.com/ingredients/${ingredientId}.json`,
      "DELETE"
    );
  }, [sendRequest]);

  const filteredIngredientsHanlder = useCallback((filteredIngridients) => {
    //setUserIngridients(filteredIngridients);
    dispatch({ type: "SET", ingredients: filteredIngridients });
  }, []);

  const clearError = useCallback(() => {
    //dispatchHttp({ type: "CLEAR" });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error ? <ErrorModal onClose={clearError}>{error}</ErrorModal> : null}
      <IngredientForm
        onAddIngredient={addIngridientHandler}
        loading={isLoading}
      />
      <section>
        <Search onLoadIngredients={filteredIngredientsHanlder} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
