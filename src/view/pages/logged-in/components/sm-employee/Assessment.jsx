import React,{useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {SMButton, SMTable, SMForm, SMInput, SMModal, SMNotification, SMSearch, SMSelect} from 'src/view/components';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {CriteriaTable} from 'src/view/pages/logged-in/components/CriteriaTable';
import {Tag} from 'antd';
import {useValidator} from 'src/hooks/common';
import {numberValidator} from 'src/helpers/validators';
import {SMSkillBar} from 'src/view/pages/logged-in/components/SMSkillBar';
import {addUserSkills, updateUserSkills, deleteUserSkills} from 'src/services/userSkillService';
import {addUserCategories, updateUserCategories, deleteUserCategories} from 'src/services/userCategoryService';
import {categoriesColumns, categorySkillsColumns} from './data';
import {SMConfirmModal} from 'src/view/components/SMConfirmModal';
import {toRGB} from 'src/helpers/generateColor';
import {debounce} from 'throttle-debounce';
import {getSkills} from 'src/store/actions/skillAction';
import {getCategories} from 'src/store/actions/categoryAction';
import {addActionMessage, updateActionMessage, deleteActionMessage} from 'src/config/generate-criteria-message';
import {useHistory} from 'react-router-dom';

import moment from 'moment';

library.add(fab, far, fas);

function Assessment(props) {
    const currentUser = useSelector(state => state.user);

    const allCategories = () => {
        if(!props.dashboard){
            return [];
        }
        const categories = props.dashboard.categoriesUsers.map( (categoryObj, index) => {
            return ({
                key: categoryObj.name,
                name: categoryObj.name,
                guid: categoryObj.guid,
                assessment: categoryObj.assessment,
                experience: categoryObj.experience,
                date: categoryObj.last_worked_date
            });
        });

        return categories;
    };

    const allSkills = () => {
        if(!props.dashboard){
            return [];
        }
        const needToImproveSort = props.dashboard.needToImproveSort.reverse();

        const skills = props.dashboard.topSkilsSort.map( (skill, index) => {
            return ({
                key: skill.name,
                name: skill.name,
                icon:  skill.icon,
                skill: skill.name,
                assessment: skill.profficience.mark,
                date: skill.last_worked_date,
                guid: skill.guid,
                experience: skill.experience,
                categories: skill.categories
            });
        });

        needToImproveSort.map( (skill, index) => {
            skills.push({
                key: skill.name,
                name: skill.name,
                icon:  skill.icon,
                skill: skill.name,
                assessment: skill.profficience.mark,
                date: skill.last_worked_date,
                guid: skill.guid,
                experience: skill.experience,
                categories: skill.categories
            })
        });

        return skills;
    };

    const [skillsStore, dispatchSkill] = useState([]);
    const [categoriesStore, dispatchCategory] = useState([]);

    const [isCategoryModalOpened, setIsCategoryModalOpened] = useState(false);

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [someDelete, setSomeDelete] = useState(false);

    const [skillsDataSource, setSkillsDataSource] = useState(null);
    const [categoriesDataSource, setCategoriesDataSource] = useState(null);

    const [initialSkillName, setInitialSkillName] = useState('');
    const [initialExperience, setInitialExperience] = useState(0);
    const [initialProfficience, setInitialProfficience] = useState(0);

    let [isProfficienceNameValid, profficienceName, profficienceRule, resetProfficienceName] = useValidator(numberValidator('profficience'));
    let [isExpNameValid, expName, expRule, resetExpName] = useValidator(numberValidator('experience'));

    let [isSkillListValid, setIsSkillListValid] = useState(null);

    const [isEdited, setIsEdited] = useState(false);
    const [editedItem, setEditedItem] = useState(false);

    const [usersSkillsData, setUsersSkillsData] = useState({});
    const [usersCategoryData, setUsersCategoryData] = useState({});

    const [initialDate, setInitialDate] = useState('');
    const history = useHistory();


    const isEntireFormValid = [
        isProfficienceNameValid,
        isExpNameValid,
        isSkillListValid,
    ].every(e => e);

    useEffect(() => {
        collectSkillsData(allSkills());
    }, [skillsStore]);

    useEffect(()=> {
        const skillList = [];
        allSkills() && allSkills().map((item, index) => {
            skillList.push(item.skill)
        })
        getSkillsAllData();
    }, []);

    const getSkillsAllData = async () => {
        dispatchSkill(await getSkills());
    };

    useEffect(() => {
        collectCategoriesData(allCategories());
    }, [categoriesStore]);

    useEffect(()=> {
        const categoriesList = [];
        allCategories() && allCategories().map((item, index) => {
            categoriesList.push(item.category)
        })
        getCategoriesAllData();
    }, []);

    const getCategoriesAllData = async () => {
        dispatchCategory(await getCategories());
    };

    const thisUser = () => {
        const thisUse = history.location.pathname.replace('/employees/','');
        return thisUse === '/' ? true : thisUse === currentUser.guid
    }

    const collectSkillsData = (skillsRes) => {
        const allSkillsLists = [];
        skillsRes && skillsRes.map((item, index) => {
            const row = {
                key: item.key,
                date: moment(item.date).format('YYYY-MM-DD'),
                guid: item.guid,
                assessment: item.assessment,
                icon: item.icon,
                skill:  <SMSkillBar name={item.skill} iconType='fab' iconName={item.icon} iconClassName='sm-table-icon'/>,
                categories: <Tag style={{...toRGB(item.categories)}} key={item.categories}  className="sm-tag sm-tag-size" >{item.categories}</Tag>,
                experience: item.experience
            };

            allSkillsLists.push(row);
        });
        setSkillsDataSource(allSkillsLists);
    };

    const collectCategoriesData = (categoriesRes) => {
        const allCategoriesLists = [];
        categoriesRes && categoriesRes.map((item, index) => {
            const row = {
                key: item.name,
                name: item.name,
                guid: item.guid,
                assessment: item.assessment,
                experience: item.experience,
                date: moment(item.date).format('YYYY-MM-DD'),
            };
            allCategoriesLists.push(row);
        });
        setCategoriesDataSource(allCategoriesLists);
    };

    const closeModal = () => {
        setVisible(false);
        setLoading(false);
    }

    const analyzeAndAddSkill = async(skillGuid) => {
        try {
            if (usersSkillsData.profficience && usersSkillsData.experience && usersSkillsData.last_worked_date) {
                const data = { skills: [
                    {
                    skillGuid: skillGuid,
                    experience: usersSkillsData.experience ,
                    profficience: usersSkillsData.profficience,
                    last_worked_date: usersSkillsData.last_worked_date
                    }
                ]};

                closeModal();
                await addUserSkills(currentUser.guid, data);
                SMNotification('success', addActionMessage('success', 'Skill'));
            }else {
                SMNotification('error', addActionMessage('error', 'Skill'));

            }
        } catch(error) {
            closeModal();
            SMNotification('error', addActionMessage('error', 'Skill'));
        }
    };

    const analyzeAndAddCategory = async(categoryGuid) => {
        try {
            if (usersCategoryData.profficience && usersCategoryData.experience && usersCategoryData.last_worked_date) {
                const data = { categories: [
                    {
                    categoryGuid: categoryGuid,
                    experience: usersCategoryData.experience ,
                    profficience: usersCategoryData.profficience,
                    last_worked_date: usersCategoryData.last_worked_date
                    }
                ]};
                closeModal();
                await addUserCategories(currentUser.guid, data);
                SMNotification('success', addActionMessage('success', 'Category'));
            }else {
                SMNotification('error', addActionMessage('error', 'Category'));

            }
        } catch(error) {
            closeModal();
            SMNotification('error', addActionMessage('error', 'Category'));
        }
    };

    const convertNameToGuid = (name, namesList) => {
        let itemsGuid;
        namesList && namesList.map(item => {
            if(name === item.name) itemsGuid = (item.guid);
        });
        return itemsGuid;
    };

    const analyzeAndUpdateSkill = async (data) => {
        try {
            data.skills[0] = Object.assign(data.skills[0], { skillGuid: editedItem});
            await updateUserSkills(currentUser.guid, data);
            await allSkills();
            closeModal();
            SMNotification('success', updateActionMessage('success', 'Skill'));
        } catch(error) {
            SMNotification('error', updateActionMessage('error', 'Skill'));
            closeModal();
        }
    };

    const analyzeAndUpdateCategory = async (data) => {
        try {
            data.categories[0] = Object.assign(data.categories[0], { categoryGuid: editedItem});
            await updateUserCategories(currentUser.guid, data);
            await allCategories();
            closeModal();
            SMNotification('success', updateActionMessage('success', 'Category'));
        } catch(error) {
            SMNotification('error', updateActionMessage('error', 'Category'));
            closeModal();
        }
    };

    const handleSave = (currentValues, data, key) => {
        if(initialExperience !== currentValues.experience) {
            data[key][0].experience = currentValues.experience;
        }
        if(initialProfficience !== currentValues.profficience) {
            data[key][0].profficience = currentValues.profficience;
        }
        if(initialDate !== currentValues['last_worked_date']) {
            data[key][0]['last_worked_date'] = currentValues['last_worked_date'];
        }
    };

    const handleSaveSkill = (currentValues) => {
        if (isEdited) {
            if (currentValues) {
                const data = { skills: [{}]};
                handleSave(currentValues, data, 'skills');
                analyzeAndUpdateSkill(data);
            }
        }
    };
    const handleSaveCategory = (currentValues) => {
        if (isEdited) {
            if (currentValues) {
                const data = { categories: [{}]};
                handleSave(currentValues, data, 'categories');
                analyzeAndUpdateCategory(data);
            }
        }
    };

    const handleAddUpdateSkill = () => {
        isEdited ? handleSaveSkill() : handleAddSkill();
    };

    const handleAddUpdateCategory = () => {
        isEdited ? handleSaveCategory() : handleAddCategory();
    };

    const handleCancel = () => {
        setVisible(false);
        setIsEdited(false);
    };

    const getSkillNames = () => {
        if( skillsStore.payload && skillsStore.payload.length > 0) {
            let skillNames = skillsStore.payload.map( skill => {
                const userSkills = allSkills();
                let flag = true;
                for( var i=0; i<userSkills.length; i++){
                    if(userSkills[i].skill === skill.name) {
                        flag = false;
                        break;
                    }
                }
                return (flag ? {value: skill.name} : null);
            });

            skillNames = skillNames.filter(function (el) {
                return el != null;
            });

            return skillNames;
        }

        return [];
    };

    const getCategoriesNames = () => {
        if( categoriesStore.payload && categoriesStore.payload.length > 0) {
            let categoryNames = categoriesStore.payload.map( category => {
                const userCategories = allCategories();
                let flag = true;
                for( let i=0; i<userCategories.length; i++){
                    if(userCategories[i].name === category.name) {
                        flag = false;
                        break;
                    }
                }
                return (flag ? {value: category.name} : null);
            });

            categoryNames = categoryNames.filter(function (el) {
                return el !== null;
            });

            return categoryNames;
        }

        return [];
    };

    const openAddModal = async (isCategoryModal) => {
        isCategoryModal ? setIsCategoryModalOpened(true) : setIsCategoryModalOpened(false);
        const date = { last_worked_date: moment().format('YYYY-MM-DD')};
        isCategoryModal ? setUsersCategoryData(Object.assign(usersCategoryData, date)) : setUsersSkillsData(Object.assign(usersSkillsData, date));
        
        setIsEdited(false);
        setVisible(true);
    };

    const openEditModal = (e, record) => {
        e.stopPropagation();
        setEditedItem(record.guid);
        setInitialExperience(record.experience);
        setInitialProfficience(record.assessment);
        setInitialDate(record.date);
        setIsEdited(true);
        setVisible(true);
    };

    const openSkillEditModal = (e, record) => {
        setIsCategoryModalOpened(false);
        setInitialSkillName(record.skill.props.name);
        openEditModal(e, record);

    };

    const openCategoryEditModal = (e, record) => {
        setIsCategoryModalOpened(true);
        setInitialSkillName(record.name);
        openEditModal(e, record);

    };

    const deleteItem = async (item, isCategoryModal) => {
        try {
            const criteriaName = isCategoryModal ? 'Category' : 'Skill';
            isCategoryModal ? await deleteUserCategories(currentUser.guid, item) : await deleteUserSkills(currentUser.guid, item);
            !someDelete && SMNotification('success', deleteActionMessage('success', criteriaName));
        } catch(error) {
            SMNotification('error', `${deleteActionMessage('error', criteriaName)} with ${selectedEl} guid`);
        }
        isCategoryModal ? allCategories() : allSkills();
    }

    const handleDelete = async (record, isCategoryModal) => {
        deleteItem(record.guid, isCategoryModal);
    };

    const handleDeleteSkill = async (record) => {
        handleDelete(record, false);
    };

    const handleDeleteCategory = async (record) => {
        handleDelete(record, true);
    };

    const handleChangeSkillName = (e) => {
        isCategoryModalOpened ?
            setUsersCategoryData(Object.assign(usersCategoryData, { categoryName: e})) :
            setUsersSkillsData(Object.assign(usersSkillsData, { skillName: e}));
       if(usersSkillsData.skillName || usersCategoryData.categoryName){
           setIsSkillListValid(true)
       }else{
            setIsSkillListValid(false)
       }
        return isSkillListValid;
    }

    const handleChangeLastWorkedDate = (e, dateString) => {
        isCategoryModalOpened ?
            setUsersCategoryData(Object.assign(usersCategoryData, { last_worked_date: dateString})):
            setUsersSkillsData(Object.assign(usersSkillsData, { last_worked_date: dateString}));
    }

    const handleChangeExperience = (e) => {
        isCategoryModalOpened ?
            setUsersCategoryData(Object.assign(usersCategoryData, {[e.target.name]: e.target.value})):
            setUsersSkillsData(Object.assign(usersSkillsData, {[e.target.name]: e.target.value}));
    }

    const handleChangeProfficience = (e) => {
        isCategoryModalOpened ?
            setUsersCategoryData(Object.assign(usersCategoryData, {[e.target.name]: e.target.value})):
            setUsersSkillsData(Object.assign(usersSkillsData, { [e.target.name]: e.target.value}));
    }

    const handleAddSkill = () => {
        setLoading(true);
        resetProfficienceName();
        resetExpName();
        const guidsList = convertNameToGuid(usersSkillsData.skillName, skillsStore.payload);
        analyzeAndAddSkill(guidsList);
    };

    const handleAddCategory = () => {
        setLoading(true);
        resetProfficienceName();
        resetExpName();
        const guidsList = convertNameToGuid(usersCategoryData.categoryName, categoriesStore.payload);
        analyzeAndAddCategory(guidsList)
    };

    const handleSearchInputChange = (e) => {
        e.persist();
        const value = e.target.value;
        debounce(300, () => {
            const filtredData = [];
            allSkills().filter((skillItem) => {
                if (skillItem.skill.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(skillItem) === -1) {
                    filtredData.push(skillItem);
                }

                if(skillItem.categories.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(skillItem) === -1) {
                    filtredData.push(skillItem);
                }
            });
            collectSkillsData(filtredData)
        })()
    }

    const handleCriteriasDelete = (e, criteriaCallback, isCategryModal) => {
        setSomeDelete(true);
        const guidList = []
        e.map(criteriaName => {
            criteriaCallback().map(criteria => {
                if(criteria.name === criteriaName) {
                    guidList.push(criteria.guid);
                }
            });
        });
        guidList.map((criteriaGuid,index) => {
            deleteItem(criteriaGuid, isCategryModal);
            if(index === guidList.length) {
                setSomeDelete(false);
            }
        });
    }

    const handleSkillsDelete = (e) => {
        handleCriteriasDelete(e, allSkills, false)
    }

    const handleCategoriesDelete = (e) => {
        handleCriteriasDelete(e, allCategories, true)
    }

    return (
        <React.Fragment>
            <div className="sm-component">
            {true &&
                    <CriteriaTable
                        title="All Categories"
                        dataSource={categoriesDataSource}
                        column={categoriesColumns(categoriesDataSource,
                            thisUser(),
                            openCategoryEditModal,
                            handleDeleteCategory,
                            SMConfirmModal,
                        )}
                        handleSomeDelete={handleCategoriesDelete}
                        className='sm-table-criteria'
                        addPagination={true}
                        addCheckbox={true}
                        addClickableOnRow={true}
                        addScroll={true}
                        items={[
                            SMButton({
                                key: 'add',
                                className: "sm-button-add",
                                onClick: () => {openAddModal(true)},
                                loading: loading,
                                children: '+',
                                shape: "circle",
                                disabled: !thisUser(),
                            }),
                        ]}
                        searchBar = {[
                            SMSearch({
                                key: 'search',
                                placeholder: "Filter...",
                                className: 'sm-search-criteria',
                                onChange: e => handleSearchInputChange(e),
                            })
                        ]}
                />}
            </div>
            <div className='sm-content-skill-style'>
                {skillsDataSource &&
                    <CriteriaTable
                        title="All skills"
                        dataSource={skillsDataSource}
                        column={categorySkillsColumns(skillsDataSource,
                            thisUser(),
                            openSkillEditModal,
                            handleDeleteSkill,
                            SMConfirmModal,
                        )}
                        handleSomeDelete={handleSkillsDelete}
                        className='sm-table-criteria'
                        addPagination={true}
                        addCheckbox={true}
                        addClickableOnRow={true}
                        addScroll={true}
                        items={[
                            SMButton({
                                key: 'add',
                                className: "sm-button-add",
                                onClick: () => {openAddModal(false)},
                                loading: loading,
                                children: '+',
                                shape: "circle",
                                disabled: !thisUser(),
                            }),
                        ]}
                        searchBar = {[
                            SMSearch({
                                key: 'search',
                                placeholder: "Filter...",
                                className: 'sm-search-criteria',
                                onChange: e => handleSearchInputChange(e),
                            })
                        ]}
                />}

            <SMModal
                className="criteria-modal"
                    title={<h3 className="sm-subheading">{!isEdited ? 'Add' : 'Update'} {isCategoryModalOpened ? 'Category' : 'Skill'}</h3>}
                visible={visible}
                onCancel={handleCancel}
                footer={null}
                maskClosable={false}
            >
                    <SMForm
                        className={'criteria-form'}
                        resetValues={visible}
                        onSubmit={isCategoryModalOpened ? handleAddUpdateCategory: handleAddUpdateSkill}
                        onCancel={handleCancel}
                        handleSave={isCategoryModalOpened ? handleSaveCategory : handleSaveSkill}
                        items={[
                            SMSelect({
                                className: 'sm-select sm-select-criteria',
                                name: 'skillName',
                                placeholder: isCategoryModalOpened ? 'Category name' : 'Skill name',
                                options: isCategoryModalOpened? getCategoriesNames() : getSkillNames(),
                                initialvalue: isEdited ? initialSkillName : [],
                                disabled: isEdited ? true : false,
                                onChange: handleChangeSkillName
                            }),
                            SMInput({
                                className: 'sm-input',
                                name: 'experience',
                                type: 'number',
                                rules: expRule,
                                placeholder: 'Experience',
                                onChange: handleChangeExperience,
                                initialvalue: isEdited ? initialExperience : [],
                            }),
                            SMInput({
                                className: 'sm-input',
                                name: 'profficience',
                                type: 'number',
                                rules: profficienceRule,
                                placeholder: 'Assessment',
                                onChange: handleChangeProfficience,
                                initialvalue: isEdited ? initialProfficience : '',
                            }),
                            SMInput({
                                className: 'sm-input',
                                name: 'last_worked_date',
                                type: 'date',
                                placeholder: 'Last worked date',
                                onChange: handleChangeLastWorkedDate,
                                initialvalue: isEdited ? moment(initialDate) : moment(),
                            }),
                        ]}
                        footer={[
                            SMButton({
                                className: "sm-link",
                                type: "link",
                                name: 'cancel',
                                children: 'Cancel'
                            }),
                            SMButton({
                                className: "sm-button",
                                type: "primary",
                                name: 'submit',
                                children: isEdited ? 'Save' : 'Add',
                                htmlType: 'submit',
                                disabled: isEdited ? false : !isEntireFormValid
                            })
                        ]}
                    />
            </SMModal>
        </div>
        </React.Fragment>
    );
}

export {Assessment};