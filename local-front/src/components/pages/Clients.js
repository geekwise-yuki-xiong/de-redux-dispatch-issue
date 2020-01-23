import React, { Component } from "react";
import Modal from "../layout/ModalClient";
import axios from "axios";

class Client extends Component {
  constructor(props) {
    super(props);
    this.state = {

      activeClient: {
                    client_name: "",
                    client_email: "",
                    connect_to_branch: ""
      },
      clients: [],
      branch_id: [],
      branchName: '',
      dataReady: false
    };
  }

  componentDidMount() {
    axios
      .get("https://bank-backend-deidra.herokuapp.com/client/")
      .then(res => {
        this.setState({ clients: res.data });
        this.setState({ dataReady: true });
      })
      .catch(err => console.log(err));
    axios
      .get("https://bank-backend-deidra.herokuapp.com/branch/")
      .then(res => this.setState({ branch_id: res.data }))
      .catch(err => console.log(err));
  }

  handleSubmit() {
    axios
      .post("https://bank-backend-deidra.herokuapp.com/client/")
      .then(res => this.componentDidMount());
  }

  handleDelete(client) {
    axios
      .delete(`https://bank-backend-deidra.herokuapp.com/client/${client.id}/`)
      .then(res => this.componentDidMount());
  }

  // getBranchName(url){
  //   console.log(url)
  //   axios.get(url)
  //   .then(res => this.setState({branchName: res.data}))
  //   console.log(this.state.branchName)
  //   return (<div>test</div>)
  // }

  putBranchName(branchURL) {
    const branchID = branchURL[branchURL.length-2];
    // console.log(branchURL[branchURL.length-2], branchURL);
    for(let i=0; i<this.state.branch_id.length; i++) {
      if(parseInt(branchID) == this.state.branch_id[i].id) {
        return(this.state.branch_id[i].branch_name);
      }
      // console.log(this.state.branch_id[i].id);
    }
    // console.log(this.state.branch_id);
  }

  renderClients() {
    let newClient = [];
    newClient = this.state.clients;
    // this.getBranchName(this.state.activeClient.connect_to_branch)

    return newClient.map(client => (
      
      <div key={client.id} className="li-div row">
    
        <li key={client.id}  className="li-render col-8">
         Name: {client.client_name} <br/>
         Email: {client.client_email} <br/>
         Branch: {this.putBranchName(client.connect_to_branch)}
        </li>

        <div className="col-lg-3 col-md-4 offset-md-1 col-sm-2">
          <button 
              onClick={() => this.editClient(client)} className="btn btn-secondary mr-2">
              Edit{" "}
          </button>

          <button
              onClick={() => this.handleDelete(client)} className="btn btn-danger">
              Delete{" "}
          </button>
        </div>

      </div>
    ));
  }

  onSave(client) {
    axios
      .post("https://bank-backend-deidra.herokuapp.com/client/", client)
      .then(res => this.componentDidMount());
  }

  handleChange = e => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    const activeClient = { ...this.state.activeClient, [name]: value };
    this.setState({ activeClient });
  };

  createClient = () => {
    const client = { title: "", description: ""};
    this.setState({ activeClient: client, modal: !this.state.modal });
  };

  editClient = client => {
    this.setState({ activeClient: client, modal: !this.state.modal });
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = client => {
    console.log("branchessssss"+Object.keys(client))
    this.toggle();
    if (client.id) {
      axios
        .put(
          `https://bank-backend-deidra.herokuapp.com/client/${client.id}/`,
          client
        )
        .then(res => this.componentDidMount());
      return;
    }
      axios
        .post("https://bank-backend-deidra.herokuapp.com/client/", client)
        .then(res => this.componentDidMount());
  };

  render() {
    return (
      <div className="branch-box-style offset-2 col-8 col-sm-6 offset-sm-3 justify-content-center">
          {/* {this.renderClients()} */}
        <button onClick={this.createClient} className="btn btn-dark btn-lg col-4">
          + New Client
        </button>

        <ul>{this.renderClients()}</ul>
        
        {this.state.modal ? (
          <Modal
            branch_id={this.state.branch_id}
            activeClient={this.state.activeClient}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}

      </div>
    );
  }
}
export default Client;
