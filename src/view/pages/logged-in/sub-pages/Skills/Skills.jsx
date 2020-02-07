import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {SMSkillBar} from '../../components/SMSkillBar';
import {SMConfirmModal} from '../../../../components/SMConfirmModal';
import {SkillsTable} from '../../components/SkillsTable';


import {Tag} from 'antd'; //TODO : move to common components
import {SMConfig} from 'src/config';
import {getSkillsData, addNewSkillData, deleteSkillData, updateSkillData, collectAddedSkillData} from 'src/services/skillsService';
import {getCategoriesData} from 'src/services/categoryService';
import {getCurrentUser} from 'src/services/usersService';
import {SMButton, SMForm, SMIcon, SMInput, SMModal, SMNotification, SMSelect} from 'src/view/components';
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

library.add(fab, far, fas);

function Skills(props) {
    const dispatch = useDispatch();

    let skillsStore = useSelector(state => state.skill);
    let categoriesStore = useSelector(state => state.category);

    const [isAdmin, setIsAdmin] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [skillsDataSource, setSkillsDataSource] = useState(null);

    const [initialSkillName, setInitialSkillName] = useState('');
    const [initialCategories, setInitialCategories] = useState([]);
    const [initialIconName, setInitialIconName] = useState('');

    let [isSkillNameValid, skillName, skillNameRule] = useValidator(nameValidator('skill'));
    let [isIconNameValid, iconName, iconNameRule] = useValidator(nameValidator('icon'));
    let [isCategoriesValid, categoriesNames, categoryRule] = useValidator(nameValidator('category'));

    const [isEdited, setIsEdited] = useState(false);
    const [editedItem, setEditedItem] = useState(false);

    const isEntireFormValid = [
        isSkillNameValid,
        isIconNameValid,
        // isCategoriesValid
    ].every(e => e);


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

    const getSkillsAllData = () => {
        getSkillsData().then((skillsRes) => {
            dispatch(addSkill(skillsRes));
        }).catch(error=> {
            console.log("Error to get Skills. ", error);
        })
    };

    const getSkillsAllDataFromRedux = () => {
        if (skillsStore.length === 0) {
            getSkillsAllData();
        }
    };

    const getCategoriesAllData = () => {
        getCategoriesData().then((categories) => {
            dispatch(addCategory(categories));
        }).catch(error=> {
            console.log("Error to get Category. ", error);
        });
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
            let categoriesList = item.categories && item.categories.map(cat => {
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

    // const dispachAddedSkill = (res) => {
    //     if (res.status === 201) {
    //         const addedSkill = {
    //             categories: []
    //         };
    //         addedSkill.name = res.data.name;
    //         addedSkill.icon = res.data.icon;
    //         addedSkill.guid = res.data.guid;
    //         res.data.addedCategories && res.data.addedCategories.map(catItem => {
    //             if (catItem.success) {
    //                 const currentCat = {};
    //                 currentCat.name = catItem.categoryName;
    //                 currentCat.guid = catItem.guid;
    //                 addedSkill.categories.push(currentCat)
    //             }
    //         });
    //         dispatch(addNewSkill(addedSkill));
    //     }
    // };

    const analyzeAndAddSkill = async(guidsList) => {
        if (skillName && iconName && categoriesNames) {
            const res = await addNewSkillData({name: skillName, icon: iconName, categoriesId: guidsList});
            const addedSkill = collectAddedSkillData(res);
            dispatch(addNewSkill(addedSkill));
            setVisible(false);
            setLoading(false);
                // await addNewSkillData({name: skillName, icon: iconName, categoriesId: guidsList});
        }else {
            SMNotification('error', SMConfig.messages.skills.addSkill.missing);
        }
        // if (skillName && iconName && categoriesNames) {
        //     addNewSkillData({name: skillName, icon: iconName, categoriesId: guidsList})
        //     .then((res) => {
        //         SMNotification('success', SMConfig.messages.skills.addSkill.success);
        //         dispachAddedSkill(res);
        //     })
        //     .catch(error => {
        //         if(error.message === 'Network Error'){
        //             SMNotification('error', messages.noConnection);
        //         }
        //         if(error.response) {
        //             if(error.response.status === 409) {
        //                 SMNotification('error', SMConfig.messages.skills.addSkill.error);
        //             }
        //         }
        //     });
        //     setVisible(false);
        // } else {
        //     SMNotification('error', SMConfig.messages.skills.addSkill.missing);
        // }
        // setLoading(false);
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

    const updateSkillItemInStoreObj = (currentValues, categoriesObj) => {
        const foundUpdatedIndex = skillsStore.findIndex(item => item.name == editedItem.name);
        skillsStore[foundUpdatedIndex] = {
            name: currentValues.skillName,
            icon: currentValues.iconName,
            guid: skillsStore[foundUpdatedIndex].guid,
            categories: categoriesObj
        };
    };

    const analyzeAndUpdateSkill = (data) => {
        updateSkillData(data, editedItem.guid)
        .then((res) => {
            setLoading(false);
            SMNotification('success', SMConfig.messages.skills.updateSkill.success);
            dispatch(updateSkill(skillsStore));
        })
        .catch(error => {
            setLoading(false);
            if(error.message === 'Network Error'){
                SMNotification('error', messages.noConnection);
            }
            if(error.response) {
                if(error.response.status === 409) {
                    SMNotification('error', SMConfig.messages.skills.updateSkill.error);
                }
            }
        });
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
                updateSkillItemInStoreObj(currentValues, categoriesObj);
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

    const openEditModal = (record) => {
        setEditedItem(record);
        setInitialSkillName(record.name);
        const catList = record.categories.map(c => {
            return c.key
        });
        setInitialCategories(catList);
        setInitialIconName(record.icon);
        setIsEdited(true);
        setVisible(true);

    };

    const handleDelete = (record) => {
        const items = skillsStore.filter(item => {
            return item.name !== record.name
        });
        deleteSkillData(record.guid).then(() => {
            dispatch(deleteSkill(items));
        });
    };

    return (
        <>
            <div className="skills_add-skills-container">
                    <SMButton
                        className="sm-button"
                        onClick={openAddModal}
                        loading={loading}
                        disabled={!isAdmin}
                    >
                        { loading ? 'Adding' : 'Add'} skill
                    </SMButton>
                </div>
            {skillsDataSource && <SkillsTable refreshTable={initBasicData} skillsDataSource={skillsDataSource} column={getDataSource(skillsDataSource, isAdmin, openEditModal, handleDelete, SMConfirmModal)}/>}

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
                                rules: categoryRule,
                                mode: 'tags',
                                initialvalue: isEdited ? initialCategories : []
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