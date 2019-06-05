const axios = require("axios")
const fs = require("fs")
const crypto = require("crypto");
var request = require('request');


async function getRetornaDadosApi(){
  return await axios.get('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=d165f7b9a60425fc2c18c850c3aca61453778365')
}

function enviaDadosApi() {
  const FormData = require('form-data');
  const fs = require('fs');
  const axios = require('axios');

  let form = new FormData();

  form.append('answer', fs.createReadStream('answer.json'), {
    filename: 'answer.json'
  });

  axios.create({
    headers: form.getHeaders()
  }).post('https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=d165f7b9a60425fc2c18c850c3aca61453778365', form).then(response => {
    console.log(response);
  }).catch(error => {
    if (error.response) {
      console.log(error.response);
    }
    console.log(error.message);
  });

}

async function converteDados() {
  try {
    const retornoApi = await getRetornaDadosApi()
    gravarArquivo(retornoApi.data)
    const jsonContent = await JSON.parse(fs.readFileSync('answer.json'))
    var descriptografado = descriptografar(jsonContent.numero_casas, jsonContent.cifrado)
    var resumo_criptografico = sha1(descriptografado)
    var rett = '{"numero_casas":' + jsonContent.numero_casas + ',"token":"d165f7b9a60425fc2c18c850c3aca61453778365","cifrado":"uwtlwfrrnsl qfslzfljx, qnpj uneefx, htrj ns tsqd ybt xnejx: ytt gnl fsi ytt xrfqq. wnhmfwi ufyynx", "decifrado":"' + descriptografado +'","resumo_criptografico":"' + resumo_criptografico + '"}'
    
    var envio = await JSON.parse(rett)
    gravarArquivo(envio)
   // var envio = await JSON.parse(fs.readFileSync('answer.json'))
   // console.log(JSON.stringify(envio.data))

    enviaDadosApi()
  } catch (err) {
    console.log(err)
  }
}

function gravarArquivo(conteudo){
  fs.writeFile("answer.json", JSON.stringify(conteudo) , err => {
    console.log(err)
  })
}

function descriptografar(index, texto){
  const ret = texto.split('').map(i => {
    if ((i == ' ') || (i == ',') || (i == '.') || (i == ':')) {
      return i
    }
    if(i.charCodeAt() - index > 122){
      return 'a'
    }else if(i.charCodeAt() - index < 97){
      return String.fromCharCode(i.charCodeAt() + 21) 
    }
    return String.fromCharCode(i.charCodeAt() - index)
})

return ret.join('')
}

function sha1(data) {
  return crypto.createHash("sha1").update(data, "binary").digest("hex");
}

//console.log(descriptografar(5, 'uwtlwfrrnsl qfslzfljx, qnpj uneefx, htrj ns tsqd ybt xnejx: ytt gnl fsi ytt xrfqq. wnhmfwi ufyynx'))
//gravarArquivo('{"numero_casas":5,"token":"d165f7b9a60425fc2c18c850c3aca61453778365","cifrado":"uwtlwfrrnsl qfslzfljx, qnpj uneefx, htrj ns tsqd ybt xnejx: ytt gnl fsi ytt xrfqq. wnhmfwi ufyynx","decifrado":"","resumo_criptografico":""}')

converteDados()