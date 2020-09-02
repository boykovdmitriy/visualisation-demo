function randomDate(start, end) {
    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
}

function getRandomInt(max, min = 0) {
    return Math.floor(Math.random() * max - min);
}

export function generateFakeData(count) {
    const res = [];
    const currentDate = new Date();
    const startData = new Date();
    startData.setFullYear(startData.getFullYear() - 1);

    for (let i = 0; i < count; i++) {
        res.push({
            time: randomDate(startData, currentDate),
        });
    }
    const sortedValues = res.sort((a, b) => a.time - b.time);

    return sortedValues.reduce((acc, x) => {
        const lastValue = acc.length > 0 ? acc[acc.length - 1].value : 0;
        acc.push({
            ...x,
            value: Math.abs(lastValue + getRandomInt(15, 5)),
        });
        return acc;
    }, []);
}
