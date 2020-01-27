export const SEARCH_USERS_BEGIN = 'SEARCH_USERS_BEGIN';
export const SEARCH_USERS_SUCCESS = 'SEARCH_USERS_SUCCESS';
export const SEARCH_USERS_FAILURE = 'SEARCH_USERS_FAILURE';
export const CRITERIA_ROW = 'CRITERIA_ROW';

export const searchUsersBegin = () => ({
    type: SEARCH_USERS_BEGIN
});

export const searchUsersSuccess = (users) => ({
    type: SEARCH_USERS_SUCCESS,
    payload: {users}
});

export const searchUsersFailure = (error) => ({
    type: SEARCH_USERS_FAILURE,
    payload: error
});

export const criteriaRow = (searchData) => ({
    type: CRITERIA_ROW,
    payload: searchData
});

