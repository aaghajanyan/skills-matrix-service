import React,{useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {debounce} from 'throttle-debounce';
import {Tag} from 'antd';
import {SMButton, SMForm, SMInput, SMModal, SMNotification, SMSearch, SMSelect} from 'src/view/components';
import {CriteriaTable} from 'src/view/pages/logged-in/components/CriteriaTable';
import {useValidator, useModal} from 'src/hooks/common';
import {numberValidator} from 'src/helpers/validators';
import {SMCriteriaBar} from 'src/view/pages/logged-in/components/SMCriteriaBar';
import {addUserSkills, updateUserSkills, deleteUserSkills} from 'src/services/userSkillService';
import {addUserCategories, updateUserCategories, deleteUserCategories} from 'src/services/userCategoryService';
import {categoriesColumns, categorySkillsColumns} from './data';
import {SMConfirmModal} from 'src/view/components/SMConfirmModal';
import {toRGB} from 'src/helpers/generateColor';
import {getSkills} from 'src/store/actions/skillAction';
import {getCategories} from 'src/store/actions/categoryAction';
import {addActionMessage, updateActionMessage, deleteActionMessage} from 'src/config/generate-criteria-message';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {SMConfig} from 'config';

import moment from 'moment';

library.add(fab, far, fas);

function Assessment(props) {

    const [isOpen, openModal, closeModal] = useModal(false);

    const [skillsStore, dispatchSkill] = useState([]);
    const [categoriesStore, dispatchCategory] = useState([]);

    const [isCategoryModalOpened, setIsCategoryModalOpened] = useState(false);

    const [loading, setLoading] = useState(false);
    const [someDelete, setSomeDelete] = useState(false);

    const [skillsDataSource, setSkillsDataSource] = useState(null);
    const [categoriesDataSource, setCategoriesDataSource] = useState(null);

    const [initialCriteriaName, setInitialCriteriaName] = useState('');
    const [initialExperience, setInitialExperience] = useState(0);
    const [initialProfficience, setInitialProfficience] = useState(0);

    let [isProfficienceNameValid, profficienceName, profficienceRule, resetProfficienceName] = useValidator(numberValidator('profficience'));
    let [isExpNameValid, expName, expRule, resetExpName] = useValidator(numberValidator('experience'));

    let [isCriteriaNameValid, setIsCriteriaNameValid] = useState(null);

    const [isEdited, setIsEdited] = useState(false);
    const [editedItem, setEditedItem] = useState(false);

    const [usersSkillsData, setUsersSkillsData] = useState({});
    const [usersCategoryData, setUsersCategoryData] = useState({});

    const [initialDate, setInitialDate] = useState('');
    const history = useHistory();

    const currentUser = useSelector(state => state.user);
    const [isAdmin, setIsAdmin] = useState(false);

    const isEntireFormValid = [
        isProfficienceNameValid,
        isExpNameValid,
        isCriteriaNameValid,
    ].every(e => e);

    useEffect(() => {
        collectSkillsData(allSkills());
        collectCategoriesData(allCategories());
        currentUser && currentUser.roleGroup.name === 'super_user' ? setIsAdmin(true) : setIsAdmin(false);
    }, [skillsStore, categoriesStore, currentUser]);

    useEffect(()=> {
        getAllData()
    }, [props.dashboard]);

    const getAllData = () => {
        getSkillsAllData();
        getCategoriesAllData();
    }

    const getSkillsAllData = async () => {
        dispatchSkill(await getSkills());
    };

    const getCategoriesAllData = async () => {
        dispatchCategory(await getCategories());
    };

    const thisUser = () => {
        const thisUse = history.location.pathname.replace('/employees/','');
        return thisUse === '/' ? true : thisUse === currentUser.guid
    }

    const allCategories = () => {
        if(!props.dashboard){
            return [];
        }
        const categories = props.dashboard.categoriesUsers.map( (categoryObj, index) => {
            const skillsList = categoryObj && categoryObj.skills && categoryObj.skills.map(skill => {
                return <Tag style={{...toRGB(skill.name)}} key={skill.name}  className="sm-tag sm-tag-size" >{skill.name}</Tag>
            });
            return ({
                key: categoryObj.name,
                name: categoryObj.name,
                guid: categoryObj.guid,
                assessment: categoryObj.assessment,
                experience: categoryObj.experience,
                date: categoryObj.last_worked_date,
                skills: skillsList
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

    const collectSkillsData = (skillsRes) => {
        const allSkillsLists = [];
        skillsRes && skillsRes.map((item, index) => {
            const row = {
                key: item.key,
                name: item.name,
                date: moment(item.date).format(SMConfig.constants.dateFormat),
                guid: item.guid,
                assessment: item.assessment,
                icon: item.icon,
                skill:  <SMCriteriaBar name={item.skill} iconType='fab' iconName={item.icon} iconClassName='sm-table-icon'/>,
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
                date: moment(item.date).format(SMConfig.constants.dateFormat),
                skills: item.skills,
            };
            allCategoriesLists.push(row);
        });
        setCategoriesDataSource(allCategoriesLists);
    };

    const closingModal = () => {
        closeModal();
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
                closingModal();
                await addUserSkills(props.userGuid, data);
                SMNotification('success', addActionMessage('success', 'Skill'));
            } else {
                SMNotification('error', addActionMessage('error', 'Skill'));
            }
        } catch(error) {
            closingModal();
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
                    }]
                };
                closingModal();
                await addUserCategories(props.userGuid, data);
                SMNotification('success', addActionMessage('success', 'Category'));
            }else {
                SMNotification('error', addActionMessage('error', 'Category'));
            }
        } catch(error) {
            closingModal();
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
            await updateUserSkills(props.userGuid, data);
            await allSkills();
            SMNotification('success', updateActionMessage('success', 'Skill'));
        } catch(error) {
            SMNotification('error', updateActionMessage('error', 'Skill'));
        } finally {
            closingModal();
        }
    };

    const analyzeAndUpdateCategory = async (data) => {
        try {
            data.categories[0] = Object.assign(data.categories[0], { categoryGuid: editedItem});
            await updateUserCategories(props.userGuid, data);
            await allCategories();
            SMNotification('success', updateActionMessage('success', 'Category'));
        } catch(error) {
            SMNotification('error', updateActionMessage('error', 'Category'));
        } finally {
            closingModal();
        }
    };

    const handleSave = (currentValues, data, key) => {
            data[key][0].experience = currentValues.experience;
            setInitialExperience(currentValues.experience);

            data[key][0].profficience = currentValues.profficience;
            setInitialProfficience(currentValues.profficience);

            data[key][0]['last_worked_date'] = moment(currentValues['last_worked_date']).format(SMConfig.constants.dateFormat);
            setInitialDate(currentValues['last_worked_date']);
    };

    const handleSaveSkill = async (currentValues) => {
        if (isEdited) {
            if (currentValues) {
                const data = { skills: [{}]};
                await handleSave(currentValues, data, 'skills');
                await analyzeAndUpdateSkill(data);
                props.renderParent(!props.isChanged);
            }
        }
    };

    const valuesAreTheSame = (currentValues) => {
        return currentValues ? initialExperience == currentValues.experience &&
            initialProfficience == currentValues.profficience &&
            initialDate == moment(currentValues.last_worked_date).format(SMConfig.constants.dateFormat).toString() : false;
    }

    const handleSaveCategory = async (currentValues) => {
        if (isEdited) {
            if (currentValues && !valuesAreTheSame(currentValues)) {
                const data = { categories: [{}]};
                await handleSave(currentValues, data, 'categories');
                await analyzeAndUpdateCategory(data);
                props.renderParent(!props.isChanged);
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
        closeModal();
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

    const getExperienceValues = () => {
        const values = [];
        for(let i = 1; i <= 10; i++){
            values.push({value: i});
        }
        return values;
    }

    const getProfficienceValues = () => {
        const values = [];
        for(let i = 1; i <= 5; i++){
            values.push({value: i});
        }
        return values;
    }

    const openAddModal = async (isCategoryModal) => {
        isCategoryModal ? setIsCategoryModalOpened(true) : setIsCategoryModalOpened(false);
        const date = { last_worked_date: moment().format(SMConfig.constants.dateFormat)};
        isCategoryModal ?
            setUsersCategoryData(Object.assign(usersCategoryData, date)) :
            setUsersSkillsData(Object.assign(usersSkillsData, date));
        setIsEdited(false);
        openModal();
    };

    const openEditModal = (e, record) => {
        e.stopPropagation();
        setEditedItem(record.guid);
        setInitialExperience(record.experience);
        setInitialProfficience(record.assessment);
        setInitialDate(record.date);
        setIsEdited(true);
        openModal();
    };

    const openSkillEditModal = (e, record) => {
        setIsCategoryModalOpened(false);
        setInitialCriteriaName(record.skill.props.name);
        openEditModal(e, record);
    };

    const openCategoryEditModal = (e, record) => {
        setIsCategoryModalOpened(true);
        setInitialCriteriaName(record.name);
        openEditModal(e, record);
    };

    const deleteItem = async (item, isCategoryModal) => {
        try {
            const criteriaName = isCategoryModal ? 'Category' : 'Skill';
            isCategoryModal ?
                await deleteUserCategories(props.userGuid, item) :
                await deleteUserSkills(props.userGuid, item);
            !someDelete && SMNotification('success', deleteActionMessage('success', criteriaName));
        } catch(error) {
            SMNotification('error', `${deleteActionMessage('error', criteriaName)} with ${selectedEl} guid`);
        }
        isCategoryModal ? allCategories() : allSkills();
    }

    const handleDelete = async (record, isCategoryModal) => {
        await deleteItem(record.guid, isCategoryModal);
    };

    const handleDeleteSkill = async (record) => {
        await handleDelete(record, false);
        props.renderParent(!props.isChanged);
    };

    const handleDeleteCategory = async (record) => {
        await handleDelete(record, true);
        props.renderParent(!props.isChanged);
    };

    const handleChangeSkillName = (e) => {
        isCategoryModalOpened ?
            setUsersCategoryData(Object.assign(usersCategoryData, { categoryName: e})) :
            setUsersSkillsData(Object.assign(usersSkillsData, { skillName: e}));
       if(usersSkillsData.skillName || usersCategoryData.categoryName){
           setIsCriteriaNameValid(true)
       }else{
           setIsCriteriaNameValid(false)
       }
        return isCriteriaNameValid;
    }

    const handleChangeLastWorkedDate = (e, dateString) => {
        isCategoryModalOpened ?
            setUsersCategoryData(Object.assign(usersCategoryData, { last_worked_date: dateString})):
            setUsersSkillsData(Object.assign(usersSkillsData, { last_worked_date: dateString}));
    }

    const handleChangeExperience = (e) => {
        isCategoryModalOpened ?
            setUsersCategoryData({...Object.assign(usersCategoryData,  {'experience': `${e}`})}):
            setUsersSkillsData({...Object.assign(usersSkillsData, {'experience': `${e}`})});
    }

    const handleChangeProfficience = (e) => {
        isCategoryModalOpened ?
            setUsersCategoryData({...Object.assign(usersCategoryData, {'profficience': `${e}`})}):
            setUsersSkillsData({...Object.assign(usersSkillsData, {'profficience': `${e}`})});
    }

    const handleAddSkill = async () => {
        setLoading(true);
        resetProfficienceName();
        resetExpName();
        const guidsList = convertNameToGuid(usersSkillsData.skillName, skillsStore.payload);
        await analyzeAndAddSkill(guidsList);
        props.renderParent(!props.isChanged);
    };

    const handleAddCategory = async () => {
        setLoading(true);
        resetProfficienceName();
        resetExpName();
        const guidsList = convertNameToGuid(usersCategoryData.categoryName, categoriesStore.payload);
        await analyzeAndAddCategory(guidsList);
        props.renderParent(!props.isChanged);
    };

    const handleCriteriasDelete = async (e, criteriaCallback, isCategryModal) => {
        setSomeDelete(true);
        const guidList = []
        e.map(criteriaName => {
            criteriaCallback().map(criteria => {
                if(criteria.name === criteriaName) {
                    guidList.push(criteria.guid);
                }
            });
        });
        for (const [index, criteriaGuid] of guidList.entries()) {
            await deleteItem(criteriaGuid, isCategryModal);
            if(index === guidList.length) {
                setSomeDelete(false);
            }
        }
    }

    const handleSkillsDelete = async (e) => {
        await handleCriteriasDelete(e, allSkills, false);
        props.renderParent(!props.isChanged);
    }

    const handleCategoriesDelete = async (e) => {
        await handleCriteriasDelete(e, allCategories, true);
        props.renderParent(!props.isChanged);
    }

    const handleSkillSearchInputChange = (e) => {
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
                if(moment(skillItem.date).format(SMConfig.constants.dateFormat).toString().includes(value.toLowerCase()) && filtredData.indexOf(skillItem) === -1) {
                    filtredData.push(skillItem);
                }
            });
            collectSkillsData(filtredData)
        })()
    }

    const filterTagItems = (dataToFilter, filtredData, value, obj) => {
        dataToFilter.filter(item => {
            if(item.key.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(obj) === -1) {
                filtredData.push(obj);
            }
        });
    }

    const handleCategorySearchInputChange = (e) => {
        e.persist();
        const value = e.target.value;
        debounce(300, () => {
            const filtredData = [];
            allCategories().filter((catItem) => {
                if(catItem.name.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(catItem) === -1) {
                    filtredData.push(catItem);
                }
                filterTagItems(catItem.skills, filtredData, value, catItem);
                if(moment(catItem.date).format(SMConfig.constants.dateFormat).toString().includes(value.toLowerCase()) && filtredData.indexOf(catItem) === -1) {
                    filtredData.push(catItem);
                }
            });
            collectCategoriesData(filtredData)
        })()
    }

    return (
        <React.Fragment>
            {categoriesDataSource &&
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
                        addCheckbox={(isAdmin || thisUser()) ? true : false}
                        addClickableOnRow={true}
                        addScroll={true}
                        items={[
                            (isAdmin || thisUser()) && SMButton({
                                key: 'add',
                                className: "sm-button-add",
                                onClick: () => {openAddModal(true)},
                                loading: loading,
                                children: '+',
                                shape: "circle",
                            }),
                        ]}
                        searchBar = {[
                            SMSearch({
                                key: 'search',
                                placeholder: "Filter...",
                                className: 'sm-search-criteria',
                                onChange: e => handleCategorySearchInputChange(e),
                            })
                        ]}
                />}
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
                        addCheckbox={(isAdmin || thisUser()) ? true : false}
                        addClickableOnRow={true}
                        addScroll={true}
                        items={[
                            (isAdmin || thisUser()) && SMButton({
                                key: 'add',
                                className: "sm-button-add",
                                onClick: () => {openAddModal(false)},
                                loading: loading,
                                children: '+',
                                shape: "circle",
                            }),
                        ]}
                        searchBar = {[
                            SMSearch({
                                key: 'search',
                                placeholder: "Filter...",
                                className: 'sm-search-criteria',
                                onChange: e => handleSkillSearchInputChange(e),
                            })
                        ]}
                />}

            <SMModal
                className="criteria-modal"
                    title={<h3 className="sm-subheading">{!isEdited ? 'Add' : 'Update'} {isCategoryModalOpened ? 'Category' : 'Skill'}</h3>}
                visible={isOpen}
                onCancel={handleCancel}
                footer={null}
                maskClosable={false}
            >
                <SMForm
                    className={'criteria-form'}
                    resetValues={isOpen}
                    onSubmit={isCategoryModalOpened ? handleAddUpdateCategory: handleAddUpdateSkill}
                    onCancel={handleCancel}
                    handleSave={isCategoryModalOpened ? handleSaveCategory : handleSaveSkill}
                    items={[
                        SMSelect({
                            className: 'sm-select sm-select-criteria',
                            name: 'skillName',
                            placeholder: isCategoryModalOpened ? 'Category name' : 'Skill name',
                            options: isCategoryModalOpened? getCategoriesNames() : getSkillNames(),
                            initialvalue: isEdited ? initialCriteriaName : [],
                            disabled: isEdited ? true : false,
                            onChange: handleChangeSkillName
                        }),
                        SMSelect({
                            className: 'sm-select sm-select-criteria',
                            name: 'experience',
                            placeholder: 'Experience',
                            options: getExperienceValues(),
                            initialvalue: isEdited ? initialExperience : [],
                            rules: expRule,
                            onChange: handleChangeExperience,
                        }),
                        SMSelect({
                            className: 'sm-select sm-select-criteria',
                            name: 'profficience',
                            placeholder: 'Assessment',
                            options: getProfficienceValues(),
                            initialvalue: isEdited ? initialProfficience : [],
                            rules: profficienceRule,
                            onChange: handleChangeProfficience,
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
