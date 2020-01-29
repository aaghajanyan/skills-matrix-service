import {get, post} from 'src/services/client';
import {criteriaRow, searchUsersBegin, searchUsersFailure, searchUsersSuccess} from 'src/store/actions/searchAction';
import {CRITERIA} from 'src/configSearch/criteria';

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
  Object.values(CRITERIA).forEach((criteria) => {
      if(criteria.name !== type) {
          return null;
      }

      criteria.input.forEach((data, index) => {
              if(data.key === "list"){
                  data.items.forEach(e => {
                      if(e.name === item){
                          id = e.id;
                      }
                  })
              }
          });
      });
    return id;
  };

function getCriteria(){
  Object.values(CRITERIA).forEach(field => {
    if(field.name === "Category"){
      get({url: "categories/all"}).then(result => {
        result && result.data.forEach(item => {
             Object.values(field.input).forEach(cat => {
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
    } else {
      get({url: "skills"}).then(result => {
        result && result.data.forEach(item => {
             Object.values(field.input).forEach(cat => {
                 if(cat.key === "list"){
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

//TODO: Move to useEffect
// getCriteria();

export function getUsers(data){
    return (dispatch) => {
        dispatch(searchUsersBegin());
        const bodyObject = data && Object.values(data).map(item => {
          const itemObject  = (
              (item.type === "Branch") ?
                  { name: item.branch } :
              (item.type === "Position") ?
                  { name: item.position } :
              {
                  id: getIdValues(item.type, item.list),
                  // name: item.list,
                  experience: item.experience,
                  profficience: item.proficiency
              }
          );

              return {
                  type: item.type && item.type.toLowerCase(),
                  opCondition: item.opCondition,
                  items: itemObject,
                  relCondition: item.relCondition ? item.relCondition.toLowerCase() : "and"
              }
          });
        post({url: "search/", data: bodyObject})
        .then(result => {
          dispatch(searchUsersSuccess({data: result.data.users, values: data, rows: searchParams}));
        }).catch(error => {
          dispatch(searchUsersFailure(error))
        });
    }
}
