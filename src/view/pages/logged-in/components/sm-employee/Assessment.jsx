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
import {categoriesColumns, categorySkillsColumns} from './data';
import {SMConfirmModal} from 'src/view/components/SMConfirmModal';
import {toRGB} from 'src/helpers/generateColor';
import {debounce} from 'throttle-debounce';
import {getSkills} from 'src/store/actions/skillAction';
import {addActionMessage, updateActionMessage, deleteActionMessage} from 'src/config/generate-criteria-message';
import {useHistory} from 'react-router-dom';

import moment from 'moment';

library.add(fab, far, fas);

function Assessment(props) {
    const currentUser = useSelector(state => state.user);
    const categories = () => {
        if(!props.dashboard){
            return [];
        }
        const categories = props.dashboard.categoriesUsers.map( (category, index) => {
            return ({
                key: index,
                name: category.name,
                average: category.average,
                date: category.last_worked_date
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
                assesment: skill.profficience.mark,
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
                assesment: skill.profficience.mark,
                date: skill.last_worked_date,
                guid: skill.guid,
                experience: skill.experience,
                categories: skill.categories
            })
        });

        return skills;
    };

    const [skillsStore, dispatchSkill] = useState([]);

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [someDelete, setSomeDelete] = useState(false);

    const [skillsDataSource, setSkillsDataSource] = useState(null);

    const [initialSkillName, setInitialSkillName] = useState('');
    const [initialExperience, setInitialExperience] = useState(0);
    const [initialProfficience, setInitialProfficience] = useState(0);

    let [isProfficienceNameValid, profficienceName, profficienceRule, resetProfficienceName] = useValidator(numberValidator('profficience'));
    let [isExpNameValid, expName, expRule, resetExpName] = useValidator(numberValidator('experience'));

    let [isSkillListValid, setIsSkillListValid] = useState(null);

    const [isEdited, setIsEdited] = useState(false);
    const [editedItem, setEditedItem] = useState(false);
    const [usersSkillsData, setUsersSkillsData] = useState({});
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

    const thisUser = () => {
        const thisUse = history.location.pathname.replace('/employees/','');
        return thisUse === '/' ? true : thisUse === currentUser.guid
    }

    const collectSkillsData = (skillsRes) => {
        const allSkillsLists = [];
        skillsRes && skillsRes.map((item, index) => {
            const row = {
                key: item.key,
                date: item.date,
                guid: item.guid,
                assesment: item.assesment,
                icon: item.icon,
                skill:  <SMSkillBar name={item.skill} iconType='fab' iconName={item.icon} iconClassName='sm-table-icon'/>,
                categories: <Tag style={{...toRGB(item.categories)}} key={item.categories}  className="sm-tag sm-tag-size" >{item.categories}</Tag>,
                experience: item.experience
            };

            allSkillsLists.push(row);
        });
        setSkillsDataSource(allSkillsLists);
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

    const handleSave = (currentValues) => {
        if (isEdited) {
            if (currentValues) {
                const data = { skills: [{}]};
                if(initialExperience !== currentValues.experience) {
                    data.skills[0].experience = currentValues.experience;
                }
                if(initialProfficience !== currentValues.profficience) {
                    data.skills[0].profficience = currentValues.profficience;
                }
                if(initialDate !== currentValues['last_worked_date']) {
                    data.skills[0]['last_worked_date'] = currentValues['last_worked_date'];
                }
                analyzeAndUpdateSkill(data);
            }
        }
    };

    const handleAddUpdate = () => {
        isEdited ? handleSave() : handleAdd();
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

    const openAddModal = async () => {
        setUsersSkillsData(Object.assign(usersSkillsData, { last_worked_date: moment().format('YYYY-MM-DD')}));
        setIsEdited(false);
        setVisible(true);
    };

    const openEditModal = (e, record) => {
        e.stopPropagation();
        setEditedItem(record.guid);
        setInitialSkillName(record.skill.props.name);
        setInitialExperience(record.experience);
        setInitialProfficience(record.assesment);
        setInitialDate(record.date);
        setIsEdited(true);
        setVisible(true);
    };

    const deleteItem = async (item) => {
        try {
            await deleteUserSkills(currentUser.guid, item);
            !someDelete && SMNotification('success', deleteActionMessage('success', 'Skill'));
        } catch(error) {
            SMNotification('error', `${deleteActionMessage('error', 'Skill')} with ${selectedEl} guid`);
        }
        allSkills();
    }

    const handleDelete = async (record) => {
        deleteItem(record.guid)
    };

    const handleChangeSkillName = (e) => {
        setUsersSkillsData(Object.assign(usersSkillsData, { skillName: e}));
       if(usersSkillsData.skillName){
           setIsSkillListValid(true)
       }else{
            setIsSkillListValid(false)
       }
        return isSkillListValid;
    }

    const handleChangeLastWorkedDate = (e, dateString) => {
        setUsersSkillsData(Object.assign(usersSkillsData, { last_worked_date: dateString}));
    }

    const handleChangeExperience = (e) => {
        setUsersSkillsData(Object.assign(usersSkillsData, { [e.target.name]: e.target.value}));
    }

    const handleChangeProfficience = (e) => {
        setUsersSkillsData(Object.assign(usersSkillsData, { [e.target.name]: e.target.value}));
    }

    const handleAdd = () => {
        setLoading(true);
        resetProfficienceName();
        resetExpName();
        const guidsList = convertNameToGuid(usersSkillsData.skillName, skillsStore.payload);
        analyzeAndAddSkill(guidsList);
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

    const handleSomeDelete = (e) => {
        setSomeDelete(true);
        const guidList = []
        e.map(skillName => {
            allSkills().map(skill => {
                if(skill.name === skillName) {
                    guidList.push(skill.guid);
                }
            });
        });
        guidList.map((skillGuid,index) => {
            deleteItem(skillGuid);
            if(index === guidList.length) {
                setSomeDelete(false);
            }
        });
    }

    return (
        <React.Fragment>
            <div className="sm-component">
                <h3 className="sm-subheading">Categories</h3>
                <SMTable
                    className="sm-table"
                    columns={categoriesColumns}
                    dataSource={categories()}
                    pagination={undefined}
                />
            </div>
            <div className='sm-content-skill-style'>
                {skillsDataSource &&
                    <CriteriaTable
                        title="All skills"
                        dataSource={skillsDataSource}
                        column={categorySkillsColumns(skillsDataSource,
                            thisUser(),
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
                title={<h3 className="sm-subheading">{!isEdited ? 'Add' : 'Update'} Skill</h3>}
                visible={visible}
                onCancel={handleCancel}
                footer={null}
                maskClosable={false}
            >
                    <SMForm
                        className={'criteria-form'}
                        resetValues={visible}
                        onSubmit={handleAddUpdate}
                        onCancel={handleCancel}
                        handleSave={handleSave}
                        items={[
                            SMSelect({
                                className: 'sm-select sm-select-criteria',
                                name: 'skillName',
                                placeholder: 'Skill name',
                                options: getSkillNames(),
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
                                placeholder: 'Profficience',
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