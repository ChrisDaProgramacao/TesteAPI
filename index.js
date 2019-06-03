const axios = require("axios")
const fs = require("fs")
const crypto = require("crypto");
const request = require('request-json');


async function getRetornaDadosApi(){
  return await axios.get('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=d165f7b9a60425fc2c18c850c3aca61453778365')
}

function enviaDadosApi(jsonEnvio) {
  axios.post('https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=d165f7b9a60425fc2c18c850c3aca61453778365',jsonEnvio)
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
}

async function converteDados() {
  try {
    const retornoApi = await getRetornaDadosApi()
    gravarArquivo(retornoApi.data)
    const jsonContent = await JSON.parse(fs.readFileSync('answer.json'))
    var descriptografado = descriptografar(jsonContent.numero_casas, jsonContent.cifrado)
   // console.log(jsonContent)
    //console.log(retornoApi.data)
    console.log(descriptografado)
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
      return 'z'
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