import React from 'react'
import ReactDOM from 'react-dom'
// import admin from './admin.js'

// let AddTag =  admin.AddTag
// let Admin = admin.Admin
// let AddNote = admin.addNote

function Title(props) {
  return (<h1>todo lists</h1>);
}

// ----------- admin -----------------------------------
class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.changeModel = this.changeModel.bind(this)
  }
  changeModel(model) {
    this.props.chengeModel(model)
  }
  render() {
    let deleteModel = this.props.deleteModel
    let deleteModelHtml = (
      <span onClick={() => {this.changeModel(false)}}>
        <button>save</button>
        <button>cancel</button>
      </span>
    )
    let showModelHtml = <button onClick={() => {this.changeModel(true)}}>DELETE</button>
    return (
      <div>
        <button onClick={() => {this.changeModel(true)}}>ADD</button>
        {deleteModel ? deleteModelHtml : showModelHtml}
      </div>
    );
  }
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

// ----------------- show ---------------------------------------


class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.handleTagClick = this.handleTagClick.bind(this)
  }
  handleTagClick(e) {
    console.log('click tag: ' + e.target.innerHTML)
    this.props.selectTag(e.target.innerHTML)
  }
  render() {
    return (
      <div>
        <h2>tags</h2>
        <ul>
          {
            this.props.tags.map((tag, index) => 
              <li
                key={index}
                onClick={this.handleTagClick} >
                {tag}
              </li>
            )
          }
        </ul>
      </div>
    );
  }
}



class Note extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let noteContent = this.props.noteContent
    return (
      <div>
      {
        noteContent.date + ': ' + noteContent.content + ' ' + (Array.isArray(noteContent.tags) ? noteContent.tags.join(',') : 'no tag')
      }
      </div>
    );
  }
}

class Notes extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <h2>Notes</h2>
        {
          Array.isArray(this.props.notes) ? (
            <div>
              {
                this.props.notes.map((note, index) => {
                  return (
                    <div key={index}>
                      {this.props.deleteModel && <input type="checkbox" />}
                      <Note noteContent={note} />
                    </div>
                  )
                })
              }
            </div>
          ) : 'no notes now'
        }
      </div>
    );
  }
}

class Notebook extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      noteLists: [
        {
          date: 'today',
          content: 'abc',
          tags: ['a', 'b'],
        }
      ],
      tags: [1, 'a', 'haha'],
      // 被选中的tag的下标
      selectedTags: [],
      deleteModel: false,
    }
    this.addNote = this.addNote.bind(this)
    this.addGlobalTag = this.addGlobalTag.bind(this)
    this.selectTag = this.selectTag.bind(this)
    this.filterNotes = this.filterNotes.bind(this)
    this.changeModel = this.changeModel.bind(this)
  }
  render() {
    console.log('render')
    console.log(this.state.noteLists)
    console.log(this.state.selectedTags)
    return (
      <div>
        <Title />
        <div>
          {/* 不是创建新实例，而是沿用原来的实例？ */}
          <Admin
            addNote={this.addNote}
            chengeModel={this.changeModel} />
          <Tags tags={this.state.tags} selectTag={this.selectTag}/>
          <Notes notes={this.filterNotes()} deleteModel={this.deleteModel} />
        </div>
        <div>
          <AddNote addNote={this.addNote} />
        </div>
      </div>
    );
  }
  changeModel(model) {
    this.setState({
      deleteModel: model
    })
  }
  // 添加新的tag
  addGlobalTag(noteTags) {
    console.log('noteTags')
    console.log(noteTags)
    let tags = this.state.tags.slice()
    noteTags.forEach(tag => {
      if (tags.indexOf(tag) == -1) {
        tags.push(tag)
        this.setState({
          tags: tags
        })
      }
    })
  }
  addNote(note) {
    console.log('addnote:')
    console.log(note)
    let noteLists = this.state.noteLists
    noteLists.push(note)
    this.setState({
      noteLists: noteLists
    })
    this.addGlobalTag(note.tags)
  }
  selectTag(selectTag) {
    let selectedTags = this.state.selectedTags.slice()
    let tagIndex = selectedTags.indexOf(selectTag)
    if (tagIndex == -1) selectedTags.push(selectTag)
    else {
      selectedTags.splice(tagIndex, 1)
    }
    this.setState({
      selectedTags: selectedTags
    })
    console.log('selectedTags:')
    console.log(selectedTags)
  }
  // 根据tag过滤notes
  filterNotes() {
    let noteLists = this.state.noteLists
    let selectedTags = this.state.selectedTags
    if(selectedTags.length === 0) return noteLists
    return noteLists.filter((note) => {
      let tags = note.tags
      return tags.some(tag => 
        selectedTags.indexOf(tag) != -1
      )
    })
  }
}



ReactDOM.render(
  <Notebook />,
  document.getElementById('app')
)
 