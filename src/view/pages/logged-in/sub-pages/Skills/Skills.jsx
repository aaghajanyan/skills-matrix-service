import React, {useEffect, useState, useReducer} from 'react';
import {useSelector} from 'react-redux';
import {Tag, Upload} from 'antd';
import {CriteriaTable} from 'src/view/pages/logged-in/components/CriteriaTable';
import {SMCriteriaBar} from 'src/view/pages/logged-in/components/SMCriteriaBar';
import {SMConfirmModal} from 'src/view/components/SMConfirmModal';
import {SMButton, SMForm, SMInput, SMModal, SMNotification, SMSelect, SMSearch} from 'src/view/components';
import {useValidator, useModal} from 'src/hooks/common';
import {nameValidator} from 'src/helpers/validators';
import {getSkills} from 'src/store/actions/skillAction';
import {getCategories} from 'src/store/actions/categoryAction';
import {addNewSkillData, deleteSkillData, updateSkillData} from 'src/services/skillsService';
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
import {SMIconsCards, SMIcon, SMUpload} from 'src/view/components';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


library.add(fab, far, fas);

function Skills(props) {

    const [isOpen, openModal, closeModal] = useModal(false);
    const [isIconModalOpen, openIconModal, closeIconModal] = useModal(false);

    const currentUser = useSelector(state => state.user);

    const [skillsStore, dispatchSkill] = useReducer(skills, []);
    const [categoriesStore, dispatchCategory] = useReducer(categories, []);

    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);

    const [skillsDataSource, setSkillsDataSource] = useState(null);

    const [initialSkillName, setInitialSkillName] = useState('');
    const [initialCategories, setInitialCategories] = useState([]);
    const [initialIconName, setInitialIconName] = useState('');
    const [editedIconName, setEditedIconName] = useState(initialIconName);

    const [isSkillNameValid, skillName, skillNameRule, resetSkillName] = useValidator(nameValidator('skill'));
    const [isIconNameValid, iconName, iconNameRule, resetIconName] = useValidator(nameValidator('icon'));
    const [isCategoriesListValid, setIsCategoriesListValid] = useState(null);
    const [categoriesNames, setCategoriesNames] = useState(null);

    const [isEdited, setIsEdited] = useState(false);
    const [editedItem, setEditedItem] = useState(false);

    const [selectedIcon, setSelectedIcon] = useState('');

    const isEntireFormValid = [
        isSkillNameValid,
        // isIconNameValid,
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
        currentUser && currentUser.roleGroup.name === 'super_user' ? setIsAdmin(true) : setIsAdmin(false);
    }, [currentUser]);

    useEffect(() => {
        initBasicData();
    }, []);

    useEffect(() => {
        collectSkillsData(skillsStore);
    }, [skillsStore]);

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
                skill:  <SMCriteriaBar name={item.name} iconType='fab' iconName={item.icon} iconClassName='sm-table-icon'/>,
                categories: categoriesList,
            };
            allSkillsLists.push(row);
        });
        setSkillsDataSource(allSkillsLists);
    };

    const closingModal = () => {
        closeModal()
        setLoading(false);
    }

    const analyzeAndAddSkill = async(guidsList) => {
        try {
            if (skillName && selectedIcon && isCategoriesListValid) {
                closingModal();
                await addNewSkillData({name: skillName, icon: selectedIcon, categoriesId: guidsList});
                getSkillsAllData();
                SMNotification('success', addActionMessage('success', 'Skill'));
            }else {
                SMNotification('error', addActionMessage('error', 'Skill'));
            }
        } catch(error) {
            closingModal();
            SMNotification('error', addActionMessage('error', 'Skill'));
        }
    };

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
        const guidsList = convertNameToGuid(categoriesNames, categoriesStore);
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
            closingModal();
            SMNotification('success', updateActionMessage('success', 'Skill'));
        } catch(error) {
            SMNotification('error', updateActionMessage('error', 'Skill'));
            closingModal();
        }
    };

    const valuesAreTheSame = (currentValues) => {
        return currentValues ? initialSkillName === currentValues.skillName
            && initialIconName === currentValues.iconName
            && JSON.stringify(initialCategories)==JSON.stringify(currentValues.categoryName) : false;
    }

    const handleSave = (currentValues) => {
        if (isEdited) {
            if (currentValues && !valuesAreTheSame(currentValues)) {
                const data = {
                    name: currentValues.skillName,
                    icon: currentValues.iconName,
                    addCategories: collectCategoriesGuidsFromName(currentValues.categoryName.filter(val => !initialCategories.includes(val))),
                    deleteCategories: collectCategoriesGuidsFromName(initialCategories.filter(val => !currentValues.categoryName.includes(val)))
                };
                analyzeAndUpdateSkill(data);
            }
        }
    };

    const handleAddUpdate = () => {
        isEdited ? handleSave() : handleAdd();
    };

    const openAddModal = () => {
        setIsEdited(false);
        setSelectedIcon('');
        openModal();
    };

    const openEditModal = (e, record) => {
        e.stopPropagation();
        setSelectedIcon(record.icon);
        setEditedItem(record);
        setInitialSkillName(record.name);
        const catList = record.categories.map(currCat => currCat.key);
        setInitialCategories(catList);
        setInitialIconName(record.icon);
        setEditedIconName(record.icon);
        setIsEdited(true);
        openModal();
    };

    const deleteItems = async(items) => {
        for(const selectedEl of items) {
            try {
                await deleteSkillData(selectedEl);
                SMNotification('success', deleteActionMessage('success', 'Skill'));
            } catch(error) {
                SMNotification('error', `${deleteActionMessage('error', 'Skill')} with ${selectedEl} guid`);
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

    const openSelectIconModal = (e) => {
        e.preventDefault();
        openIconModal();
    }

    const handleClickIcon = (name) => {
        closeIconModal();
        setSelectedIcon(name);
        setEditedIconName(name)
    }

    return (
        <div className='sm-content-skill-style'>
            <SMModal
                className="select-icon-modal"
                title={<h3 className="sm-subheading">Select icon</h3>}
                visible={isIconModalOpen}
                onCancel={closeIconModal}
                footer={null}
                maskClosable={false}
            >
                <SMIconsCards onIconClick={handleClickIcon} />
            </SMModal>

            {skillsDataSource &&
                <CriteriaTable
                    title={'All Skills'}
                    dataSource={skillsDataSource}
                    column={getDataSource(skillsDataSource,
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
                        isAdmin && SMButton({
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
                title={<h3 className="sm-subheading">{!isEdited ? 'Add' : 'Update'} Skill</h3>}
                visible={isOpen}
                onCancel={closeModal}
                footer={null}
                maskClosable={false}
            >
                <SMForm
                    className={'criteria-form'}
                    resetValues={isOpen}
                    onSubmit={handleAddUpdate}
                    onCancel={closeModal}
                    handleSave={handleSave}
                    items={[
                        SMInput({
                            className: 'sm-input',
                            name: 'skillName',
                            type: 'text',
                            placeholder: 'Skill name',
                            rules: skillNameRule,
                            initialvalue: isEdited ? initialSkillName : '',
                        }),
                        SMSelect({
                            className: 'sm-select sm-select-criteria',
                            name: 'categoryName',
                            placeholder: 'Category name',
                            options: getCategoryOptions(),
                            mode: 'tags',
                            initialvalue: isEdited ? initialCategories : [],
                            onChange: handleSelectOptionChangeAndValidate
                        }),
                        SMInput({
                            className: 'sm-input',
                            name: 'iconName',
                            type: 'text',
                            placeholder: 'Icon name',
                            rules: iconNameRule,
                            initialvalue: isEdited ? editedIconName : selectedIcon,
                            disabled: true
                        }),
                        SMUpload({
                            className: "sm-upload",
                            name: "uploadImg",
                            children: 'Upload icon',
                            openSelectIconModal:openSelectIconModal,
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
                        }),
                    ]}
                />
            </SMModal>
        </div>
    );
}

export {Skills};
