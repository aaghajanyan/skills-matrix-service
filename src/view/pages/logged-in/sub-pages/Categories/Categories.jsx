import React, {useEffect, useState, useReducer} from 'react';
import {Tag} from 'antd';
import {SMConfig} from 'src/config';
import {SkillsTable} from '../../components/SkillsTable';
import {SMSkillBar} from '../../components/SMSkillBar';
import {SMConfirmModal} from '../../../../components/SMConfirmModal';
import {SMButton, SMForm, SMIcon, SMInput, SMModal, SMNotification, SMSelect, SMSearch} from 'src/view/components';
import {useValidator} from '../../../../../hooks/common';
import {nameValidator} from 'src/helpers/validators';
import {getSkills} from 'src/store/actions/skillAction';
import {getCategories} from 'src/store/actions/categoryAction';
import {getCategoriesData, addNewCategoryData, updateCategoryData, deleteCategoryData} from 'src/services/categoryService';
import {getCurrentUser} from 'src/services/usersService';
import {getDataSource} from './column';
import skills from '../../../../../store/reducers/skillReducer';
import categories from '../../../../../store/reducers/categoryReducer';
import {toRGB} from '../../../../../helpers/generateColor';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {debounce} from 'throttle-debounce';

library.add(fab, far, fas);

function Categories(props) {
    const [skillsStore, dispatchSkill] = useReducer(skills, []);
    const [categoriesStore, dispatchCategory] = useReducer(categories, []);

    const [isAdmin, setIsAdmin] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [skillsDataSource, setSkillsDataSource] = useState(null);

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
        isSkillsListValid,
        isRelCatListValid
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
        initBasicData();
    }, []);

    useEffect(() => {
        collectCategoriesData(categoriesStore);
    }, [categoriesStore]);

    const initBasicData = () => {
        initIsAdmin();
        getSkillsAllData();
        getCategoriesAllData();
    };

    const initIsAdmin = () => {
        getCurrentUser().then(res => {
            res && res.roleGroup.name === 'super_user' ? setIsAdmin(true) : setIsAdmin(false);
        });
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
            let skillsList = item && item.skills && item.skills.map(skill => {
                return <Tag style={{...toRGB(skill.name)}} key={skill.name}  className="sm-tag sm-tag-size" >{skill.name}</Tag>
            });
            let relCatList = item && item.relatedCategories && item.relatedCategories.map(cat => {
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
        setSkillsDataSource(allCategoriesLists);
    };

    const closeModal = () => {
        setVisible(false);
        setLoading(false);
    }

    const analyzeAndAddCategory = async(guidsList, relCatGuidsList) => {
        try {
            if (categoryName && isSkillsListValid) {
                await addNewCategoryData({name: categoryName, skillsIds: guidsList, relatedCategoriesIds: relCatGuidsList});
                getCategoriesAllData();
                closeModal();
                SMNotification('success', SMConfig.messages.skills.addSkill.success);
            }else {
                SMNotification('error', SMConfig.messages.skills.addSkill.missing);
            }
        } catch(error) {
            console.log(error)
            closeModal();
            SMNotification('error', SMConfig.messages.skills.addSkill.error)
        }
    };

    const handleAdd = () => {
        setLoading(true);
        const guidsList = [];
        const relCatGuidsList = [];
        skillsNames && skillsNames.map(skillName => {
            return skillsStore.filter((s) => {
                if (s.name === skillName) {
                    guidsList.push(s.guid);
                }
            });
        });
        relCatNames && relCatNames.map(catName => {
            return categoriesStore.filter((c) => {
                if (c.name === catName) {
                    relCatGuidsList.push(c.guid);
                }
            });
        });
        resetCategoryName();
        setIsSkillsListValid(false);
        setIsRelCatListValid(false);
        setRelCatNames([]);
        setSkillsNames([]);
        analyzeAndAddCategory(guidsList, relCatGuidsList);
    };

    const convertNameToGuid = (namesList, data) => {
        const itemsGuid = [];
        namesList.map(item => {
            data.filter(itemInStore => {
                itemInStore.name === item ? itemsGuid.push(itemInStore.guid) : null;
            });
        });
        return itemsGuid;
    };

    const analyzeAndUpdateCategory = async (data) => {
        try {
            await updateCategoryData(data, editedItem.guid);
            closeModal();
            SMNotification('success', SMConfig.messages.skills.updateSkill.success);
            getCategoriesAllData();
        } catch(error) {
            console.log(error)
            SMNotification('error', SMConfig.messages.skills.updateSkill.error)
            closeModal();
        }

    };

    const handleSave = (currentValues) => {
        if (isEdited) {
            if (currentValues && !(initialCategoryName === currentValues.categoryName
                && JSON.stringify(initialSkills)==JSON.stringify(currentValues.skillName)
                && JSON.stringify(initialRelCate)==JSON.stringify(currentValues.relCategory))) {

                const addedskillsName = currentValues.skillName.filter(val => !initialSkills.includes(val));
                const removedSkillsName = initialSkills.filter(val => !currentValues.skillName.includes(val));
                const addedCategoriesName = currentValues.relCategory.filter(val => !initialRelCate.includes(val));
                const removedCategoriesName = initialRelCate.filter(val => !currentValues.relCategory.includes(val));

                const addedCategories = convertNameToGuid(addedCategoriesName, categoriesStore);
                const removedCategories = convertNameToGuid(removedCategoriesName, categoriesStore);
                const addedskills = convertNameToGuid(addedskillsName, skillsStore);
                const removedSkills = convertNameToGuid(removedSkillsName, skillsStore);

                const data = {
                    name: currentValues.categoryName,
                    addedCategories: addedCategories,
                    removedCategories: removedCategories,
                    addedskills: addedskills,
                    removedSkills: removedSkills
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
                SMNotification('success', SMConfig.messages.skills.deleteSkill.success);
            } catch(error) {
                console.log(error)
                SMNotification('error', `${SMConfig.messages.skills.deleteSkill.success} with ${selectedEl} guid`);
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

    const handleSearchInputChange = (e) => {
        e.persist();
        const value = e.target.value;
        debounce(300, () => {
            const filtredData = [];

            categoriesStore.filter((item) => {
                console.log(item)
                if (item.name.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(item) === -1) {
                    filtredData.push(item);
                }
                item.skills.filter(skillItem => {
                    if(skillItem.name.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(item) === -1) {
                        filtredData.push(item);
                    }
                });
                item.relatedCategories.filter(catItem => {
                    if(catItem.name.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(item) === -1) {
                        filtredData.push(item);
                    }
                });
            });
            collectCategoriesData(filtredData);
        })()
    }

    return (
        <div className='sm-content-skill-style'>
            {skillsDataSource &&
                <SkillsTable
                    skillsDataSource={skillsDataSource}
                    column={getDataSource(skillsDataSource,
                    isAdmin,
                    openEditModal,
                    handleDelete,
                    SMConfirmModal,
                    )}
                    handleSomeDelete={handleSomeDelete}
                    className='sm-table-skill'
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
                            className: 'sm-search-skill',
                            onChange: e => handleSearchInputChange(e),
                        })
                    ]}
                    />}

            <SMModal
                className="add-skill-modal"
                title={<h3 className="sm-subheading">{!isEdited ? 'Add' : 'Update'} Skill</h3>}
                visible={visible}
                onCancel={handleCancel}
                footer={[]}
                maskClosable={false}
            >
                <div className='add-skill-container'>
                    <SMForm
                        className={'add-skill-form'}
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
                                className: 'sm-select sm-select-skill',
                                name: 'skillName',
                                placeholder: 'Skills',
                                options: getSkillsOptions(),
                                mode: 'tags',
                                initialvalue: isEdited ? initialSkills : [],
                                onChange: handleSkillSelect
                            }),
                            SMSelect({
                                className: 'sm-select sm-select-skill',
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
                </div>
            </SMModal>
        </div>
    );
}

export {Categories};
