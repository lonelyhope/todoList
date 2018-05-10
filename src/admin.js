import React from 'react'
import ReactDOM from 'react-dom'

import {bindThis} from './method'

// 为note添加一个tag
export class AddTag extends React.Component {
  constructor(props) {
    super(props)
    this.tag = React.createRef()
    bindThis.call(this, [this.addtag])
  }
  addtag(e) {
    this.props.addTag(this.tag.current.value)
    this.tag.current.value = ''
    e.preventDefault()
  }
  render() {
    return (
      <div>
        <input type="text" ref={this.tag} />
        <button onClick={this.addtag}>add tag</button>
      </div>
    );
  }
}

// 添加一个note
export class AddNote extends React.Component {
  constructor(props) {
    super(props)
    this.tag = []
    this.content = React.createRef()
    bindThis.call(this, [this.add, this.addTag])
  }
  addTag(tag) {
    this.tag.push(tag)
  }
  add() {
    let note = {
      date: (new Date()),
      content: this.content.current.value,
      // tags: this.tag
      // 这样做会造成所有新加的note的tag都引用同一个值，如果删掉“this.tag=[]" 引用对象赋值要慎重
      tags: this.tag.slice(),
      id: this.props.note.id
    }
    this.props.addNote(note)
    this.tag = []
  }
  render() {
    // css
    let addNoteStyle = {
      zIndex: 1000,
      border: "solid",
      borderWidth: 2
    }

    let content = (this.props.note) ? this.props.note.content : null
    this.tag = this.props.note ? this.props.note.tags.slice() : []
    return this.props.show && (
      <div className="AddNote">
        <h2>ADD NOTE</h2>
        <textarea
          defaultValue={content}
          ref={this.content}
          name="content"
          rows="7" cols="40" />
        <div onClick={() => {this.props.changeModel(1)}}>
          <button onClick={this.add}>save</button>
          <button>cancel</button>
        </div>
        <AddTag addTag={this.addTag} />
      </div>
    )
  }
}
