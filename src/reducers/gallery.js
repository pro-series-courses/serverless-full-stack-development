import {
    AUTHENTICATION_SIGN_OUT,
    GALLERY_SET_IMAGE_RECORDS
} from "lib/types";

import lunr from 'lunr';

const buildIndex = (records = [])=>{
    return lunr(function () {
        this.ref('pictureId');
        this.field('name');
        this.field('description');
        records.forEach((r) => {
            this.add(r);
        });
    });
};

const initialState = {
    records: [],
    index: buildIndex()
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GALLERY_SET_IMAGE_RECORDS:
            return {
                ...state,
                records: action.payload,
                index: buildIndex(action.payload)
            }
        case AUTHENTICATION_SIGN_OUT:
            return initialState;
        default:
            return state
    }
}