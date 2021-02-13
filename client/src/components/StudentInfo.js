import React, { Component } from 'react';
import axios from 'axios';

// import images
import E1 from '../imgs/1.jpg';
import L2 from '../imgs/2.jpg';
import P3 from '../imgs/3.jpg';
import DeleteModal from './other/DeleteModal';

export default class StudentInfo extends Component {
  constructor() {
    super();
    this.state = {
      student_info: {},
      grades: [],
      errorMsg: '',
      delModalShow: false,
      accessAllowed: false,
      firstMount: true
    }
  }

  componentDidMount() {
    // if our state is not empty we allow access, if it is we deny access to page
    if (this.props.history.location.state !== undefined) {
      axios.all([
        axios.get('/student/getstudent/' + this.props.history.location.state),
        axios.get('/grade/getgrades/' + this.props.history.location.state)
      ])
        .then(axios.spread((res1, res2) => {
          this.setState({
            student_info: res1.data, 
            grades: res2.data,
            accessAllowed: true, 
            firstMount: false
          })
        }))
        .catch(err => { 
          console.log('error:', err.response.data.msg)
          this.setState({ errorMsg: err.response.data.msg }) });
    }
  }

  // go back to student directory page
  backBtnClicked = () => {
    // this.props.history.location.state = student id
    this.props.history.push('/student-directory', this.props.history.location.state);
  }

  updateBtnClicked = () => {
    const student_info = {
      student_info: this.state.student_info,
      grades: this.state.grades
    }
    this.props.history.push('/student-update', student_info);
  }

  deleteBtnClicked = () => this.setState({delModalShow: true})
  onModalHide = () => this.setState({delModalShow: false})

  render() {    
    // object destructuring - for easy use
    //const {student_info} = this.state;
        
    // if we are allowed access to page and the page is not on the first stage of mounting, display student info
    if (this.state.accessAllowed && !this.state.firstMount) {
      const {student_info, grades, delModalShow} = this.state;

      // render schedule table
      const renderSchedule = student_info.sub_sched_lst.map (sched => (
        <tr key={sched._id}>
          <td>{sched.time.from} - {sched.time.to}</td>
          <td>{sched.subject_id.subject_name}</td>
          <td>{sched.day}</td>
          <td>{sched.subject_id.instructor_id.instructor_name}</td>
        </tr>
      ))

      // render grades table
      const renderGrades = grades.map (grade => (
        <tr key={grade._id}>
          <td>{grade.subject_id.subject_name}</td>
          <td>{grade.prelim}</td>
          <td>{grade.midterm}</td>
          <td>{grade.final}</td>
        </tr>
      ))

      return (
        <div className='student-info'>
          <div className='to-left'>
            <button className='back-btn link-style-btn' onClick={this.backBtnClicked}>
              <ion-icon name="arrow-back-outline"></ion-icon>
            </button>
          </div>

          <div className='sc'>
            <button className='link-style-btn' onClick={this.updateBtnClicked}>Update</button>
            <button className='link-style-btn' onClick={this.deleteBtnClicked}>Delete</button> <br/>
          </div>
          
          {
            student_info.lastname.charAt(0).concat(student_info.student_id) === 'E1' ? <img className='w-img' src={E1} alt="empanso"/>
            : student_info.lastname.charAt(0).concat(student_info.student_id) === 'L2' ? <img className='w-img' src={L2} alt="lore"/>
            : student_info.lastname.charAt(0).concat(student_info.student_id) === 'P3' ? <img className='w-img' src={P3} alt="perez"/>
            : <h4 className='no-img'>No Image</h4>
          }

          <div className='student-stuff'>
            <p className='bord'>Student ID Number: {student_info.student_id}</p> <br />
            <p className='bord'>Name: {student_info.firstname} {student_info.middlename} {student_info.lastname}</p><br />
            <p className='bord'>Date of Birth: {student_info.dob.toString().substring(0, 10)}</p><br />
            <p className='bord'>Age: {student_info.age}</p><br />
            <p className='bord'>Address: {student_info.address}</p><br />
            <p className='bord'>Contact Number: {student_info.contact}</p><br />
            <p className='bord'>Course: {student_info.course}</p><br />
            <p className='bord'>Year and Section: {student_info.yearsection}</p><br />
          </div>

          <div className='studtab-secs'>
            <p>SCHEDULE</p>
            <table className='center'>
              <tbody>
                <tr>
                  <th>TIME</th>
                  <th>SUBJECT</th>
                  <th>DAY</th>
                  <th>INSTRUCTOR</th>
                </tr>
                {renderSchedule}
              </tbody>
            </table>
            <button type='button' className='print-btn'>
              <ion-icon class='print-icon' name="print-outline"></ion-icon>
              Print
            </button>

            {
              this.state.grades.length === 0 ?
              <div>
                <p>No Grades to display yet.</p>
              </div>
              : 
              <div className='grades-sec'>
                <p>GRADES</p>
                <table className='center'>
                  <tbody>
                    <tr>
                      <th>SUBJECTS</th>
                      <th>PRELIM</th>
                      <th>MIDTERM</th>
                      <th>FINAL</th>
                    </tr>
                    {renderGrades}
                  </tbody>
                </table>              
              </div>
            }
            <button type='button' className='transcript-btn'>Transcripts</button>
            <button type='button' className='print-btn'>
              <ion-icon class='print-icon' name="print-outline"></ion-icon>
              Print
            </button>          
          </div>
          
          <DeleteModal 
            show={delModalShow}
            onHide={this.onModalHide}
            student_id={student_info._id}
          />
        </div>
      )
    } else if (this.state.firstMount) {
      return (<div><p>Loading...</p></div>)
    } else if (!this.state.accessAllowed) {
      // display error message if access not allowed or it's not first mount
      return (
        <div>
          <h1>Sorry, you have no access to this page</h1>
        </div>
      )
    }
  }
}
