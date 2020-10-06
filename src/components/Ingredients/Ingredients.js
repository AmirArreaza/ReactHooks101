import React, { useReducer, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

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

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...currentHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorData };
    case "CLEAR":
      return { ...currentHttpState, error: null };
    default:
      throw new Error("Shouldn't happen");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  //Used to manage side effects
  //with [] useEffect acts like ComponentDidMount (it only run once)

  //without [] acts like ComponentDidUpdate (every render) runs
  //after evetry component update re-render
  useEffect(() => {
    console.log("Rendering ingredients", userIngredients);
  });

  const addIngridientHandler = (ingredient) => {
    dispatchHttp({ type: "SEND" });
    fetch("https://react-hooks-update-66a24.firebaseio.com/ingredients.jon", {
      method: "POST",
      body: JSON.stringify({ ingredient }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        dispatchHttp({ type: "RESPONSE" });
        return response.json();
      })
      .then((body) => {
        dispatch({ type: "ADD", ingredient: { id: body.name, ...ingredient } });
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", errorData: error.message });
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    dispatchHttp({ type: "SEND" });
    fetch(
      `https://react-hooks-update-66a24.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        dispatchHttp({ type: "RESPONSE" });
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", errorData: error.message });
      });
  };

  const filteredIngredientsHanlder = useCallback((filteredIngridients) => {
    //setUserIngridients(filteredIngridients);
    dispatch({ type: "SET", ingredients: filteredIngridients });
  }, []);

  const clearError = () => {
    dispatchHttp({ type: "CLEAR" });
  };

  return (
    <div className="App">
      {httpState.error ? (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      ) : null}
      <IngredientForm
        onAddIngredient={addIngridientHandler}
        loading={httpState.loading}
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
