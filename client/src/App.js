import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            groups: []
        };
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers = async () => {
        try {
            let res = await axios.get("/api/users");
            console.log(res);
            this.setState({ user: res.data[1].name, groups: res.data[1].groups });
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        const users = (
            <h1>
                {this.state.user} ||| {this.state.groups.map((g) => g.name)}
            </h1>
        );

        return <div className="App">{users}</div>;
    }
}

export default App;
