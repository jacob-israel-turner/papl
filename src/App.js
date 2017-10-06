import React, { Component } from 'react';
import AceEditor from 'react-ace';
import autoBind from 'react-autobind';

import 'brace/mode/javascript';
import 'brace/snippets/javascript';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';

class App extends Component {
  constructor() {
    super();
    autoBind(this);
    this.state = {
      code: ''
    }
  }

  onChange(e) {
    this.setState({ code: e });
  }

  run() {
    console.log(this.state.code);
  }

  render() {
    return (
      <div>
        <AceEditor
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          height='100vh'
          width='100vw'
          mode="javascript"
          theme="monokai"
          name="blah2"
          onChange={this.onChange}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={this.state.code}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
        <button style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 100
        }} onClick={this.run}>RUN</button>
      </div>
    )
  }
}

export default App;
