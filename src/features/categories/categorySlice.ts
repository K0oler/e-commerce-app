import { createSlice, createSelector, createAsyncThunk, PayloadAction, AnyAction, PrepareAction } from '@reduxjs/toolkit';
import { getCategoriesAndDocuments } from '../../utils/firebase/firebase.utils';
import type { Category, CategoryItem } from '../../utils/firebase/firebase.utils';
import { RootState } from '../../app/store';

type CategoryState = {
  loading: boolean;
  categories: Category[];
  fetchError: string;
}

const initialState: CategoryState = {
  loading: false,
  categories: [],
  fetchError: "",
};

export const fetchCategories = createAsyncThunk('category/fetchCategories', async () => {
  const response = await getCategoriesAndDocuments()
  return response
})

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      }
    },
  extraReducers: (builder) => {
      builder.addCase(fetchCategories.pending, (state) => {
        state.loading = true
      })
      builder.addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false
        state.categories = action.payload
        state.fetchError = ""
      })
      builder.addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.categories = []
        state.fetchError = action.error.message as string
      })
    },
  });
  
export const { setCategories } = categorySlice.actions;

export const selectCategoriesReducer = (state: RootState) => {
return state.category
}
 
 export const selectCategories = createSelector(
  [selectCategoriesReducer],
  (categoriesSlice) => {
    return categoriesSlice.categories}
 )

export type CategoryMap = {
  [key: string]: CategoryItem[];
}

export const selectCategoriesMap = createSelector(
  [selectCategories],
  (categories): CategoryMap => {
    return categories.reduce((acc, category) => {
    const { title, items } = category;
    acc[title.toLowerCase()] = items;
    return acc;
  }, {} as CategoryMap)})

  export const selectIsLoading = createSelector(
    [selectCategoriesReducer],
    (categoriesSlice) => categoriesSlice.loading
  );
  

export default categorySlice.reducer;