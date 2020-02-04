import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {SMSkillBar} from '../components/SMSkillBar';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Tag} from 'antd'; //TODO : move to common components
import {getSkillsData, addNewSkillData, deleteSkillData} from 'src/services/skillsService';
import {getCategoriesData} from 'src/services/categoryService';
import {getCurrentUser} from 'src/services/usersService';

import {SkillsTable} from '../components/SkillsTable';

import {SMConfig} from 'src/config';
import {SMButton, SMForm, SMIcon, SMInput, SMModal, SMNotification, SMSelect} from 'src/view/components';
import {useValidator} from '../../../../hooks/common';
import {nameValidator} from 'src/helpers/validators';
import {addSkill, updateSkill, deleteSkill} from 'src/store/actions/skillAction';
import {addCategory, updateCategory, deleteCategory} from 'src/store/actions/categoryAction';
import { Popconfirm } from 'antd';

library.add(fab, far, fas);

function Skills(props) {

    let skills = useSelector(state => state.skill);
    let categoriesState = useSelector(state => state.category);
    const dispatch = useDispatch();

    const [isAdmin, setIsAdmin] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [skillsLists, setSkillsLists] = useState(null);

    const [isSkillNameValid, skillName, skillNameRule] = useValidator(nameValidator('Skill'));
    // const [isCategoryNameValid, categoryName, categoryNameRule] = useValidator(nameValidator('Category'));
    const [isIconNameValid, iconName, iconNameRule] = useValidator(nameValidator('Icon'));
    const [isCategoriesValid, categoriesNames, categoryRule] = useValidator(nameValidator('Category'));

    const isEntireFormValid = [
        isSkillNameValid,
        isIconNameValid,
        // isCategoriesValid
    ].every(e => e);

    const toRGB = function(str) {
        var hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        let rgb = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 255;
            rgb[i] = value;
        }
        // return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        return `rgb(${rgb[0]}, 0, ${rgb[2]})`;
    }

    const collectSkillsData = (skillsRes) => {
        const allSkillsLists = [];
        skillsRes && skillsRes.map((item, index) => {
            let categoriesList = item.categories && item.categories.map(cat => {
                return <Tag key={cat.name} color={toRGB(cat.name)} className="sm-tag">{cat.name}</Tag>
            });
            const row = {
                key: item.name,
                name: item.name,
                skill:  <SMSkillBar name={item.name} icon={['fab', 'react']} style={{width: '30px', height: '30px'}} />,
                categories: categoriesList,
            };
            allSkillsLists.push(row);
        });
        setSkillsLists(allSkillsLists);
    }

    const dispachAddedSkill = (res) => {
        if (res.status === 201) {
            const addedSkill = {
                categories: []
            };
            addedSkill.name = res.data.name;
            addedSkill.guid = res.data.guid;
            res.data.addedCategories && res.data.addedCategories.map(catItem => {
                if (catItem.success) {
                    const currentCat = {};
                    currentCat.name = catItem.categoryName;
                    currentCat.guid = catItem.guid;
                    addedSkill.categories.push(currentCat)
                }
            });
            dispatch(updateSkill(addedSkill));
        }
    }

    const handleOk = (data) => {
        setLoading(true);
        const guidsList = [];
        categoriesNames.map(categoryName => {
            return categoriesState.filter((c) => {
                if (c.name === categoryName) {
                    guidsList.push(c.guid);
                }
            })
        });
        addNewSkillData({name: skillName, categoriesId: guidsList})
            .then((res) => {
                setLoading(false);
                SMNotification('success', SMConfig.messages.skills.addSkill.success);
                dispachAddedSkill(res);
            })
            .catch(error => {
                setLoading(false);
                if(error.message === 'Network Error'){
                    SMNotification('error', messages.noConnection);
                }
                if(error.response) {
                    if(error.response.status === 409) {
                        SMNotification('error', SMConfig.messages.skills.addSkill.error);
                    }
                }
            });
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const openModal = () => {
        setVisible(true);
    };

    const initIsAdmin = () => {
        getCurrentUser().then(res => {
            if (res && res.roleGroup.name === 'super_user') {
                setIsAdmin(true);
            }
        });
    }

    const getSkillsAllData = () => {
        getSkillsData().then((skillsRes) => {
            dispatch(addSkill(skillsRes));
        }).catch(error=> {
            console.log("Error to get Skills. ", error);
        })
    }

    const getSkillsAllDataFromRedux = () => {
        if (skills.length === 0) {
            getSkillsAllData();
        }
    }

    const getCategoriesAllData = () => {
        getCategoriesData().then((categories) => {
            dispatch(addCategory(categories));
        }).catch(error=> {
            console.log("Error to get Category. ", error);
        });
    }

    const getCategoriesAllDataFromRedux = () => {
        if (categoriesState.length === 0) {
            getCategoriesAllData();
        }
    }

    const getCategoryOptions = () => {
        const categoryOptions = categoriesState ? categoriesState.map(category => {
            return {value: category.name};
        }) : []
        return categoryOptions;
    }

    const initBasicDataFromRedux = () => {
        initIsAdmin();
        getCategoriesAllDataFromRedux();
        getSkillsAllDataFromRedux()
    }

    const initBasicData = () => {
        initIsAdmin();
        getSkillsAllData()
    }

    useEffect(() => {
        initBasicDataFromRedux();
    }, [skillsLists]);

    useEffect(() => {
        collectSkillsData(skills);
    }, [skills]);

    const handleDelete = (key) => {
        const deletedItem = skills.find(item => {
            return item.name === key
        });
        deleteSkillData(deletedItem.guid).then(res => {
            dispatch(deleteSkill(key));
        });
    }

    const comparator = (a, b) => {
        if(a > b) { return -1; }
        if(a < b) { return 1; }
        return 0;
    };

    const column = [
        {
            title: 'Skill',
            dataIndex: 'skill',
            width: '15%',
            sorter: (a, b) => comparator(a.name, b.name)
        },
        {
            title: 'Categories',
            dataIndex: 'categories',
            width: '30%'
        },
        {
            title: '',
            dataIndex: 'operation',
            // TODO use SMIcon
            render: (text, record) =>
                skillsLists.length >= 1 ? (
                    <div style={{cursor: 'not-allowed', opacity: '0.5', width: '100px', paddingLeft: '45px'}}>
                        {
                            {isAdmin} &&
                            <>
                                <SMIcon className={'refresh-btn'} iconType={'fas'} icon={'pencil-alt'} style={{width: '20px', height: '20px'}} onClick={openModal}/>
                                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                                    <SMIcon className={'refresh-btn'} iconType={'fas'} icon={'trash-alt'} style={{width: '20px', height: '20px'}}/>
                                </Popconfirm>
                            </>
                        }
                    </div>
                ) : null,
            width: '10%'
        }
    ];

    return (
        <>
        <div className="skills_add-skills-container">
                <SMButton
                    className="sm-button"
                    onClick={openModal}
                    loading={loading}
                    disabled={!isAdmin}
                >
                    { loading ? 'Adding' : 'Add'} skill
                </SMButton>
            </div>
        {skillsLists && <SkillsTable refreshTable={initBasicData} skillsLists={skillsLists} column={column}/>}

        <SMModal
                className="add-skill-modal"
                title={
                    <h3 className="sm-subheading">
                        Add Skill
                    </h3>
                }
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <SMButton
                        className="sm-link"
                        key="cancel"
                        type="link"
                        onClick={handleCancel}
                    >
                        Cancel
                    </SMButton>,
                    <SMButton
                        className="sm-button"
                        key="ok"
                        type="primary"
                        onClick={handleOk}
                        disabled={!(isEntireFormValid)}
                    >
                        Add
                    </SMButton>
                ]}
            >
                <div className='add-skill-container'>

                    <SMIcon
                        className={'refresh-btn category-refresh'}
                        iconType={'fas'}
                        icon={'sync-alt'}
                        style={{width: '30px', height: '30px'}}
                        onClick={getCategoriesAllData}
                    />
                    <SMForm
                        className={'add-skill-form'}
                        resetValues={loading}
                        items={[
                            SMInput({
                                className: 'sm-input',
                                name: 'skillName',
                                type: 'text',
                                placeholder: 'Name',
                                rules: skillNameRule,
                                value: 'aaa',
                                defaultValue: 'aaaaaa'
                                // prefix: (
                                //     <SMIcon
                                //         className="sm-icon-grey"
                                //         iconType="fas"
                                //         icon="envelope"
                                //     />
                                // ),
                                // autoComplete: 'username'
                            }),
                            SMSelect({
                                className: 'sm-select sm-select_skill',
                                name: 'categoryName',
                                placeholder: 'Category',
                                options: getCategoryOptions(),
                                rules: categoryRule,
                                mode: 'tags'
                            }),
                            SMInput({
                                className: 'sm-input',
                                name: 'iconName',
                                type: 'text',
                                placeholder: 'Icon',
                                rules: iconNameRule,
                                value: 'bbb',
                                defaultValue: 'bbbbbb'
                            //     // prefix: (
                            //     //     <SMIcon
                            //     //         className="sm-icon-grey"
                            //     //         iconType="fas"
                            //     //         icon="envelope"
                            //     //     />
                            //     // ),
                            //     autoComplete: 'username'
                            }),
                        ]}
                    />
                </div>
            </SMModal>
            </>
    );
}

export {Skills};