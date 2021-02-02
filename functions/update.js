const { v4: uuidv4 } = require('uuid');
const { Octokit } = require("@octokit/rest");

/* export our lambda function as named "handler" export */
exports.handler = async function(event, context) {

  let todo = JSON.parse( event.body )
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  let {data} = await octokit.repos.getContent({
    owner: 'sotoplatero',
    repo: 'db',
    path: 'todos.json',
  });

  let todosString = Buffer.from( data.content, 'base64' ).toString( 'utf8' ) 
  todos = JSON.parse( todosString );

  todoIndex = todos.findIndex( el => el.id === todo.id );
  console.log(todo)
  todos.splice( todoIndex, 1, todo)

  var fileContent = Buffer.from( JSON.stringify( todos ), 'utf8' ).toString('base64') 

  await octokit.repos.createOrUpdateFileContents({
      owner: 'sotoplatero',
      repo: 'db',
      path: 'todos.json',
      message: '+',
      sha: data.sha,
      content: fileContent,
    })

  return {
    statusCode: 200,
    body: JSON.stringify(todos)
  }     

}
