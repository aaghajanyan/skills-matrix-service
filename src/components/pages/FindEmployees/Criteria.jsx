import React, {useState, useEffect} from 'react';
import { get } from 'client/lib/axiosWrapper';

function Criteria() {

    const [getCategories, setCategories] = useState([]);
    const [getSkills, setSkills] = useState([]);
    const [getUsers, setUsers] = useState([]);

    useEffect(()=>{
      get({url: "categories/all"}).then(result => {
          setCategories(result.data);
      })
      .catch(error => {
          //TODO handle error
          console.error("Error get categories: ", error);
      });

      get({url: "users"}).then(result => {
          setUsers(result.data);
      })
      .catch(error => {
          //TODO handle error
          console.error("Error get users: ", error);
      });

      get({url: "skills"}).then(result => {
          setSkills(result.data);
      })
      .catch(error => {
          //TODO handle error
          console.error("Error get skills: ", error);
      });

  }, []);

  const CRITERIA = {
    "categories" : {
      "name": "Category",
      "input": [
        {
          "name": "Condition",
          "key": "opCondition",
          "items": [
            {
              "name": "equal"
            },
            {
              "name": "not equal",
            }
          ]
        },
        {
          "name": "List Category",
          "key": "list",
          "items": []
        },
        {
          "name": "Experince",
          "key": "experience",
          "items": [
            {
              "name": "1"
            },
            {
              "name": "2",
            },
            {
              "name": "3"
            },
            {
              "name": "4",
            },
            {
              "name": "5"
            },
            {
              "name": "6"
            },
            {
              "name": "7",
            },
            {
              "name": "8"
            },
            {
              "name": "9",
            },
            {
              "name": "10"
            }
          ]
        },
        {
          "name": "Proficiency",
          "key": "proficiency",
          "items": [
            {
              "name": "1"
            },
            {
              "name": "2",
            },
            {
              "name": "3"
            },
            {
              "name": "4",
            },
            {
              "name": "5"
            }
          ]
        },

      ]
    },
    "skills" : {
      "name": "Skill",
      "input": [
        {
          "name": "Condition",
          "key": "opCondition",
          "items": [
            {
              "name": "equal"
            },
            {
              "name": "not equal",
            }
          ]
        },
        {
          "name": "List Skills",
          "key": "list",
          "items": []
        },
        {
          "name": "Experince",
          "key": "experience",
          "items": [
            {
              "name": "1"
            },
            {
              "name": "2",
            },
            {
              "name": "3"
            },
            {
              "name": "4",
            },
            {
              "name": "5"
            },
            {
              "name": "6"
            },
            {
              "name": "7",
            },
            {
              "name": "8"
            },
            {
              "name": "9",
            },
            {
              "name": "10"
            }
          ]
        },
        {
          "name": "Proficiency",
          "key": "proficiency",
          "items": [
            {
              "name": "1"
            },
            {
              "name": "2",
            },
            {
              "name": "3"
            },
            {
              "name": "4",
            },
            {
              "name": "5"
            }
          ]
        },
      ]

    },
    "branch": {
      "name": "Branch",
      "input": [
        {
          "name": "Condition",
          "key": "opCondition",
          "items": [
            {
              "name": "equal"
            },
            {
              "name": "not equal",
            }
          ]
        },
        {
          "name": "Branch",
          "key": "branch",
          "items": [
            {
              "name": "Goris"
            },
            {
              "name": "Gyumri"
            },
            {
              "name": "Erevan"
            },
            {
              "name": "Kapan"
            },
            {
              "name": "Stepanakert"
            },
            {
              "name": "Vanadzor"
            }
          ]
        }
      ]

    },
    "position": {
      "name": "Position",
      "input": [
        {
          "name": "Condition",
          "key": "opCondition",
          "items": [
            {
              "name": "equal"
            },
            {
              "name": "not equal",
            }
          ]
        },
        {
          "name": "Position",
          "key": "position",
          "items": [
            {
              "name": "Beginner SW Engineer"
            },
            {
              "name": "SW Engineer"
            },
            {
              "name": "Senior SW Engineer"
            },
            {
              "name": "Beginner QA Tester"
            },
            {
              "name": "QA Tester"
            },
            {
              "name": "SQE Analyst"
            },
            {
              "name": "Sr. Software Quality Engineer"
            },
            {
              "name": "QA Analyst"
            },
            {
              "name": "QA lead"
            },
            {
              "name": "Team lead"
            },
            {
              "name": "Graphic designer"
            },
            {
              "name": "Technical manager"
            },
            {
              "name": "Senior Team lead"
            },
            {
              "name": "Project Manager"
            },
            {
              "name": "3D modeler"
            },
            {
              "name": "UIUX designer"
            },
            {
              "name": "SW Architect"
            },
          ]
        },
      ]

    }
  };

    Object.values(CRITERIA).map(field => {
     if(field.name === "Category"){
        getCategories.map(item => {
            Object.values(field.input).map(cat => {
                if(cat.key === "list"){
                    cat.items.push({name: item.name, id: item.id});
                }
            })
        })
     }else {
        getSkills.map(item => {
            Object.values(field.input).map(cat => {
                if(cat.key === "list"){
                    cat.items.push({name: item.name,  id: item.id});
                }
            })

        })
     }

    });

    return CRITERIA;

}

export {Criteria}