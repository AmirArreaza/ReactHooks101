import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        console.log("Filtro ", enteredFilter);
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="ingredient/title"&equalTo="${enteredFilter}"`;
        fetch(
          "https://react-hooks-update-66a24.firebaseio.com/ingredients.json" +
            query
        )
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
      }
    }, 500);
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
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
