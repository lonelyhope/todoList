import React from 'react'
import ReactDOM from 'react-dom'

function Admin (props) {
  return (
    <div>
      <button>ADD</button>
      <button>DELETE</button>
    </div>
  );
}

class AddTag extends React.Component {
  constructor(props) {
    super(props)
    this.addtag = this.addtag.bind(this)
    this.tag = React.createRef()
  }
  addtag(e) {
    this.props.addTag(this.tag.current.value)
    // this.tag.current.value = ''
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

class AddNote extends React.Component {
  constructor(props) {
    super(props)
    this.tag = []
    this.content = React.createRef()

    this.add = this.add.bind(this)
    this.addTag = this.addTag.bind(this)
  }
  addTag(tag) {
    this.tag.push(tag)
    console.log('addTag: ' + tag)
    console.log(this.tag)
  }
  add() {
    let note = {
      date: (new Date()),
      content: this.content.current.value,
      // tags: this.tag
      // 这样做会造成所有新加的note的tag都引用同一个值，如果删掉“this.tag=[]" 引用对象赋值要慎重
      tags: this.tag.slice()
    }
    this.props.addNote(note)
    this.tag = []
  }
  render() {
    return (
      <div>
        <h2>ADD NOTE</h2>
        <textarea
          ref={this.content}
          name="content"
          rows="7"
          cols="20" />
        <div>
          <button onClick={this.add}>save</button>
          <button>cancel</button>
        </div>
        <AddTag addTag={this.addTag} />
      </div>
    );
  }
}

export default {
  AddTag: AddTag,
  Admin: Admin,
  AddNote: AddNote,
}