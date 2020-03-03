import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Tag} from 'antd';
import {SMConfig} from 'src/config';
import {CriteriaTable} from 'src/view/pages/logged-in/components/CriteriaTable';
import {SMSkillBar} from 'src/view/pages/logged-in/components/SMSkillBar';
import {SMConfirmModal} from 'src/view/components/SMConfirmModal';
import {SMButton, SMForm, SMInput, SMModal, SMNotification, SMSelect, SMSearch} from 'src/view/components';
import {useValidator, useModal} from 'src/hooks/common';
import {nameValidator} from 'src/helpers/validators';
import {getBranches, addNewBranchData, updateBranchData, deleteBranchData} from 'src/services/branchService';
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

function Branches(props) {
    const currentUser = useSelector(state => state.user);
    const [isOpen, openModal, closeModal] = useModal(false);

    const [branches, setBranches] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);

    const [branchesDataSource, setBranchesDataSource] = useState(null);

    const [initialBranchName, setInitialBranchName] = useState('');
    let [isBranchNameValid, branchName, branchNameRule, resetBranchName] = useValidator(nameValidator('branch'));

    const [isEdited, setIsEdited] = useState(false);
    const [editedItem, setEditedItem] = useState(false);

    const isEntireFormValid = [
        isBranchNameValid
    ].every(e => e);

    useEffect(() => {
        currentUser && currentUser.roleGroup.name === 'super_user' ? setIsAdmin(true) : setIsAdmin(false);
    }, [currentUser]);

    useEffect(() => {
        initBasicData();
    }, []);

    useEffect(() => {
        collectBranchesData(branches);
    }, [branches, employees]);

    const initBasicData = async () => {
        const usersList = await getUsers();
        setEmployees(usersList);
        const branchList = await getBranches();
        branchList.map((branch,index) => {
            const userList = [];
            usersList.map(user => {
                if (user.branch.name === branch.name) {
                    userList.push(user);
                }
            });
            branchList[index].users = userList;
        });
        setBranches(branchList);
    };

    const collectBranchesData = (branchData) => {
        const collectedBranchData = [];
        branchData && branchData.map((item, index) => {
            let employeesList = item && item.users && item.users.map(user => {
                return <Tag style={{...toRGB(user.fname)}} key={user.guid}  className="sm-tag sm-tag-size" >{user.fname} {user.lname}</Tag>
            });
            const row = {
                key: item.name,
                name: item.name,
                guid: item.guid,
                branches:  <SMSkillBar name={item.name}/>,
                employees: employeesList,
            };
            collectedBranchData.push(row);
        });
        setBranchesDataSource(collectedBranchData);
    };

    const closingModal = () => {
        closeModal();
        setLoading(false);
    }

    const analyzeAndAddBranch = async() => {
        try {
            if (branchName) {
                closingModal();
                await addNewBranchData({name: branchName});
                initBasicData();
                SMNotification('success', addActionMessage('success', 'Branch'));
            }else {
                SMNotification('error', addActionMessage('missing', 'Branch'));
            }
        } catch(error) {
            closingModal();
            SMNotification('error', addActionMessage('error', 'Branch'));
        }
    };

    const handleAdd = () => {
        setLoading(true);
        resetBranchName();
        analyzeAndAddBranch();
    };

    const analyzeAndUpdateBranch = async (data) => {
        try {
            await updateBranchData(data, editedItem.guid);
            initBasicData();
            closingModal();
            SMNotification('success', updateActionMessage('success', 'Branch'));
        } catch(error) {
            SMNotification('error', updateActionMessage('error', 'Branch'));
            closingModal();
        }
    };

    const handleSave = (currentValues) => {
        if (isEdited) {
            if (currentValues && !(initialBranchName === currentValues.branchName)) {
                analyzeAndUpdateBranch({name: currentValues.branchName});
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
        setInitialBranchName(record.name);
        setIsEdited(true);
        openModal();
    };

    const deleteItems = async(items) => {
        for(const selectedEl of items) {
            try {
                await deleteBranchData(selectedEl);
                SMNotification('success', deleteActionMessage('success', 'Branch'));
            } catch(error) {
                SMNotification('error', `${deleteActionMessage('error', 'Branch')} with ${selectedEl} guid`);
            }
        }
        initBasicData();
    }

    const handleDelete = async (record) => {
        deleteItems([record.guid])
    };

    const handleSomeDelete = async (selectedRowKeys) => {
        const selectedItemsGuids = [];
        branches.filter((el) => {
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
            branches.filter((branchItem) => {
                if (branchItem.name.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(branchItem) === -1) {
                    filtredData.push(branchItem);
                }
                branchItem.users.filter(user => {
                    const name = `${user.fname} ${user.lname}`
                    if(name.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(branchItem) === -1) {
                        filtredData.push(branchItem);
                    }
                });
            });
            collectBranchesData(filtredData)
        })()
    }

    return (
        <div className='sm-content-skill-style'>
            {branchesDataSource &&
                <CriteriaTable
                    title={'Branches'}
                    dataSource={branchesDataSource}
                    column={getDataSource(branchesDataSource,
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
                            name: 'branchName',
                            type: 'text',
                            placeholder: 'Branch name',
                            rules: branchNameRule,
                            initialvalue: isEdited ? initialBranchName : '',
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
            </SMModal>
        </div>
    );
}

export {Branches};
