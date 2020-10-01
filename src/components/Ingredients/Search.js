import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");

  useEffect(() => {
    console.log('Filtro ' ,enteredFilter)
    const query =
      enteredFilter.length === 0
        ? ""
        : `?orderBy="ingredient/title"&equalTo="${enteredFilter}"`;
    fetch("https://react-hooks-update-66a24.firebaseio.com/ingredients.json" + query)
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
        onLoadIngredients(loadedIngredients);
      });
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
