export const directionsAreDifferent = (
  newDirectionsType,
  newDirectionsParagraph,
  newDirectionSteps,
  originalDirections,
  isEditMode
) => {
  if (isEditMode && newDirectionsType !== typeof originalDirections) {
    return true;
  }
  if (newDirectionsType === "string") {
    if (!isEditMode) {
      return !!newDirectionsParagraph.length;
    }
    return (
      newDirectionsParagraph.replace(/\s+/g, "") !==
      originalDirections.replace(/\s+/g, "")
    );
  } else {
    if (newDirectionSteps.length !== originalDirections.length) {
      return true;
    }
    for (let i = 0; i < newDirectionSteps.length; i++) {
      if (newDirectionSteps[i] !== originalDirections[i]) {
        return true;
      }
    }
  }
  return false;
};

export const ingredientsAreDifferent = (
  ingredients,
  originalIngredients,
  isEditMode
) => {
  if (!isEditMode) {
    return !!ingredients.length;
  } else {
    if (ingredients.length !== originalIngredients.length) {
      return true;
    }
    for (let i = 0; i < ingredients.length; i++) {
      const { item, quantity } = ingredients[i];
      if (
        item !== originalIngredients[i].item ||
        quantity !== originalIngredients[i].quantity
      ) {
        return true;
      }
    }
  }
  return false;
};
