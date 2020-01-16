import { get, post } from 'client/lib/axiosWrapper';
import {searchUsersBegin, searchUsersSuccess, searchUsersFailure, criteriaRow} from './searchAction';
import { CRITERIA } from '../../configSearch/criteria';
import base64 from 'base-64';

const id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);

export let searchParams = [{
  id: id
}];

export function getSearchParams(params){
  return (dispatch) => {
    dispatch(criteriaRow(params));
    searchParams = params;
  }
}


const getIdValues = (type, item) => {
  let id;
  Object.keys(CRITERIA).map((criteria) => {
      if(criteria !== type) {
          return null;
      }

      Object.values(CRITERIA[criteria]).map((data, index) => {
              data.items.map(e => {
                  if(e.name === item){
                      id = e.id;
                  }
              })
      });
  });
  return id;
  }

function getCriteria(){
  Object.keys(CRITERIA).map(field => {
    if(field === "Category"){
      get({url: "categories/all"}).then(result => {
        result.data.map(item => {
             Object.values(CRITERIA[field]).map(cat => {
                 if(cat.key === "list"){
                     cat.items.push({name: item.name, id: item.id});
                 }
             })
         });
      })
      .catch(error => {
          //TODO handle error
          console.error("Error get categories: ", error);
      });
    } else if(field === "Skills") {
      get({url: "skills"}).then(result => {
        result.data.map(item => {
             Object.values(CRITERIA[field]).map(cat => {
                 if(cat.key === "skills"){
                     cat.items.push({name: item.name,  id: item.id});
                 }
             })
         });
      })
      .catch(error => {
          //TODO handle error
          console.error("Error get categories: ", error);
      });
    } else if(field === "Branch") {
      get({url: "branch"}).then(result => {
        result.data.map(item => {
             Object.values(CRITERIA[field]).map(cat => {
                 if(cat.key === "branch"){
                     cat.items.push({name: item.name,  id: item.id});
                 }
             })
         });
      })
      .catch(error => {
          //TODO handle error
          console.error("Error get categories: ", error);
      });
    } else {
      get({url: "position"}).then(result => {
        result.data.map(item => {
             Object.values(CRITERIA[field]).map(cat => {
                 if(cat.key === "position"){
                     cat.items.push({name: item.name,  id: item.id});
                 }
             })
         });
      })
      .catch(error => {
          //TODO handle error
          console.error("Error get categories: ", error);
      });
    }

   });

}

getCriteria();

export function getUsers(data){
    return (dispatch) => {
        dispatch(searchUsersBegin());

        const encData = base64.encode(JSON.stringify(data));
        post({url: `search?=${encData}`, data: encData})
        .then(result => {
          dispatch(searchUsersSuccess({data: result.data.users, values: data, rows: searchParams}));
        }).catch(error => {
          dispatch(searchUsersFailure(error))
        });
    }
}
