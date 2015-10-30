import React from 'react'
import Reflux from 'reflux'
import {Modal,ProgressBar} from 'react-bootstrap'
import {CycleChild} from '.'
import a from '../actions'

var LoadingLoansModal = React.createClass({
    mixins: [Reflux.ListenerMixin],
    getInitialState:function(){
        return {progress_label: 'Please Wait', show: this.props.show, error_message: ''}
    },
    componentDidMount: function() {
        window.rga.modalview('/loading');
        this.listenTo(a.loans.load.progressed, progress => {
            var new_state = {show: !kivaloans.hasLoans()}
            if (progress.done) new_state[`${progress.task}_progress`] = (progress.done * 100) / progress.total * (progress.task == 'ids'? .33 : .67)
            if (progress.label) new_state.progress_label = progress.label
            if (progress.complete) new_state.show = false
            this.setState(new_state)
        })
        this.listenTo(a.loans.load.completed, ()=>{this.setState({show: false})})
        this.listenTo(a.loans.load.failed, (status)=>{
            this.setState({progress_label: 'Download Failed! Error Message from Kiva:', error_message: status })
        })
    },
    render() {
        return (
            <div className="static-modal">
                <Modal show={this.state.show} onHide={()=>{}}>
                    <Modal.Header>
                        <Modal.Title>Loading Fundraising Loans from Kiva.org</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <ProgressBar>
                            <ProgressBar bsStyle="info" active={this.state.ids_progress < 32} label={this.state.ids_progress > 10 ? 'basics': ''} now={this.state.ids_progress} />
                            <ProgressBar active label={this.state.details_progress > 10 ? 'details': ''} now={this.state.details_progress} />
                        </ProgressBar>
                        <CycleChild name='didYouKnow_loading'>
                            <p>To greatly reduce load time, check out the "Options" tab to always exclude certain types of loans from the initial load.</p>
                            <p>Did you know that KivaLens now works on smart-phones and tablets (iPad, Kindle, etc), too&#63;</p>
                            <p>Do you know any software developers&#63; KivaLens is open-source and will accept quality contributions (check out the About page for more information)</p>
                            <p>You can hide loans you've already loaned to by adding your Lender ID in the Options tab, then checking the Criteria Portfolio option to hide them.&#63;</p>
                            <p>Use the "Saved Search" button when you have your search exactly like you want it, give it a name and be able to return to it whenever you want.</p>
                            <p>There's also a "Kiva Lender Assistant" Chrome Browser plugin that will talk to you and show graphs and final repayment information on the Lend Tab. See the About page for more information.</p>
                            <p>You can click anywhere in one of the drop-down boxes to bring up the selection (you don't need to click the little arrow) or just start typing.</p>
                            <p>Kiva's site does not allow you to search by "Tags" but they are a great way to search! You can look for Interesting Photos, Inspiring Stories, Repeat Borrowers and many more!</p>
                            <p>Did you know that the "Posted" and "Expires" Dates on the Loan Detail have already been adjusted to your timezone&#63;</p>
                        </CycleChild>
                    </Modal.Body>

                    <Modal.Footer>
                        {this.state.progress_label}<br/>
                        {this.state.error_message}
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
})

export default LoadingLoansModal