import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name:"appSlice",
    initialState:{
        count:0,
    },

    reducers:{
        incCount:()=>{
            // state.count++
        }
    }
})

export default appSlice.reducer
export const { incCount, 
    } = appSlice.actions