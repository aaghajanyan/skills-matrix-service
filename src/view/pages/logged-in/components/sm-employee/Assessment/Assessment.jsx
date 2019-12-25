import React from 'react';
import { Categories } from "./Categories";
import { CategorySkills } from './CategorySkills';

function Assessment() {
    return (
        <React.Fragment>
            <Categories className='sm-table sm-component'></Categories>
            <CategorySkills className='sm-table sm-component'></CategorySkills>
        </React.Fragment>
    );
}

export { Assessment };