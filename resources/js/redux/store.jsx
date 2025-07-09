import { combineReducers, configureStore } from "@reduxjs/toolkit";
import FingerprintSlice from "./slices/FingerprintSlice";
import KaryawanSlice from "./slices/KaryawanSlice";
import alatSlice from "./slices/Sistem/alatSlice";
import statusesSlice from "./slices/Sistem/statusesSlice";
import SpinnerProsesStateSlice from "./slices/SpinnerProsesStateSlice";
import ProcessStateSlice from "./slices/ProcessStateSlice";
import birokrasiSlice from "./slices/Sistem/birokrasiSlice";

const sistemReducer = combineReducers({
    alats: alatSlice,
    statuses: statusesSlice,
    birokrasi: birokrasiSlice,
});

const processReducer = combineReducers({
    spinner: SpinnerProsesStateSlice,
    default: ProcessStateSlice,
});

const store = configureStore({
    reducer: {
        process: processReducer,
        karyawan: KaryawanSlice,
        sistem: sistemReducer,
        fingerprints: FingerprintSlice,
    },
});

store.subscribe(() => store.getState());

export default store;
