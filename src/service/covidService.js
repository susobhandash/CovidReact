import React from 'react';

const { createContext, useContext } = React;

const getData = () => {
    try {
        const url = 'https://api.covid19india.org/data.json';
        return fetch(url);
    } catch(err){
        console.error(err);
        return err;
    }
};

const getStateData = () => {
    try {
        const url = 'https://api.covid19india.org/state_district_wise.json';
        return fetch(url);
    } catch(err){
        console.error(err);
        return err;
    }
};

const covidServiceContext = createContext({
    getData: () => {
        return getData();
    },
    getStateData: () => {
        return getStateData();
    }
});

export const useService = () => {
    return useContext(covidServiceContext);
};
