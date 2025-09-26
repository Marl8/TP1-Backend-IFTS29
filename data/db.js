import fs from 'fs'; 
const DB = './data/data.json';

const findData = () => {
    const data = fs.readFileSync(DB, 'utf-8'); 
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(DB, JSON.stringify(data, null, 2)); 
};

export { findData, writeData };