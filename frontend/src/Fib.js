import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: ''
    };

    //From redis - fetch all fib values.
    async fetchValues(){
        const values = await axios.get('/api/values/current');
        this.setState({values: values.data});
    }

    //fetch all seen in indexes from Postgres.
    async fetchIndexes(){
        const seenIndexes = await axios.get('/api/values/all');
        this.setState({seenIndexes: seenIndexes.data});
    }

    componentDidMount(){
        this.fetchValues();
        this.fetchIndexes();
    }

    
};