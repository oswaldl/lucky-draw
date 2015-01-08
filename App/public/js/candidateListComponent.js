/** @jsx React.DOM */
(function($, document, machine) {

    var CandidateList = React.createClass({
                                              render: function() {
                                                  var onDelete = this.props.onDelete;
                                                  var createItem = function(itemText) {
                                                      return <li id={itemText}>{itemText}
                                                          <span className="delete" title="Delete" onClick={onDelete.bind(this,
                                                                                                                         itemText)}>
                                                              <i className="fa fa-minus-circle"></i>
                                                          </span>
                                                      </li>
                                                  };
                                                  return <ul className="item-list">{this.props.items.map(createItem)}</ul>;
                                              }
                                          });

    var InputForm = React.createClass({
                                          getInitialState: function() {
                                              return {items: []};
                                          },
                                          componentDidMount: function() {
                                              var dom = this.refs.candidateInput.getDOMNode();
                                              dom.setAttribute("x-webkit-speech", "");

                                              var reactCpn = this;
                                              machine.registerCandidatesUpdateHandler(function(candidates) {
                                                  reactCpn.setState({items: candidates});
                                              });
                                              machine.registerUpdateIsWithoutReplacementHandler(function(isWithoutReplacement) {
                                                  reactCpn.setState({isWithoutReplacement: isWithoutReplacement});
                                              });

                                          },
                                          handleAdd: function(e) {
                                              e.preventDefault();
                                              var val = this.refs.candidateInput.getDOMNode().value.trim();
                                              this.refs.candidateInput.getDOMNode().value = "";
                                              machine.addCandidate(val);
                                          },
                                          handleReset: function(e) {
                                              e.preventDefault();
                                              machine.resetCandidate();
                                          },
                                          handleDelete: function(val) {
                                              machine.removeCandidate(val);
                                          },
                                          handleDeleteAll: function(e) {
                                              machine.clearCandidates();
                                          },
                                          handleInputDone: function(e) {
                                              $('.main-container').removeClass('show animated fadeOutUp');
                                              $('.main-container').addClass('hide');
                                              $('#start-view-container').addClass('show animated fadeInDown');
                                          },
                                          setWithoutReplacement: function() {
                                              machine.setWithoutReplacement($('#rand-without-replacement').is(':checked'));
                                          },
                                          render: function() {
                                              return (
                                                  <div>
                                                      <h1>Edit Items</h1>
                                                      <form id="edit-item-form" onSubmit={this.handleAdd}>
                                                          <input type="text" placeholder="Enter item name" id="new-candidate" ref="candidateInput"/>
                                                          <button className="btn positive-btn" title="Add" onClick={this.handleAdd}>
                                                              <i className="fa fa-plus"></i>
                                                          </button>
                                                          <div className="item-list-container">
                                                              <h2>Items List</h2>
                                                              <CandidateList items={this.state.items} onDelete={this.handleDelete}/>
                                                              <div className="text-right float-right">
                                                                  <a className="delete-all" onClick={this.handleDeleteAll}>
                                                                      <i className="fa fa-times"></i>
                                                                  Delete All</a>
                                                              </div>
                                                              <label for="rand-without-replacement" className="text-left">
                                                                  <input checked={this.state.isWithoutReplacement} onClick={this.setWithoutReplacement} type="checkbox" id="rand-without-replacement" name="without-replacement" />
                                                                  Draw without replacement
                                                              </label>
                                                          </div>
                                                          <div className="btn-set">
                                                              <button className="btn primary-btn btn-done" onClick={this.handleInputDone}>Done</button>
                                                              <button className="btn primary-btn btn-done" onClick={this.handleReset}>Reload Default</button>
                                                          </div>
                                                      </form>
                                                  </div>
                                                  );
                                          }
                                      });

    React.renderComponent(
        <InputForm />, document.getElementById('edit-item-container')
    );
})(jQuery, document, window.machine);
