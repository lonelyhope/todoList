import React from 'react'
import ReactDOM from 'react-dom'

import {bindThis} from './method'

export class DeleteBtn extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let model = this.props.model
    let changeModel = this.props.changeModel
    let deleteModelHtml = (
      <span onClick={() => {changeModel(1)}}>
        <button onClick={() => {this.props.del()}}>save</button>
        <button onClick={() => {changeModel(1)}}>cancel</button>
      </span>
    )
    let showModelHtml = <button onClick={() => {changeModel(2)}}>DELETE</button>
    return (
      <div className="DeleteBtn">
        {model == 2 ? deleteModelHtml : showModelHtml}
      </div>
    );
  }
}

export class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.handleTagClick = this.handleTagClick.bind(this)
  }
  handleTagClick(e) {
    console.log('click tag: ' + e.target.innerHTML)
    this.props.selectTag(e.target.innerHTML)
  }
  render() {
    let selectedTags = this.props.selectedTags
    return (
      <div className="Tags">
        <h2>tags</h2>
        <ul>
          {this.props.tags.map((tag, index) => {
            if (selectedTags.indexOf(tag) != -1) 
              return <li key={index} onClick={this.handleTagClick}
                className="selectedTag">{tag}</li>
            return <li key={index} onClick={this.handleTagClick} >{tag}</li>
          }
          )}
        </ul>
      </div>
    );
  }
}

export class Note extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let noteContent = this.props.noteContent
    return (
      <div className="Note">
        <button onClick={() => {this.props.edit(noteContent.id)}}>edit</button>
        {noteContent.date + ': ' + noteContent.content}
        <ul>
          {noteContent.tags.map((tag, index) => {
            return (<li key={index}>{tag}</li>)
          })}
        </ul>
      </div>
    );
  }
}

export class Notes extends React.Component {
  constructor(props) {
    super(props)
    // 用于搜集notes中选择删除的部分
    this.deleteNotes = []
    bindThis.call(this, [this.computeDeleteNotes])
  }
  // 收集需要被删除的notes
  computeDeleteNotes(index, e) {
    let del = e.target.checked
    let notes = this.props.notes
    let id = notes[index].id
    if(del) this.deleteNotes.push(id)
    else {
      let i = this.deleteNotes.indexOf(id)
      this.deleteNotes.splice(i, 1)
    }
  }
  render() {
    let model = this.props.model
    let changeModel = this.props.changeModel
    return (
      <div className="Notes">
        <h2>Notes</h2>
        <DeleteBtn model={model} changeModel={this.props.changeModel}
          del={() => {this.props.deleteNotes(this.deleteNotes)}}/>
        {
          Array.isArray(this.props.notes) ? (
            <div>
              {this.props.notes.map((note, index) => {
                return (
                  <div key={index}>
                    {model == 2 && <input type="checkbox" onClick={(e) => {this.computeDeleteNotes(index, e)}}/>}
                    <Note noteContent={note} edit={(id) => {this.props.edit(id)}}/>
                  </div>
                )
              })}
            </div>
          ) : 'no notes now'
        }
      </div>
    );
  }
}
