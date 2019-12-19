import React from 'react';
import { Categories } from "./Categories";
import { CategorySkills } from './CategorySkills';

function Assessment() {
    return (
        <div className="home-content">
            <Categories className='skills-table'></Categories>
            <CategorySkills className='skills-table'></CategorySkills>
        </div>
    );
}

export { Assessment };
