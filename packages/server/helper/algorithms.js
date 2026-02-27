const getValuesByField = (obj, fields) => fields.map((field) => obj[field].value);

const equation = (x, y) => {
    if (x.length !== y.length) throw Error('Params sizes not Equals');

    return Math.sqrt(x.reduce((current, next, index) => current + ((x.length - index) * Math.abs(x[index] - y[index])), 0));
};

const calculateSimCars = (cases, search, fields) => {
    const searchValues = getValuesByField(search, fields);

    const result = cases.map((oneCase) => {
        const caseValues = getValuesByField(oneCase, fields);

        return {
            ...oneCase,
            'weight': equation(caseValues, searchValues)
        };
    });

    return result.slice(0, 9).sort((a, b) => a.weight + b.weight);
};

module.exports = { calculateSimCars };