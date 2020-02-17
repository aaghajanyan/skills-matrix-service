import React, {useEffect, useState, useReducer} from 'react';
import {useSelector} from 'react-redux';
import {Tag} from 'antd';
import {SMConfig} from 'src/config';
import {CriteriaTable} from 'src/view/pages/logged-in/components/CriteriaTable';
import {SMSkillBar} from 'src/view/pages/logged-in/components/SMSkillBar';
import {SMConfirmModal} from 'src/view/components/SMConfirmModal';
import {SMButton, SMForm, SMInput, SMModal, SMNotification, SMSelect, SMSearch} from 'src/view/components';
import {useValidator} from 'src/hooks/common';
import {nameValidator} from 'src/helpers/validators';
import {getSkills} from 'src/store/actions/skillAction';
import {getCategories} from 'src/store/actions/categoryAction';
import {addNewCategoryData, updateCategoryData, deleteCategoryData} from 'src/services/categoryService';
import {addActionMessage, updateActionMessage, deleteActionMessage} from 'src/config/generate-criteria-message';
import {getDataSource} from './column';
import skills from 'src/store/reducers/skillReducer';
import categories from 'src/store/reducers/categoryReducer';
import {toRGB} from 'src/helpers/generateColor';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {debounce} from 'throttle-debounce';

library.add(fab, far, fas);

function Categories(props) {
    const currentUser = useSelector(state => state.user);
    const [skillsStore, dispatchSkill] = useReducer(skills, []);
    const [categoriesStore, dispatchCategory] = useReducer(categories, []);

    const [isAdmin, setIsAdmin] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [categoriesDataSource, setCategoriesDataSource] = useState(null);

    const [initialCategoryName, setInitialCategoryName] = useState('');
    const [initialSkills, setInitialSkills] = useState([]);
    const [initialRelCate, setInitialRelCate] = useState([]);

    let [isCategoryNameValid, categoryName, categoryNameRule, resetCategoryName] = useValidator(nameValidator('skill'));
    let [isSkillsListValid, setIsSkillsListValid] = useState(null);
    let [skillsNames, setSkillsNames] = useState(null);
    let [isRelCatListValid, setIsRelCatListValid] = useState(null);
    let [relCatNames, setRelCatNames] = useState(null);

    const [isEdited, setIsEdited] = useState(false);
    const [editedItem, setEditedItem] = useState(false);

    const isEntireFormValid = [
        isCategoryNameValid,
        // isSkillsListValid,
        // isRelCatListValid
    ].every(e => e);

    const handleSkillSelect = (lists) => {
        return handleSelect(lists, skillsStore, true);
    }

    const handleRelCatSelect = (lists) => {
        return handleSelect(lists, categoriesStore, false);
    }

    const handleSelect = (itemsLists, storeObj, isSkillSelect) => {
        isSkillSelect ? setSkillsNames(itemsLists) : setRelCatNames(itemsLists);
        let result = storeObj && storeObj.map(storeItem => storeItem.name);
        if (itemsLists.length) {
            const redundantSkills = itemsLists.filter(function(item) {
                return !result.includes(item);
            });
            isSkillSelect ? setIsSkillsListValid(redundantSkills.length ? false : true)
                : setIsRelCatListValid(redundantSkills.length ? false : true);
        } else {
            isSkillSelect ? setIsSkillsListValid(false) : setIsRelCatListValid(false);
        }
        return isSkillSelect ? isSkillsListValid : isRelCatListValid;
    }

    useEffect(() => {
        currentUser && currentUser.roleGroup.name === 'super_user' ? setIsAdmin(true) : setIsAdmin(false);
    }, [currentUser]);

    useEffect(() => {
        initBasicData();
    }, []);

    useEffect(() => {
        collectCategoriesData(categoriesStore);
    }, [categoriesStore]);

    const initBasicData = () => {
        getSkillsAllData();
        getCategoriesAllData();
    };

    const getSkillsAllData = async () => {
        dispatchSkill(await getSkills());
    };

    const getCategoriesAllData = async () => {
        dispatchCategory(await getCategories());
    };

    const getSkillsOptions = () => {
        const skillsOptions = skillsStore ? skillsStore.map(skill => {
            return {value: skill.name};
        }) : []
        return skillsOptions;
    };

    const getCategoryOptions = () => {
        const categoryOptions = [];
        categoriesStore ? categoriesStore.map(category => {
            if (category.name !== initialCategoryName) {
                categoryOptions.push({value: category.name});
            }
        }) : []
        return categoryOptions;
    };

    const collectCategoriesData = (categoriesRes) => {
        const allCategoriesLists = [];
        categoriesRes && categoriesRes.map((item, index) => {
            const skillsList = item && item.skills && item.skills.map(skill => {
                return <Tag style={{...toRGB(skill.name)}} key={skill.name}  className="sm-tag sm-tag-size" >{skill.name}</Tag>
            });
            const relCatList = item && item.relatedCategories && item.relatedCategories.map(cat => {
                return <Tag style={{...toRGB(cat.name)}} key={cat.name}  className="sm-tag sm-tag-size" >{cat.name}</Tag>
            });
            const row = {
                key: item.name,
                name: item.name,
                guid: item.guid,
                categories:  <SMSkillBar name={item.name}/>,
                skill: skillsList,
                relatedCategories: relCatList
            };
            allCategoriesLists.push(row);
        });
        setCategoriesDataSource(allCategoriesLists);
    };

    const closeModal = () => {
        setVisible(false);
        setLoading(false);
    }

    const convertNameToGuid = (namesList, data) => {
        const itemsGuid = [];
        namesList && namesList.map(item => {
            data.filter(itemInStore => {
                itemInStore.name === item ? itemsGuid.push(itemInStore.guid) : null;
            });
        });
        return itemsGuid;
    };

    const handleAdd = () => {
        setLoading(true);
        const guidsList = convertNameToGuid(skillsNames, skillsStore);
        const relCatGuidsList = convertNameToGuid(relCatNames, categoriesStore);;
        resetCategoryName();
        setIsSkillsListValid(false);
        setIsRelCatListValid(false);
        setRelCatNames([]);
        setSkillsNames([]);
        analyzeAndAddCategory(guidsList, relCatGuidsList);
    };

    const analyzeAndAddCategory = async(guidsList, relCatGuidsList) => {
        try {
            if (categoryName) {
                await addNewCategoryData({name: categoryName, skillsIds: guidsList, relatedCategoriesIds: relCatGuidsList});
                getCategoriesAllData();
                closeModal();
                SMNotification('success', addActionMessage('success', 'Category'));
            }else {
                SMNotification('success', addActionMessage('error', 'Category'));
            }
        } catch(error) {
            closeModal();
            SMNotification('success', addActionMessage('error', 'Category'));
        }
    };

    const analyzeAndUpdateCategory = async (data) => {
        try {
            closeModal();
            await updateCategoryData(data, editedItem.guid);
            SMNotification('success', updateActionMessage('success', 'Category'));
            getCategoriesAllData();
        } catch(error) {
            console.log(error)
            SMNotification('success', updateActionMessage('error', 'Category'));
            closeModal();
        }

    };

    const handleSave = (currentValues) => {
        if (isEdited) {
            if (currentValues && !(initialCategoryName === currentValues.categoryName
                && JSON.stringify(initialSkills)==JSON.stringify(currentValues.skillName)
                && JSON.stringify(initialRelCate)==JSON.stringify(currentValues.relCategory))) {
                const data = {
                    name: currentValues.categoryName,
                    addedCategories: convertNameToGuid(currentValues.relCategory.filter(val => !initialRelCate.includes(val)), categoriesStore),
                    removedCategories: convertNameToGuid(initialRelCate.filter(val => !currentValues.relCategory.includes(val)), categoriesStore),
                    addedskills: convertNameToGuid(currentValues.skillName.filter(val => !initialSkills.includes(val)), skillsStore),
                    removedSkills: convertNameToGuid(initialSkills.filter(val => !currentValues.skillName.includes(val)), skillsStore)
                };
                analyzeAndUpdateCategory(data);
            }
        }
    };

    const handleAddUpdate = () => {
        isEdited ? handleSave() : handleAdd();
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const openAddModal = () => {
        setIsEdited(false);
        setVisible(true);
    };

    const openEditModal = (e, record) => {
        e.stopPropagation();
        setEditedItem(record);
        setInitialCategoryName(record.name);
        const skillList = record.skill && record.skill.map(currSkill => currSkill.key);
        const relCatList = record.categories && record.relatedCategories.map(currRelCat => currRelCat.key);
        setInitialSkills(skillList);
        setInitialRelCate(relCatList);
        setIsEdited(true);
        setVisible(true);

    };

    const deleteItems = async(items) => {
        for(const selectedEl of items) {
            try {
                await deleteCategoryData(selectedEl);
                SMNotification('success', deleteActionMessage('success', 'Category'));
            } catch(error) {
                SMNotification('success', deleteActionMessage('error', 'Category'));
            }
        }
        getCategoriesAllData();
    }

    const handleDelete = async (record) => {
        deleteItems([record.guid])
    };

    const handleSomeDelete = async (selectedRowKeys) => {
        const selectedItemsGuids = [];
        categoriesStore.filter((el) => {
            if (selectedRowKeys && selectedRowKeys.includes(el.name)) {
                selectedItemsGuids.push(el.guid);
            }
        });
        deleteItems(selectedItemsGuids);
    };

    const filterItems = (dataToFilter, filtredData, value, obj) => {
        dataToFilter.filter(item => {
            if(item.name.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(obj) === -1) {
                filtredData.push(obj);
            }
        });
    }
    const handleSearchInputChange = (e) => {
        e.persist();
        const value = e.target.value;
        debounce(300, () => {
            const filtredData = [];
            categoriesStore.filter((item) => {
                if (item.name.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(item) === -1) {
                    filtredData.push(item);
                }
                filterItems(item.skills, filtredData, value, item);
                filterItems(item.relatedCategories, filtredData, value, item);
            });
            collectCategoriesData(filtredData);
        })()
    }

    return (
        <div className='sm-content-skill-style'>
            {categoriesDataSource &&
                <CriteriaTable
                    title={'All Categories'}
                    dataSource={categoriesDataSource}
                    column={getDataSource(categoriesDataSource,
                    isAdmin,
                    openEditModal,
                    handleDelete,
                    SMConfirmModal,
                    )}
                    handleSomeDelete={handleSomeDelete}
                    className='sm-table-criteria'
                    addPagination={true}
                    addCheckbox={true}
                    addClickableOnRow={true}
                    addScroll={true}
                    items={[
                        SMButton({
                            key: 'add',
                            className: "sm-button-add",
                            onClick: openAddModal,
                            loading: loading,
                            disabled: !isAdmin,
                            children: '+',
                            shape: "circle"
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
                title={<h3 className="sm-subheading">{!isEdited ? 'Add' : 'Update'} Category</h3>}
                visible={visible}
                onCancel={handleCancel}
                footer={null}
                maskClosable={false}
            >
                {/* <div className='criteria-container'> */}
                    <SMForm
                        className={'criteria-form'}
                        resetValues={visible}
                        onSubmit={handleAddUpdate}
                        onCancel={handleCancel}
                        handleSave={handleSave}
                        items={[
                            SMInput({
                                className: 'sm-input',
                                name: 'categoryName',
                                type: 'text',
                                placeholder: 'Name',
                                rules: categoryNameRule,
                                initialvalue: isEdited ? initialCategoryName : '',
                            }),
                            SMSelect({
                                className: 'sm-select sm-select-criteria',
                                name: 'skillName',
                                placeholder: 'Skills',
                                options: getSkillsOptions(),
                                mode: 'tags',
                                initialvalue: isEdited ? initialSkills : [],
                                onChange: handleSkillSelect
                            }),
                            SMSelect({
                                className: 'sm-select sm-select-criteria',
                                name: 'relCategory',
                                placeholder: 'Related categories',
                                options: getCategoryOptions(),
                                mode: 'tags',
                                initialvalue: isEdited ? initialRelCate : [],
                                onChange: handleRelCatSelect
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
                {/* </div> */}
            </SMModal>
        </div>
    );
}

export {Categories};
