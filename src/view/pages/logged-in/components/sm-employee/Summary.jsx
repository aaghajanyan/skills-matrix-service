import React from 'react'
import { SMChart } from '../SMChart'
import { SkillsList } from '../SkillsList';

function Summary(props) {

    const chartData = [
        {
            name: 'Front End', javaScript: 5, React: 5, Angular: 4, HTML: 4,
        },
        {
            name: 'Back End', NodeJS: 4, Django: 5, js: 4, Express: 3
        },
        {
            name: 'Native', iOSNative: 4, AndroidNative: 5,
        },
    ];
    const chartKeys = ['javaScript', 'NodeJS', 'React', 'Css', 'Angular JS', 'HTML', 'Django', 'Express', 'iOSNative', 'AndroidNative']

    const topSkills = [
        {
            icon: 'java',
            skill: 'Java',
            mark: 5,
        },
        {
            icon: 'js',
            skill: 'JavaScript',
            mark: 5,
        },
        {
            icon: 'react',
            skill: 'React',
            mark: 5,
        },
        {
            icon: 'node',
            skill: 'Node JS',
            mark: 5,
        },
        {
            icon: 'angular',
            skill: 'Angular JS',
            mark: 4,
        },
        {
            icon: 'html5',
            skill: 'HTML',
            mark: 4,
        },
    ]

    const needToImprove = [
        {
            icon: 'git-alt',
            skill: 'Git',
            mark: 2,
        },
        {
            icon: 'wordpress',
            skill: 'Wordpress',
            mark: 2,
        },
        {
            icon: 'swift',
            skill: 'Swift',
            mark: 5,
        },
        {
            icon: 'android',
            skill: 'Android',
            mark: 3,
        },
        {
            icon: 'python',
            skill: 'python',
            mark: 3,
        },
        {
            icon: 'sass',
            skill: 'Sass',
            mark: 3,
        },
    ]

    const topInterests = [
        {
            icon: 'android',
            skill: 'Android',
            mark: 5,
        },
        {
            icon: 'angular',
            skill: 'Angular JS',
            mark: 5,
        },
        {
            icon: 'css3',
            skill: 'CSS',
            mark: 5,
        },
        {
            icon: 'python',
            skill: 'Python',
            mark: 5,
        },
        {
            icon: 'swift',
            skill: 'Swift',
            mark: 5,
        },
        {
            icon: 'react',
            skill: 'React JS',
            mark: 5,
        },
    ]

    const peopleWithSimilarSkills = [
        {
            firstName: 'Tester',
            lastName: 'Tester',
        },
        {
            firstName: 'Tester',
            lastName: 'Tester',
        },
        {
            firstName: 'Tester',
            lastName: 'Tester',
        },
        {
            firstName: 'Tester',
            lastName: 'Tester',
        },
        {
            firstName: 'Tester',
            lastName: 'Tester',
        },
        {
            firstName: 'Tester',
            lastName: 'Tester',
        },
    ]

    return (
        <React.Fragment>
            <SMChart className='sm-component' data={chartData} width={800} height={200} keys={chartKeys}></SMChart>
            <div className='sm-tabs_component-container' >
                <SkillsList className='sm-component' title='Top Skills' data={topSkills} />
                <SkillsList className='sm-component' title='Need To Improve' data={needToImprove} />
                <SkillsList className='sm-component' title='Top Interests' data={topInterests} />
                <SkillsList className='sm-component' title='People With Similar Skills' data={peopleWithSimilarSkills} isUsers={true} />
            </div>
        </React.Fragment>
    )
}

export { Summary }