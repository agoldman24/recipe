export const directionsAreDifferent = (
  newDirectionsType,
  newDirectionsParagraph,
  newDirectionSteps,
  originalDirections,
  isEditMode
) => {
  if (isEditMode && newDirectionsType !== typeof originalDirections) {
    return true;
  };
  if (newDirectionsType === "string") {
    if (!isEditMode) {
      return !!newDirectionsParagraph.length
    }
    return newDirectionsParagraph.replace(/\s+/g, '') !== originalDirections.replace(/\s+/g, '');
  } else {
    if (newDirectionSteps.length !== originalDirections.length) {
      return true;
    }
    newDirectionSteps.forEach((direction, index) => {
      if (direction !== originalDirections[index]) {
        return true;
      }
    });
  }
  return false;
}

export const ingredientsAreDifferent = (
  ingredients,
  originalIngredients,
  isEditMode
) => {
  if (!isEditMode) {
    return !!ingredients.length
  } else {
    if (ingredients.length !== originalIngredients.length) {
      return true;
    }
    ingredients.forEach(({ item, quantity }, index) => {
      if (item.replace(/\s+/g, '') !== originalIngredients[index].item.replace(/\s+/g, '') ||
        quantity.replace(/\s+/g, '') !== originalIngredients[index].quantity.replace(/\s+/g, '')) {
        return true;
      }
    });
  }
  return false;
}