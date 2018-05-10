import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import {AddTag, AddNote} from './admin.js'
import {bindThis, findId} from './method'
import {DeleteBtn, Tags, Note, Notes} from './shownote'

function Title(props) {
  return (<h1>todo lists</h1>);
}

class Notebook extends React.Component {
  constructor(props) {
    super(props)
    this.id = 0
    this.editIndex = null
    this.state = {
      noteLists: [],
      tags: [],
      // 被选中的tag的下标
      selectedTags: [],
      // model 控制显示模式，model == 1:show note, model == 2:delete note, model == 3:add note
      model: 1,
    }
    bindThis.call(this, [this.addNote, this.addGlobalTag, this.selectTag, this.filterNotes, this.changeModel, this.edit])
    bindThis.call(this, [this.deleteNotes])
  }
  render() {
    return (
      <div>
        <Title />
        <div>
          <button onClick={() => {this.changeModel(3)}}>ADD</button>
        </div>
        <div>
          {/* 不是创建新实例，而是沿用原来的实例？ */}
          <Tags 
            tags={this.state.tags}
            selectTag={this.selectTag} 
            selectedTags={this.state.selectedTags}/>
          <Notes
            edit={this.edit}
            notes={this.filterNotes()}
            model={this.state.model}
            changeModel={this.changeModel}
            deleteNotes={this.deleteNotes} />
        </div>
        <div>
          <AddNote
          note={this.editIndex != null && this.state.noteLists[this.editIndex]}
          addNote={this.addNote}
          changeModel={this.changeModel}
          show={this.state.model == 3}/>
        </div>
        <div className={this.state.model == 3 ? "shader" : ""}></div>
      </div>
    );
  }
  // notes 发出修改请求，计算需要被修改的note的下标，进入修改模式
  edit(id) {
    let noteLists = this.state.noteLists
    for (let i = 0; i < noteLists.length; i++) {
      if (noteLists[i].id == id) {
        this.editIndex = i
        break
      }
    }
    this.setState({
      model: 3
    })
  }
  // 删除notes，传入参数为待删除note的id组成的数组
  deleteNotes(lists) {
    let noteLists = this.state.noteLists
    lists.forEach(list_id => {
      console.log(list_id)
      for(let i = 0; i < noteLists.length; i++) {
        if (list_id == noteLists[i].id) {
          noteLists.splice(i, 1)
          break
        }
      }
    })
    this.setState({
      noteLists: noteLists
    })
  }
  changeModel(model) {
    this.setState({
      model: model
    })
  }
  // 遍历新添加的note中是否有新的tag，添加新的tag
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
    let noteLists = this.state.noteLists.slice()
    if (this.editIndex != null) {
      noteLists[this.editIndex] = note
    } else {
      this.id++
      note.id = this.id
      noteLists.push(note)
    }
    this.setState({
      noteLists: noteLists
    })
    this.addGlobalTag(note.tags)
    this.editIndex = null
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


// ----------------------------------
ReactDOM.render(
  <Notebook />,
  document.getElementById('app')
)
 