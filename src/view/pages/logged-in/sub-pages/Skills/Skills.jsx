import React, {useEffect, useState, useReducer} from 'react';
import {Tag} from 'antd';
import {SMConfig} from 'src/config';
import {CriteriaTable} from '../../components/CriteriaTable';
import {SMSkillBar} from '../../components/SMSkillBar';
import {SMConfirmModal} from '../../../../components/SMConfirmModal';
import {SMButton, SMForm, SMIcon, SMInput, SMModal, SMNotification, SMSelect, SMSearch} from 'src/view/components';
import {useValidator} from '../../../../../hooks/common';
import {nameValidator} from 'src/helpers/validators';
import {getSkills} from 'src/store/actions/skillAction';
import {getCategories} from 'src/store/actions/categoryAction';
import {addNewSkillData, deleteSkillData, updateSkillData} from 'src/services/skillsService';
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

function Skills(props) {
    const [skillsStore, dispatchSkill] = useReducer(skills, []);
    const [categoriesStore, dispatchCategory] = useReducer(categories, []);

    const [isAdmin, setIsAdmin] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [skillsDataSource, setSkillsDataSource] = useState(null);

    const [initialSkillName, setInitialSkillName] = useState('');
    const [initialCategories, setInitialCategories] = useState([]);
    const [initialIconName, setInitialIconName] = useState('');

    let [isSkillNameValid, skillName, skillNameRule, resetSkillName] = useValidator(nameValidator('skill'));
    let [isIconNameValid, iconName, iconNameRule, resetIconName] = useValidator(nameValidator('icon'));
    let [isCategoriesListValid, setIsCategoriesListValid] = useState(null);
    let [categoriesNames, setCategoriesNames] = useState(null);

    const [isEdited, setIsEdited] = useState(false);
    const [editedItem, setEditedItem] = useState(false);

    const isEntireFormValid = [
        isSkillNameValid,
        isIconNameValid,
        isCategoriesListValid
    ].every(e => e);

    const handleSelectOptionChangeAndValidate = (catList) => {
        setCategoriesNames(catList);
        let result = categoriesStore && categoriesStore.map(a => a.name);
        if (catList.length) {
            const redundantCat = catList.filter(function(item) {
                return !result.includes(item);
            });
            setIsCategoriesListValid(redundantCat.length ? false : true);
        } else {
            setIsCategoriesListValid(false);
        }
        return isCategoriesListValid;
    }

    useEffect(() => {
        initBasicData();
    }, []);

    useEffect(() => {
        collectSkillsData(skillsStore);
    }, [skillsStore]);

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

    const getCategoryOptions = () => {
        const categoryOptions = categoriesStore ? categoriesStore.map(category => {
            return {value: category.name};
        }) : []
        return categoryOptions;
    };

    const collectSkillsData = (skillsRes) => {
        const allSkillsLists = [];
        skillsRes && skillsRes.map((item, index) => {
            let categoriesList = item && item.categories && item.categories.map(cat => {
                return <Tag style={{...toRGB(cat.name)}} key={cat.name}  className="sm-tag sm-tag-size" >{cat.name}</Tag>
            });
            const row = {
                key: item.name,
                name: item.name,
                guid: item.guid,
                icon: item.icon,
                skill:  <SMSkillBar name={item.name} iconType='fab' iconName={item.icon} iconClassName='sm-table-icon'/>,
                categories: categoriesList,
            };
            allSkillsLists.push(row);
        });
        setSkillsDataSource(allSkillsLists);
    };

    const closeModal = () => {
        setVisible(false);
        setLoading(false);
    }

    const analyzeAndAddSkill = async(guidsList) => {
        try {
            if (skillName && iconName && isCategoriesListValid) {
                await addNewSkillData({name: skillName, icon: iconName, categoriesId: guidsList});
                getSkillsAllData();
                // dispatchSkill(await addNewSkill({name: skillName, icon: iconName, categoriesId: guidsList}));
                closeModal();
                SMNotification('success', SMConfig.messages.skills.addSkill.success);
            }else {
                SMNotification('error', SMConfig.messages.skills.addSkill.missing);
            }
        } catch(error) {
            closeModal();
            SMNotification('error', SMConfig.messages.skills.addSkill.error)
        }
    };

    const handleAdd = () => {
        setLoading(true);
        const guidsList = [];
        categoriesNames && categoriesNames.map(categoryName => {
            return categoriesStore.filter((c) => {
                if (c.name === categoryName) {
                    guidsList.push(c.guid);
                }
            });
        });
        resetSkillName();
        resetIconName();
        setIsCategoriesListValid(false);
        analyzeAndAddSkill(guidsList);
    };

    const collectCategoriesGuidsFromName = (categoriesNames) => {
        const categoriesGuid = [];
        categoriesNames.map(cat => {
            categoriesStore.filter(catStore => {
                catStore.name === cat ? categoriesGuid.push(catStore.guid) : null;
            });
        });
        return categoriesGuid;
    };

    const analyzeAndUpdateSkill = async (data) => {
        try {
            await updateSkillData(data, editedItem.guid);
            getSkillsAllData();
            closeModal();
            SMNotification('success', SMConfig.messages.skills.updateSkill.success);
        } catch(error) {
            SMNotification('error', SMConfig.messages.skills.updateSkill.error)
            closeModal();
        }

    };

    const handleSave = (currentValues) => {
        if (isEdited) {
            if (currentValues && !(initialSkillName === currentValues.skillName
                && initialIconName === currentValues.iconName
                && JSON.stringify(initialCategories)==JSON.stringify(currentValues.categoryName))) {

                const addCategories = currentValues.categoryName.filter(val => !initialCategories.includes(val));
                const deleteCategories = initialCategories.filter(val => !currentValues.categoryName.includes(val));
                const addCategoriesGuid = collectCategoriesGuidsFromName(addCategories);
                const deleteCategoriesGuid = collectCategoriesGuidsFromName(deleteCategories);
                const data = {
                    name: currentValues.skillName,
                    icon: currentValues.iconName,
                    addCategories: addCategoriesGuid,
                    deleteCategories: deleteCategoriesGuid
                };
                analyzeAndUpdateSkill(data);
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
        setInitialSkillName(record.name);
        const catList = record.categories.map(currCat => currCat.key);
        setInitialCategories(catList);
        setInitialIconName(record.icon);
        setIsEdited(true);
        setVisible(true);

    };

    const deleteItems = async(items) => {
        for(const selectedEl of items) {
            try {
                await deleteSkillData(selectedEl);
                SMNotification('success', SMConfig.messages.skills.deleteSkill.success);
            } catch(error) {
                SMNotification('error', `${SMConfig.messages.skills.deleteSkill.success} with ${selectedEl} guid`);
            }
        }
        getSkillsAllData();
    }

    const handleDelete = async (record) => {
        deleteItems([record.guid])
    };

    const handleSomeDelete = async (selectedRowKeys) => {
        const selectedItemsGuids = [];
        skillsStore.filter((el) => {
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
            skillsStore.filter((skillItem) => {
                if (skillItem.name.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(skillItem) === -1) {
                    filtredData.push(skillItem);
                }
                skillItem.categories.filter(catItem => {
                    if(catItem.name.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(skillItem) === -1) {
                        filtredData.push(skillItem);
                    }
                });
            });
            collectSkillsData(filtredData)
        })()
    }

    return (
        <div className='sm-content-skill-style'>
            {skillsDataSource &&
                <CriteriaTable
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
                                name: 'skillName',
                                type: 'text',
                                placeholder: 'Name',
                                rules: skillNameRule,
                                initialvalue: isEdited ? initialSkillName : '',
                            }),
                            SMSelect({
                                className: 'sm-select sm-select-skill',
                                name: 'categoryName',
                                placeholder: 'Category',
                                options: getCategoryOptions(),
                                mode: 'tags',
                                initialvalue: isEdited ? initialCategories : [],
                                onChange: handleSelectOptionChangeAndValidate
                            }),
                            SMInput({
                                className: 'sm-input',
                                name: 'iconName',
                                type: 'text',
                                placeholder: 'Icon',
                                rules: iconNameRule,
                                initialvalue: isEdited ? initialIconName : '',
                            })
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

export {Skills};
