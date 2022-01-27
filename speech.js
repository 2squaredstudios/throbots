module.exports = async function runScript(script, cb) {
for (var i = 0; i < script.length; i++) {
  if (script[i].type == 'text') {
    await writeText(script[i].script, script[i].delay, cb);
  }
  else if (script[i].type == 'wait') {
    await wait(script[i].delay);
  }
  else if (script[i].type == 'pause') {
    cb('clear');
    alert('Press OK to continue');
  }
  else if (script[i].type == 'prompt') {
    await writeText(script[i].script, script[i].delay, cb);
    for (var j = 0; j < script[i].responses.length; j++) {
      await writeText(j + ': ' + script[i].responses[j].response + '\n', script[i].delay, cb);
    }
    var response = parseInt(prompt('Enter a number'));
    await runScript(script[i].responses[response].result, cb);
  }
  else {
    console.log('wat iz ' + script[i].type);
    process.exit();
  }
}
}

function wait(delay) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, delay);
  });
}

async function writeText(text, delay, cb) {
  for (var i = 0; i < text.length; i++) {
    cb(text.charAt(i));
    await wait(delay);
  }
}
