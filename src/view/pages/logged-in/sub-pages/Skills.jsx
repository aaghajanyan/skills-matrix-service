import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {SMSkillBar} from '../components/SMSkillBar';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Tag} from 'antd'; //TODO : move to common components
import {getSkillsData, addNewSkillData} from 'src/services/skillsService';
import {getCategories} from 'src/services/categoryService';
import {SkillsTable} from '../components/SkillsTable';

import {SMConfig} from 'src/config';
import {SMButton, SMForm, SMIcon, SMInput, SMModal, SMNotification, SMSelect} from 'src/view/components';
import {useValidator} from '../../../../hooks/common';
import {nameValidator} from 'src/helpers/validators';
import {getSkills, addSkill} from 'src/store/actions/skillAction';

library.add(fab, far, fas);

function Skills(props) {

    const skills = useSelector(state => state.skill);
    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [skillsLists, setSkillsLists] = useState(null);
    const [categories, setCategories] = useState(null);

    const [isSkillNameValid, skillName, skillNameRule] = useValidator(nameValidator('Skill'));
    // const [isCategoryNameValid, categoryName, categoryNameRule] = useValidator(nameValidator('Category'));
    const [isIconNameValid, iconName, iconNameRule] = useValidator(nameValidator('Icon'));
    const [isCategoriesValid, categoriesNames, categoryRule] = useValidator(nameValidator('Category'));

    const isEntireFormValid = [
        isSkillNameValid,
        isIconNameValid,
        // isCategoriesValid
    ].every(e => e);

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const getSkillsAllData = () => {
        if (skills.length === 0) {
            getSkillsData().then((skillsRes) => {
                dispatch(getSkills(skillsRes));
            }).catch(error=> {
                console.log("Error to get Skills. ", error);
            })
        }
    }

    const collectSkillsData = (skillsRes) => {
        const allSkillsLists = [];
        skillsRes && skillsRes.map((item, index) => {
            let categoriesList = item.categories && item.categories.map(cat => {
                return <Tag key={cat.name} color={getRandomColor()} className="sm-tag">{cat.name}</Tag>
            });
            const row = {
                key: index,
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
            dispatch(addSkill(addedSkill));
        }
    }

    const handleOk = (data) => {
        setLoading(true);
        const guidsList = [];
        categoriesNames.map(categoryName => {
            return categories.filter((c) => {
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

    const getCategoryOptions = () => {
        const categoryOptions = categories ? categories.map(category => {
            return {value: category.name};
        }) : []
        return categoryOptions;
    }

    useEffect(() => {
        getCategories().then((categories) => {
            setCategories(categories);
        })
        getSkillsAllData();

    }, [skillsLists]);

    useEffect(() => {
        collectSkillsData(skills);
    }, [skills]);

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
                        <span> <FontAwesomeIcon icon={['fas', 'pencil-alt']} style={{width: '20px', height: '20px'}} /> </span>
                        <span> <FontAwesomeIcon icon={['far', 'trash-alt']} style={{width: '20px', height: '20px', marginLeft: '10px'}} /> </span>
                        {/*
                //TODO check if current user is admin
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                </Popconfirm> */}

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
                >
                    { loading ? 'Adding' : 'Add'} skill
                </SMButton>
            </div>
        {skillsLists && <SkillsTable skillsLists={skillsLists} column={column}/>}

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
                        href={SMConfig.routes.employees}
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
                <SMForm
                    items={[
                        SMInput({
                            className: 'sm-input',
                            name: 'skillName',
                            type: 'text',
                            placeholder: 'Name',
                            rules: skillNameRule,
                            // onChange: ({(e) => setCriteriaName(e.target.value)})
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
                            className: 'sm-select',
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
            </SMModal>
            </>
    );
}

export {Skills};