var Midi = {
  onPositionUpdate: () => { },
  midi: {}, // time -> midi message map
  pos: 0
};

WebMidi.enable(function (e) {

  if (e) {
    console.log(e);
    return;
  }

  const input = WebMidi.inputs[0];
  const output = WebMidi.outputs[0];
  const output_channel = 1;

  input.addListener('clock', undefined, function (e) {
    try {
      const messages = Midi.midi[Midi.pos];
      _(messages).each(function (message) {
        if (message.on) {
          output.playNote(message.note, output_channel, { velocity: message.attack });
        } else {
          output.stopNote(message.note, output_channel, { velocity: message.release });
        }
      });
    } catch (ex) {
      console.log(`Failed sending MIDI message with exception: ${ex}`);
    }
    Midi.onPositionUpdate(Midi.pos);
    Midi.pos++;
  });

  input.addListener('songposition', undefined, function (e) {
    var v = data[0] | (data[1] << 8);
    Midi.onPositionUpdate(v);
    Midi.pos = v;
  });

  input.addListener('stop', undefined, function (e) {
    Midi.onPositionUpdate(0);
    Midi.pos = 0;
  });

});

export class Val {
  constructor(val, negative = false) {
    this.val = val;
    this.negative = nevative;
  }
}

var CommentBox = React.createClass({
  handleCommentSubmit: function (comment) {
    var comments = this.state.data;
    this.setState({ data: comments.concat(comment) });
  },
  getInitialState: function () {
    return {
      data: [
        { id: 1, author: "Pete Hxxxunt", text: "This is one comment" },
        { id: 2, author: "Jordan Walke", text: "This is *another* comment" }
      ]
    };
  },
  render: function () {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function () {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function () {
    return { author: '', text: '' };
  },
  handleAuthorChange: function (e) {
    this.setState({ author: e.target.value });
  },
  handleTextChange: function (e) {
    this.setState({ text: e.target.value });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({ author: author, text: text });
    this.setState({ author: '', text: '' });
  },
  render: function () {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
          />
        <input
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
          />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Comment = React.createClass({
  render: function () {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    );
  }
});

class Position extends React.Component {
  constructor() {
    super();
    this.state = {
      index: 0
    };
  }
  render() {
    return <span className="label label-default">{this.state.index}</span>;
  }
}

class Matrix extends React.Component {
  render() {
    return <div>Hello, Matrix</div>;
  }
}

ReactDOM.render(
  <div id="content">
    <Position ref={positionComponent => Midi.onPositionUpdate = positionIndex => { positionComponent.setState({ index: positionIndex }); } }/>
    <Matrix />
  </div>,
  document.getElementById('ƒ')
);