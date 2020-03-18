import React from 'react';
import {SMChart} from '../SMChart';
import {SkillsList} from '../SkillsList';
import {summary} from './data';

function Summary(props) {

    const topSkills = () => {
        if(!props.dashboard){
            return [];
        }
        const skills = props.dashboard.topSkilsSort.map( (skill) => {
            return ({
                icon: skill.icon,
                skill: skill.name,
                mark: skill.profficience.mark,
                profName: skill.profficience.name
            });
        });

        return (skills.slice(0, 5));
    };

    const needToImproveSkills = () => {
        if(!props.dashboard){
            return [];
        }
        const skills = props.dashboard.needToImproveSort.map( (skill) => {
            return ({
                icon: skill.icon,
                skill: skill.name,
                mark: skill.profficience.mark,
                profName: skill.profficience.name
            });
        });

        return (skills.slice(0, 5));
    };

    const similarUsers = () => {
        if(!props.dashboard){
            return [];
        }
        const users = props.dashboard.getSimilarUsers.map( (user) => {
            return ({
                firstName: user.fname,
                lastName: user.lname,
            });
        });

        return users;
    };

    const smCharbar = () => {
        if(!props.dashboard){
            return [];
        }

        const categories = [];

        props.dashboard.categoriesUsers.map(item => {
            categories.push({name: item.name});
        });

        props.dashboard.topSkilsSort.map( (skill, index) => {
            categories.map(cat => {
                if(cat.name === skill.categories){
                    Object.assign(cat, {[skill.name]: skill.profficience.mark})
                }
            });
        });

        props.dashboard.needToImproveSort.map( (skill, index) => {
            categories.map(cat => {
                if(cat.name === skill.categories){
                    Object.assign(cat, {[skill.name]: skill.profficience.mark})
                }
            })
        });

        return categories
    }

    const chartKeys = () => {
        if(!props.dashboard){
            return [];
        }

        const skills = props.dashboard.topSkilsSort.map( (skill, index) => {
            return skill.name;
        });

        props.dashboard.needToImproveSort.map( (skill, index) => {
            skills.push(skill.name)
        });

        return skills;
    }

    return (
        <React.Fragment>
            <SMChart className="sm-component" data={smCharbar()} width={800} height={200} keys={chartKeys()}/>
            <div className="sm-tabs_component-container" >
                <SkillsList className="sm-component" title="Top Skills" data={topSkills()} />
                <SkillsList className="sm-component" title="Need To Improve" data={needToImproveSkills()} />
                <SkillsList className="sm-component" title="Top Interests" data={summary.topInterests} />
                <SkillsList className="sm-component" title="People With Similar Skills" data={similarUsers()} isUsers={true} />
            </div>
        </React.Fragment>
    );
}

export {Summary};