import React, { Component } from 'react';
import axios from 'axios';

//import students from '../data/students';

export default class UpdateStudent extends Component {
  constructor () {
    super();
    this.state = {
      _id: '',
      id: '',
      firstname: '',
      lastname: '',
      middlename: '',
      dob: '',
      address: '',
      contact_num: '',
      course: '',
      year_sec: '',
      age: 0,

      grades: [],
      schedule: [],
      prelim: [],
      midterm: [],
      final: [],

      updated: false,
      firstMount: true,
      avail_scheds: [],
      errorMsg: ''
    }
  }

  componentDidMount() {
    // if our state is not empty we allow access, if it is we deny access to page
    if (this.props.history.location.state !== undefined) {
      const {student_info, grades} = this.props.history.location.state;

      this.setState({
        _id: student_info._id,
        id: student_info.student_id,
        firstname: student_info.firstname,
        lastname: student_info.lastname,
        middlename: student_info.middlename,
        dob: Date.parse(student_info.dob),
        address: student_info.address,
        contact_num: student_info.contact,
        course: student_info.course,
        year_sec: student_info.yearsection,
        age: student_info.age,
        schedule: student_info.sub_sched_lst,
        grades: grades
      })
    }
  }

  componentDidUpdate () {
    if (this.state.firstMount) {
      axios.get('/subsched/allsubscheds')
        .then(res => {
          this.setState({avail_scheds: res.data, firstMount: false})
        })
        .catch(err => { 
          console.log('error:', err.response.data.msg)
          this.setState({ errorMsg: err.response.data.msg }) });
    }
  }

  // go back to student directory page
  backBtnClicked = () => {
    // this.props.history.location.state = student id
    this.props.history.push('/student-info', this.state._id);
  }

  handleInputChange = (event) => {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    })
  }

  updateStudent = (event) => {
    event.preventDefault();
    const {_id, student_id, firstname, lastname, middlename, dob, address, contact_num, course, year_sec, age, schedule} = this.state;

    const updateStudent = {
      student_id: student_id,
      firstname: firstname,
      lastname: lastname,
      middlename: middlename,
      dob: dob,
      address: address,
      contact: contact_num,
      course: course,
      yearsection: year_sec,
      age: age,
      sub_sched_lst: schedule
    }
    
    const reqURL = process.env.NODE_ENV === 'production' ? '/student/updatestudent/': 'http://localhost:5000/student/updatestudent/';
    axios.post(reqURL + _id, updateStudent)
      .then(res => {
        console.log('updated!');
        this.props.history.push('/student-info', _id);
      })
      .catch(err => { 
        console.log(err.response.data.msg)
        this.setState({ errorMsg: err.response.data.msg }) });
    
    this.setState({
      updated: true
    })
  }

  render() {
    if (this.state.firstMount) {
      return (<div><p>Loading...</p></div>)
    } else {
      //console.log(this.state.schedule)
      return (
        <div>
          <button className='back-btn link-style-btn' onClick={this.backBtnClicked}>Back</button>

          <form onSubmit={this.updateStudent}>
            <label>Student ID Number: </label>
            <input 
              type = "text" 
              name = "id" 
              value = {this.state.id}
              onChange = {this.handleInputChange}
              required
            /> <br />
            <label>First Name: </label>
            <input 
              type = "text" 
              name = "firstname" 
              value = {this.state.firstname}
              onChange = {this.handleInputChange}
              required
            /> <br />
            <label>Last Name: </label>
            <input 
              type = "text" 
              name = "lastname" 
              value = {this.state.lastname}
              onChange = {this.handleInputChange}
              required
            /> <br />
            <label>Middle Name: </label>
            <input 
              type = "text" 
              name = "middlename" 
              value = {this.state.middlename}
              onChange = {this.handleInputChange}
              required
            /> <br />
            <label>Age: </label>
            <input 
              type = "number" 
              name = "age" 
              value = {this.state.age}
              onChange = {this.handleInputChange}
              required
            /> <br />
            <label>Date of Birth: </label>
            <input 
              type = "Date" 
              name = "dob" 
              value = {this.state.dob}
              onChange = {this.handleInputChange}
              required
            /> <br />
            <label>Address: </label>
            <input 
              type = "text" 
              name = "address" 
              value = {this.state.address}
              onChange = {this.handleInputChange}
              required
            /> <br />
            <label>Contact Number: </label>
            <input 
              type = "text" 
              name = "contact_num" 
              value = {this.state.contact_num}
              onChange = {this.handleInputChange}
              required
            /> <br />
            <label>Course: </label>
            <input 
              type = "text" 
              name = "course" 
              value = {this.state.course}
              onChange = {this.handleInputChange}
              required
            /> <br />
            <label>Year & Section: </label>
            <input 
              type = "text" 
              name = "year_sec" 
              value = {this.state.year_sec}
              onChange = {this.handleInputChange}
              required
            /> <br />

            <label>Department: </label>
            <select name="departments">
              <option value="ICS">ICS</option>
            </select> <br />

            {/* renderUpdateGrades */}

            <button>Update {this.state.lastname}</button>
          </form>

          {this.state.updated ? <p>{this.state.firstname} successfully updated!</p> : null}
          {this.state.errorMsg !== '' ? <p>ERROR! {this.state.errorMsg}</p> : null}
        </div>
      )
    }
  }
}
