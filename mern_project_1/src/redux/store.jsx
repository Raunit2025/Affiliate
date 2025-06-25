import{ configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        userDetails: (state = null, action) => {
            switch(action.type) {
                //This case will help in supporting login case
                case 'SET_USER':
                    return action.payload

                //This case wll help in suppoting logout usecase.
                case 'CLEAR_USER':
                    return null;
                //Handles case where other state update triggers
                // userDetails reducer
                default:
                    return state;
            }
        },
    }
});
