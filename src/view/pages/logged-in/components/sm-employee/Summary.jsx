import React from 'react'
import {SMChart} from '../SMChart'
import {SkillsList} from '../SkillsList';
import {summary} from './data'

function Summary(props) {

    return (
        <React.Fragment>
            <SMChart className='sm-component' data={summary.chartData} width={800} height={200} keys={summary.chartKeys}/>
            <div className='sm-tabs_component-container' >
                <SkillsList className='sm-component' title='Top Skills' data={summary.topSkills} />
                <SkillsList className='sm-component' title='Need To Improve' data={summary.needToImprove} />
                <SkillsList className='sm-component' title='Top Interests' data={summary.topInterests} />
                <SkillsList className='sm-component' title='People With Similar Skills' data={summary.peopleWithSimilarSkills} isUsers={true} />
            </div>
        </React.Fragment>
    )
}

export { Summary }