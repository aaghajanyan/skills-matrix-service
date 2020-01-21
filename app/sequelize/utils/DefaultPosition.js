class DefaultPosition {
    static async initializePositionTable(models) {
        const positionList = [
            'Beginner SW Engineer',
            'SW Engineer',
            'Senior SW Engineer',
            'Beginner QA Tester',
            'QA Tester',
            'SQE Analyst',
            'Sr. Software Quality Engineer',
            'QA Analyst',
            'QA lead',
            'Team lead',
            'Graphic designer',
            'technical manager',
            'Senior Team lead',
            'Project Manager',
            '3D modeler',
            'UIUX designer',
            'SW Architect',
        ];
        let defaultPositionObj = await positionList.map(position => {
            return {
                name: position,
            };
        });
        await models.position.bulkCreate(defaultPositionObj).catch(err => {});
    }
}

module.exports = DefaultPosition;
