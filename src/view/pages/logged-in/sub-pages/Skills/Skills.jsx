import React, {useEffect, useState, useReducer} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {SMSkillBar} from '../../components/SMSkillBar';
import {SMConfirmModal} from '../../../../components/SMConfirmModal';
import {SkillsTable} from '../../components/SkillsTable';

import {Tag} from 'antd'; //TODO : move to common components
import {SMConfig} from 'src/config';
import {getCategoriesData} from 'src/services/categoryService';
import {getCurrentUser} from 'src/services/usersService';
import {SMButton, SMForm, SMIcon, SMInput, SMModal, SMNotification, SMSelect, SMSearch} from 'src/view/components';
import {useValidator} from '../../../../../hooks/common';
import {nameValidator} from 'src/helpers/validators';
import {addSkill, addNewSkill, updateSkill, deleteSkill} from 'src/store/actions/skillAction';
import {addCategory, updateCategory, deleteCategory} from 'src/store/actions/categoryAction';
import {getDataSource} from './column';
import {toRGB} from '../../../../../helpers/generateColor';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';

import skills from '../../../../../store/reducers/skillReducer';
import categories from '../../../../../store/reducers/categoryReducer';
import {Input} from 'antd';
const { Search } = Input;

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

    const handleSelectOptionChange = (catList) => {
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
        initBasicDataFromRedux();
    }, []);

    useEffect(() => {
        collectSkillsData(skillsStore);
    }, [skillsStore]);

    const initBasicDataFromRedux = () => {
        initIsAdmin();
        getCategoriesAllDataFromRedux();
        getSkillsAllDataFromRedux()
    };

    const initBasicData = () => {
        initIsAdmin();
        getSkillsAllData()

    };

    const initIsAdmin = () => {
        getCurrentUser().then(res => {
            if (res && res.roleGroup.name === 'super_user') {
                setIsAdmin(true);
            }
        });
    };

    const getSkillsAllData = async () => {
        dispatchSkill(await addSkill());
    };

    const getSkillsAllDataFromRedux = () => {
        if (skillsStore.length === 0) {
            getSkillsAllData();
        }
    };

    const getCategoriesAllData = async () => {
        dispatchCategory(await addCategory());
    };

    const getCategoriesAllDataFromRedux = () => {
        if (categoriesStore.length === 0) {
            getCategoriesAllData();
        }
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

    const analyzeAndAddSkill = async(guidsList) => {
        if (skillName && iconName && isCategoriesListValid) {
            dispatchSkill(await addNewSkill({name: skillName, icon: iconName, categoriesId: guidsList}));
            setIsCategoriesListValid(false);
            setVisible(false);
            setLoading(false);
        }else {
            SMNotification('error', SMConfig.messages.skills.addSkill.missing);
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
            })
        });
        resetSkillName();
        resetIconName();
        analyzeAndAddSkill(guidsList);
    };

    const collectCategoryObj = (currentValues) => {
        const categoriesObj = [];
        currentValues.categoryName && currentValues.categoryName.map(cat => {
            categoriesStore.filter(catStore => {
                catStore.name === cat ? categoriesObj.push(
                    {name: catStore.name, guid: catStore.guid}) : null;
            })
        });
        return categoriesObj;
    };

    const collectCategoriesGuidsFromName = (categoriesNames) => {
        const categoriesGuid = [];
        categoriesNames.map(cat => {
            categoriesStore.filter(catStore => {
                catStore.name === cat ? categoriesGuid.push(catStore.guid) : null;
            })
        });
        return categoriesGuid;
    };

    const analyzeAndUpdateSkill = async (data, currentValues, categoriesObj) => {
        dispatchSkill(await updateSkill(data, editedItem, currentValues, categoriesObj, skillsStore));
        setLoading(false);
        setVisible(false);
    };

    const handleSave = (currentValues) => {
        if (isEdited) {
            if (currentValues && !(initialSkillName === currentValues.skillName
                && initialIconName === currentValues.iconName
                && JSON.stringify(initialCategories)==JSON.stringify(currentValues.categoryName))) {

                const categoriesObj = collectCategoryObj(currentValues);
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
                analyzeAndUpdateSkill(data, currentValues, categoriesObj);
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

    const handleDelete = async (record) => {
        const items = skillsStore.filter(item => {
            return item.name !== record.name
        });
        dispatchSkill(await deleteSkill([record.guid], items));

    };

    const handleSomeDelete = async (selectedRowKeys) => {
        const newSelectedRowKeys = [];
        const remainingRows = [];
        skillsStore.filter((el) => {
            selectedRowKeys && selectedRowKeys.includes(el.name) ? newSelectedRowKeys.push(el.guid) : remainingRows.push(el);
        });
        dispatchSkill(await deleteSkill(newSelectedRowKeys, remainingRows));
    };

    const handleSearchInput = (value) => {
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
    }

    return (
        <>
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
                    items={[
                        SMSearch({
                            key: 'search',
                            placeholder: "Input search text",
                            className: 'sm-search-skill',
                            onSearch: value => handleSearchInput(value),
                            // style: {{ width: 200 }}
                        }),
                        SMIcon({
                            key: 'refresh',
                            className: 'sm-icon-refresh',
                            iconType: 'fas',
                            icon: 'sync-alt',
                            onClick: initBasicData}),
                        SMButton({
                            key: 'add',
                            className: "sm-button",
                            onClick: openAddModal,
                            loading: loading,
                            disabled: !isAdmin,
                            children: loading ? 'Adding skill' : 'Add skill'
                        }),
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
                                onChange: handleSelectOptionChange
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
                    <SMIcon
                        className={'sm-icon-refresh sm-icon-refresh-category'}
                        iconType={'fas'}
                        icon={'sync-alt'}
                        onClick={getCategoriesAllData}
                    />
                </div>
            </SMModal>
        </>
    );
}

export {Skills};