export default Object.assign({},
  {
    fetchRecipeSuccess: false,
    activeRecipe: {
      id: "",
      name: "",
      image: "",
      ingredients: [],
      directions: ""
    },
    viewedRecipeIds: [],
    isDetailVisible: false,
    isLoggedIn: false,
    user: {
      id: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      favorites: []
    }
  });