import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Tag} from 'antd';
import {CriteriaTable} from 'src/view/pages/logged-in/components/CriteriaTable';
import {SMCriteriaBar} from 'src/view/pages/logged-in/components/SMCriteriaBar';
import {SMConfirmModal} from 'src/view/components/SMConfirmModal';
import {SMButton, SMForm, SMInput, SMModal, SMNotification, SMSelect, SMSearch} from 'src/view/components';
import {useValidator, useModal} from 'src/hooks/common';
import {nameValidator} from 'src/helpers/validators';
import {getPositions, addNewPositionData, updatePositionData, deletePositionData} from 'src/services/positionService';
import {addActionMessage, updateActionMessage, deleteActionMessage} from 'src/config/generate-criteria-message';
import {getUsers} from 'src/services/usersService';
import {getDataSource} from './column';
import {toRGB} from 'src/helpers/generateColor';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {debounce} from 'throttle-debounce';

library.add(fab, far, fas);

function Settings(props) {
    const currentUser = useSelector(state => state.user);
    const [isOpen, openModal, closeModal] = useModal(false);

    const [positions, setPositions] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);

    const [positionsDataSource, setPositionsDataSource] = useState(null);

    const [initialPositionName, setInitialPositionName] = useState('');
    let [isPositionNameValid, positionName,positionNameRule, resetPositionName] = useValidator(nameValidator('position'));

    const [isEdited, setIsEdited] = useState(false);
    const [editedItem, setEditedItem] = useState(false);

    const isEntireFormValid = [
        isPositionNameValid
    ].every(e => e);

    useEffect(() => {
        currentUser && currentUser.roleGroup.name === 'super_user' ? setIsAdmin(true) : setIsAdmin(false);
    }, [currentUser]);

    useEffect(() => {
        initBasicData();
    }, []);

    useEffect(() => {
        collectPositionsData(positions);
    }, [positions, employees]);

    const initBasicData = async () => {
        const usersList = await getUsers();
        setEmployees(usersList);
        const positionList = await getPositions();
        positionList.map((position,index) => {
            const userList = [];
            usersList.map(user => {
                if (user.position.name === position.name) {
                    userList.push(user);
                }
            });
            positionList[index].users = userList;
        });
        setPositions(positionList);
    };

    const collectPositionsData = (positionData) => {
        const collectedPositionData = [];
        positionData && positionData.map((item, index) => {
            let employeesList = item && item.users && item.users.map(user => {
                return <Tag style={{...toRGB(user.fname)}} key={user.guid}  className="sm-tag sm-tag-size" >{user.fname} {user.lname}</Tag>
            });
            const row = {
                key: item.name,
                name: item.name,
                guid: item.guid,
                positions:  <SMCriteriaBar name={item.name}/>,
                employees: employeesList,
            };
            collectedPositionData.push(row);
        });
        setPositionsDataSource(collectedPositionData);
    };

    const closingModal = () => {
        closeModal();
        setLoading(false);
    }

    const analyzeAndAddPosition = async() => {
        try {
            if (positionName) {
                closingModal();
                await addNewPositionData({name: positionName});
                initBasicData();
                SMNotification('success', addActionMessage('success', 'Position'));
            }else {
                SMNotification('error', addActionMessage('missing', 'Position'));
            }
        } catch(error) {
            closingModal();
            SMNotification('error', addActionMessage('error', 'Position'));
        }
    };

    const handleAdd = () => {
        setLoading(true);
        resetPositionName();
        analyzeAndAddPosition();
    };

    const analyzeAndUpdatePosition = async (data) => {
        try {
            await updatePositionData(data, editedItem.guid);
            initBasicData();
            closingModal();
            SMNotification('success', updateActionMessage('success', 'Position'));
        } catch(error) {
            SMNotification('error', updateActionMessage('error', 'Position'));
            closingModal();
        }
    };

    const handleSave = (currentValues) => {
        if (isEdited) {
            if (currentValues && !(initialPositionName === currentValues.positionName)) {
                analyzeAndUpdatePosition({name: currentValues.positionName});
            }
        }
    };

    const handleAddUpdate = () => {
        isEdited ? handleSave() : handleAdd();
    };

    const openAddModal = () => {
        setIsEdited(false);
        openModal();
    };

    const openEditModal = (e, record) => {
        e.stopPropagation();
        setEditedItem(record);
        setInitialPositionName(record.name);
        setIsEdited(true);
        openModal();
    };

    const deleteItems = async(items) => {
        for(const selectedEl of items) {
            try {
                await deletePositionData(selectedEl);
                SMNotification('success', deleteActionMessage('success', 'Position'));
            } catch(error) {
                SMNotification('error', `${deleteActionMessage('error', 'Position')} with ${selectedEl} guid`);
            }
        }
        initBasicData();
    }

    const handleDelete = async (record) => {
        deleteItems([record.guid])
    };

    const handleSomeDelete = async (selectedRowKeys) => {
        const selectedItemsGuids = [];
        positions.filter((el) => {
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
            positions.filter((positionItem) => {
                if (positionItem.name.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(positionItem) === -1) {
                    filtredData.push(positionItem);
                }
                positionItem.users.filter(user => {
                    const name = `${user.fname} ${user.lname}`
                    if(name.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(positionItem) === -1) {
                        filtredData.push(positionItem);
                    }
                });
            });
            collectPositionsData(filtredData)
        })()
    }

    return (
        <div className='sm-content-skill-style'>
            {positionsDataSource &&
                <CriteriaTable
                    title={'Positions'}
                    dataSource={positionsDataSource}
                    column={getDataSource(positionsDataSource,
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
                title={<h3 className="sm-subheading">{!isEdited ? 'Add' : 'Update'} Branch</h3>}
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
                            name: 'positionName',
                            type: 'text',
                            placeholder: 'Position name',
                            rules: positionNameRule,
                            initialvalue: isEdited ? initialPositionName : '',
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
    );
}

export {Settings};
