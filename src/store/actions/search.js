import { get } from 'client/lib/axiosWrapper';
import {searchUsersBegin, searchUsersSuccess, searchUsersFailure, criteriaRow} from './searchAction';
import { CRITERIA } from '../../configSearch/criteria';
import { SMNotification } from 'view/components';
import { messages, endpoint } from 'constants';

const initialTree = {};

export function getSearchParams(params){
    return (dispatch) => {
        dispatch(criteriaRow({values: params}));
        Object.assign(initialTree, params);
    }
}

function getEndpoint(field) {
    let endpointValue = '';
    Object.keys(endpoint).map((criteria) => {
        if(field === criteria) {
            endpointValue = endpoint[criteria];
        }
    });
    return endpointValue;
}

export function getCriteria() {
    Object.keys(CRITERIA).map((field) => {
        get({url: getEndpoint(field)})
            .then(result => {
                result.data.map((item, index) => {
                    Object.values(CRITERIA[field]).map(cat => {
                        if(cat.key === 'list' && cat.items.length < index + 1) {
                            cat.items.push({name: item.name, id: item.id});
                        }	else if(cat.key === 'branch' && cat.items.length < index + 1) {
                            cat.items.push({name: item.name, id: item.id});
                        } 	else if(cat.key === 'position' && cat.items.length < index + 1) {
                            cat.items.push({name: item.name, id: item.id});
                        }
                    })
                });
            })
            .catch(error => {
                //TODO handle error
                console.error('Error get categories: ', error);
            });
    });
}

export function doSearch(data){
    return (dispatch) => {
        dispatch(searchUsersBegin());
        const encData = btoa(JSON.stringify(data));

        get({url: `search/${encData}`})
            .then(result => {
                dispatch(searchUsersSuccess({data: result.data.result, values: initialTree}));
            })
            .catch(error => {
                if(error.message === 'Network Error'){
                    SMNotification('error', messages.noConnection);
                    dispatch(getSearchParams());
                } else{
                    dispatch(searchUsersFailure(error));
                }
            });
    }
}