import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: new Set(),
  tempFormData: {},
  itemsSelectedList: [],
  selectMonitor: [],
  currentEdit: "",
  editIsToggled: false,
  selectAll: false,
  bulkEditCounter: 0,
  changesOccured: false,
  currentExpansion: "",
  totalItems: 0,
  deleteCounter: 0,
  uploadStats: {
    itemsLeft: 0,
    itemsUploaded: 0,
    initialAmount:
      JSON.parse(localStorage.getItem("Items Awaiting Upload")) === null ||
      JSON.parse(localStorage.getItem("Items Awaiting Upload")) === undefined
        ? []
        : JSON.parse(localStorage.getItem("Items Awaiting Upload")).length,
    percentage: 0,
  },
  sortingPref: "price",
  orderPref: "asc",
  categories: [
    "Groceries",
    "Beverage",
    "Snacks",
    "Bread",
    "Fabrics",
    "Beauty & Health",
    "Freezer & Fridge Items",
  ], // make this settings related later on
  categoryFilter: "all",
  searchParams: "",
  loadingIconIsVisible: true,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    updateItems(state, action) {
      // console.log("new items:", action.payload)
      state.items = new Set([...action.payload]);
    },

    importItems(state, action) {
      state.items = new Set([...state.items, ...action.payload]);
    },

    addItem(state, action) {
      state.items.add(action.payload);
    },
    changeFormData(state, action) {
      state.tempFormData = action.payload;
    },
    addItemToSelectedList(state, action) {
      const i = new Set(state.itemsSelectedList);
      i.add(action.payload);
      state.itemsSelectedList = [...i];
    },
    removeItemFromSelectedList(state, action) {
      state.itemsSelectedList = state.itemsSelectedList.filter(
        (id) => id !== action.payload
      );
    },
    addItemToCurrentEdit(state, action) {
      state.currentEdit = action.payload;
    },
    removeItemFromCurrentEdit(state, action) {
      state.currentEdit = "";
    },
    toggleEdit(state, action) {
      state.editIsToggled = !state.editIsToggled;
    },
    toggleSelectAll(state, action) {
      const value = !state.selectAll;

      if (value) {
        state.itemsSelectedList = [...state.items].map((item) => {
          return item.id;
        });
      }

      if (value === false) {
        state.itemsSelectedList = [];
      }
      
      state.selectAll = value;
    },
    setCurrentEdit(state, action) {
      state.currentEdit = action.payload;
    },
    setDeleteCounter(state, action) {
      state.deleteCounter += 1;
    },
    setChangesOccuredState(state, action) {
      state.changesOccured = action.payload;
    },
    seBulkEditUpdateCounter(state, action) {
      state.bulkEditCounter += 1;
    },
    setItemsLeft(state, action) {
      state.uploadStats.itemsLeft = action.payload;
    },
    setTotalItems(state, action) {
      state.totalItems = action.payload;
    },
    setItemsUploaded(state, action) {
      state.uploadStats.itemsUploaded = action.payload;
    },
    setInitialAmount(state, action) {
      state.uploadStats.initialAmount = action.payload;
    },
    setUploadPercentage(state, action) {
      state.uploadStats.percentage = action.payload;
    },
    setSortingPreference(state, action) {
      state.sortingPref = action.payload;
    },
    setOrderPreference(state, action) {
      state.orderPref = action.payload;
    },
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
    },
    setSearchParams(state, action) {
      state.searchParams = action.payload;
    },
    setCurrentExpansion(state, action) {
      state.currentExpansion = action.payload;
    },
    switchLoadingIcon(state,action){
      state.loadingIconIsVisible = action.payload
    }
  },
});

export const actions = inventorySlice.actions;

export default inventorySlice.reducer;
